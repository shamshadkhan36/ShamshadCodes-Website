import logging
from typing import List, Dict, Any, Optional, Set
from datetime import datetime
import gspread
from google.oauth2.service_account import Credentials
from .config import settings
from .models import LeadRow, DemoSiteType

logger = logging.getLogger("sheets_service")

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

def determine_site_type(website: str) -> DemoSiteType:
    """
    Checks if a lead already has an active website or is a candidate for a new site.
    """
    if not website:
        return "new"
    val = website.strip().lower()
    if val in ("n/a", "na", "none", "null", "-", "no", "no website"):
        return "new"
    if "." in val or val.startswith("http"):
        return "redesign"
    return "new"

class GoogleSheetsService:
    def __init__(self, credentials_path: Optional[str] = None, sheet_name: Optional[str] = None):
        self.credentials_path = credentials_path or settings.GOOGLE_CREDENTIALS_PATH
        self.sheet_name = sheet_name or settings.GOOGLE_SHEET_NAME
        self.client: Optional[gspread.Client] = None
        self.spreadsheet: Optional[gspread.Spreadsheet] = None
        self.worksheet: Optional[gspread.Worksheet] = None

    def connect(self):
        """Authenticates with Google Sheets API."""
        if not self.client:
            creds = Credentials.from_service_account_file(
                self.credentials_path,
                scopes=SCOPES
            )
            self.client = gspread.authorize(creds)
            self.spreadsheet = self.client.open(self.sheet_name)
            self.worksheet = self.spreadsheet.worksheet(settings.GOOGLE_WORKSHEET_NAME)
            logger.info("Connected to Google Sheet: %s -> %s", self.sheet_name, self.worksheet.title)

    def ensure_headers(self):
        """
        Ensures columns L-Q have proper header labels without disturbing A-K.
        """
        self.connect()
        assert self.worksheet is not None
        headers = self.worksheet.row_values(1)
        expected_l_q = [
            "demo_slug",
            "demo_status",
            "demo_url",
            "demo_generated_at",
            "outreach_approved",
            "error_message"
        ]
        
        # Check if row 1 has at least 17 columns or if L-Q need initialization
        current_l_q = headers[11:17] if len(headers) >= 17 else headers[11:]
        if current_l_q != expected_l_q:
            logger.info("Initializing columns L-Q headers in row 1")
            # Update strictly range L1:Q1
            self.worksheet.update(
                range_name="L1:Q1",
                values=[expected_l_q]
            )

    def get_all_leads(self, max_rows: int = 100) -> List[LeadRow]:
        """
        Reads rows from the sheet safely mapping columns A-Q.
        Never modifies columns A-K.
        """
        self.connect()
        assert self.worksheet is not None

        # Fetch all values
        all_rows = self.worksheet.get_all_values()
        leads: List[LeadRow] = []

        if not all_rows:
            return leads

        # Row 0 is headers, data starts at index 1 (row 2 in spreadsheet)
        for idx, row in enumerate(all_rows[1:max_rows + 1], start=2):
            # Pad row if needed
            padded = row + [""] * max(0, 17 - len(row))

            map_link = padded[settings.COL_MAP_LINK - 1].strip()
            works_name = padded[settings.COL_WORKS - 1].strip()
            category = padded[settings.COL_COMPANY_NAME - 1].strip()
            address = padded[settings.COL_ADDRESS - 1].strip()
            mobile = padded[settings.COL_MOBILE - 1].strip()
            website = padded[settings.COL_WEBSITE - 1].strip()
            existing_status = padded[settings.COL_EXISTING_STATUS - 1].strip()

            demo_slug = padded[settings.COL_DEMO_SLUG - 1].strip()
            demo_status = padded[settings.COL_DEMO_STATUS - 1].strip().upper()
            demo_url = padded[settings.COL_DEMO_URL - 1].strip()
            generated_at = padded[settings.COL_DEMO_GENERATED_AT - 1].strip()
            outreach = padded[settings.COL_OUTREACH_APPROVED - 1].strip().upper()
            error_msg = padded[settings.COL_ERROR_MESSAGE - 1].strip()

            # Skip completely empty business name rows
            if not works_name and not address and not mobile:
                continue

            site_type = determine_site_type(website)

            lead = LeadRow(
                rowIndex=idx,
                googleMapLink=map_link,
                worksName=works_name,
                companyCategory=category,
                address=address,
                mobileNumber=mobile,
                website=website,
                existingStatus=existing_status,
                demoSlug=demo_slug,
                demoStatus=demo_status,
                demoUrl=demo_url,
                demoGeneratedAt=generated_at,
                outreachApproved=outreach or "PENDING",
                errorMessage=error_msg,
                siteType=site_type
            )
            leads.append(lead)

        return leads

    def get_ready_leads(self, limit: int = 5) -> List[LeadRow]:
        """
        Fetches only rows explicitly marked with demo_status == 'READY'.
        Limits to maximum allowed batch size (default 5).
        """
        all_leads = self.get_all_leads()
        ready = [l for l in all_leads if l.demoStatus == "READY"]
        return ready[:limit]

    def get_existing_slugs(self) -> Set[str]:
        """
        Extracts all existing demo slugs from column L to prevent duplicates.
        """
        self.connect()
        assert self.worksheet is not None
        try:
            slugs = self.worksheet.col_values(settings.COL_DEMO_SLUG)
            # Filter out header and empty values
            return {s.strip().lower() for s in slugs[1:] if s.strip()}
        except Exception as e:
            logger.error("Error reading existing slugs: %s", e)
            return set()

    def update_lead_demo_metadata(
        self,
        row_index: int,
        demo_slug: str,
        demo_status: str,
        demo_url: str,
        generated_at: str,
        outreach_approved: str,
        error_message: str = ""
    ):
        """
        Writes exclusively to columns L through Q for the specified row.
        Never touches or shifts columns A through K.
        Range: L{row_index}:Q{row_index}
        """
        self.connect()
        assert self.worksheet is not None

        values = [[
            demo_slug,
            demo_status,
            demo_url,
            generated_at,
            outreach_approved,
            error_message
        ]]

        range_target = f"L{row_index}:Q{row_index}"
        logger.info("Writing demo metadata to %s: %s", range_target, values[0])

        self.worksheet.update(
            range_name=range_target,
            values=values
        )

    def set_lead_status(self, row_index: int, status: str):
        """Updates only column M (demo_status) for a row."""
        self.connect()
        assert self.worksheet is not None
        self.worksheet.update_cell(row_index, settings.COL_DEMO_STATUS, status.upper())

    def set_outreach_approval(self, row_index: int, status: str = "APPROVED"):
        """Updates only column P (outreach_approved) for a row."""
        self.connect()
        assert self.worksheet is not None
        self.worksheet.update_cell(row_index, settings.COL_OUTREACH_APPROVED, status.upper())
