import time
import json
import logging
import gspread
from pathlib import Path
from datetime import datetime

from worker.config import settings
from worker.slug_service import clean_business_name_for_slug
from worker.ai_generator import (
    extract_clean_brand, classify_category, format_phone_display,
    build_whatsapp_link, AIContentGenerator
)
from worker.models import (
    LeadRow, DemoWebsiteData, ServiceItemModel, FeatureItemModel,
    BusinessContactModel, DisclaimerModel
)
from worker.sheets_service import determine_site_type

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("batch_all")

def run_batch_population(dry_run: bool = False):
    logger.info("Connecting to Google Sheets...")
    gc = gspread.service_account(filename=settings.GOOGLE_CREDENTIALS_PATH)
    sh = gc.open(settings.GOOGLE_SHEET_NAME)
    ws = sh.worksheet(settings.GOOGLE_WORKSHEET_NAME)

    logger.info("Fetching all sheet rows...")
    all_values = ws.get_all_values()
    total_rows = len(all_values)
    logger.info("Total rows in sheet: %d", total_rows)

    if total_rows <= 1:
        logger.warning("No data rows found.")
        return

    demos_dir = settings.PUBLIC_DEMOS_DIR
    demos_dir.mkdir(parents=True, exist_ok=True)

    seen_slugs = set()
    generator = AIContentGenerator()
    now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

    update_matrix = []
    generated_demos_count = 0

    logger.info("Generating slugs, copy, and demos for rows 2 to %d...", total_rows)
    start_time = time.time()

    for idx, row in enumerate(all_values[1:], start=2):
        # Pad row to at least 17 columns
        padded = row + [""] * max(0, 17 - len(row))

        map_link = padded[settings.COL_MAP_LINK - 1].strip()
        raw_works = padded[settings.COL_WORKS - 1].strip()
        raw_category = padded[settings.COL_COMPANY_NAME - 1].strip()
        address = padded[settings.COL_ADDRESS - 1].strip()
        mobile = padded[settings.COL_MOBILE - 1].strip()
        website = padded[settings.COL_WEBSITE - 1].strip()
        existing_status = padded[settings.COL_EXISTING_STATUS - 1].strip()

        # If business name is missing, use category or address fallback
        if not raw_works:
            raw_works = f"{raw_category} {address}".strip() or f"Business Lead {idx}"

        # Clean brand name & slug
        brand_name, brand_tags = extract_clean_brand(raw_works)
        base_slug = clean_business_name_for_slug(brand_name)
        
        # Deduplicate slug across the 3,820 rows
        candidate_slug = base_slug
        counter = 2
        while candidate_slug in seen_slugs:
            candidate_slug = f"{base_slug}-{counter}"
            counter += 1
        seen_slugs.add(candidate_slug)

        site_type = determine_site_type(website)
        demo_url = f"{settings.BASE_DEMO_URL}/{candidate_slug}"

        # Row 2 preserves its existing generated slug if already set
        if idx == 2 and padded[settings.COL_DEMO_SLUG - 1].strip():
            candidate_slug = padded[settings.COL_DEMO_SLUG - 1].strip()
            demo_url = f"{settings.BASE_DEMO_URL}/{candidate_slug}"

        lead = LeadRow(
            rowIndex=idx,
            googleMapLink=map_link,
            worksName=raw_works,
            companyCategory=raw_category,
            address=address,
            mobileNumber=mobile,
            website=website,
            existingStatus=existing_status,
            demoSlug=candidate_slug,
            demoStatus="DEPLOYED",
            demoUrl=demo_url,
            demoGeneratedAt=now_str,
            outreachApproved="PENDING",
            errorMessage="",
            siteType=site_type
        )

        # Generate structured content
        demo_data = generator.generate_demo_content(lead, candidate_slug)

        # Save to public/demos/{candidate_slug}.json
        if not dry_run:
            json_file = demos_dir / f"{candidate_slug}.json"
            with open(json_file, "w", encoding="utf-8") as f:
                f.write(demo_data.model_dump_json(indent=2))

        # Matrix row for cols L-Q: [demo_slug, demo_status, demo_url, demo_generated_at, outreach_approved, error_message]
        update_matrix.append([
            candidate_slug,
            "DEPLOYED",
            demo_url,
            now_str,
            "PENDING",
            ""
        ])

        generated_demos_count += 1
        if generated_demos_count % 500 == 0:
            logger.info("Processed %d / %d demos...", generated_demos_count, total_rows - 1)

    elapsed = time.time() - start_time
    logger.info("Generated %d demo files in %.2f seconds.", generated_demos_count, elapsed)

    if dry_run:
        logger.info("[DRY-RUN] Finished without writing to Google Sheets.")
        print(f"Sample row 2 matrix: {update_matrix[0]}")
        print(f"Sample row 3 matrix: {update_matrix[1]}")
        print(f"Sample last row matrix: {update_matrix[-1]}")
        return

    # Write all rows in a single batch range update to columns L-Q!
    target_range = f"L2:Q{len(update_matrix) + 1}"
    logger.info("Writing batch range update to Google Sheet (%s)...", target_range)
    ws.update(range_name=target_range, values=update_matrix)
    logger.info("Successfully updated all %d rows in Google Sheet in a single atomic batch call!", len(update_matrix))

if __name__ == "__main__":
    import sys
    dry = "--dry-run" in sys.argv
    run_batch_population(dry_run=dry)
