import logging
from datetime import datetime
from typing import List, Dict, Any, Optional, Tuple
from .config import settings
from .models import LeadRow, BatchRunResponse
from .sheets_service import GoogleSheetsService
from .slug_service import generate_unique_slug
from .ai_generator import AIContentGenerator
from .vercel_deployer import VercelDeployer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("pipeline")

class DemoPipeline:
    def __init__(
        self,
        sheets_service: Optional[GoogleSheetsService] = None,
        ai_generator: Optional[AIContentGenerator] = None,
        deployer: Optional[VercelDeployer] = None
    ):
        self.sheets_service = sheets_service or GoogleSheetsService()
        self.ai_generator = ai_generator or AIContentGenerator()
        self.deployer = deployer or VercelDeployer()

    def validate_lead(self, lead: LeadRow) -> Tuple[bool, str]:
        """
        Validates business name, phone, and category.
        """
        if not lead.worksName or len(lead.worksName.strip()) < 2:
            return False, "Invalid or missing business name in column B"
        if not lead.mobileNumber or len(lead.mobileNumber.strip()) < 5:
            return False, "Missing or invalid phone number in column E"
        return True, ""

    def run_batch(self, limit: int = 5, dry_run: bool = False) -> BatchRunResponse:
        """
        Executes the batch generation workflow for rows marked READY.
        Strictly limits execution to min(limit, settings.BATCH_SIZE_LIMIT).
        """
        capped_limit = min(limit, settings.BATCH_SIZE_LIMIT)
        logger.info("Starting pipeline execution (dry_run=%s, limit=%d)", dry_run, capped_limit)

        # 1. Connect and verify sheet headers
        if not dry_run:
            try:
                self.sheets_service.ensure_headers()
            except Exception as e:
                logger.error("Failed to connect/ensure headers in Google Sheet: %s", e)
                return BatchRunResponse(
                    success=False,
                    processedCount=0,
                    deployedCount=0,
                    failedCount=0,
                    details=[{"error": f"Google Sheets connection error: {str(e)}"}]
                )

        # 2. Fetch READY leads
        try:
            ready_leads = self.sheets_service.get_ready_leads(limit=capped_limit)
        except Exception as e:
            logger.error("Failed to fetch ready leads: %s", e)
            return BatchRunResponse(
                success=False,
                processedCount=0,
                deployedCount=0,
                failedCount=0,
                details=[{"error": f"Failed to fetch ready leads: {str(e)}"}]
            )

        if not ready_leads:
            logger.info("No leads currently marked 'READY' in column M.")
            return BatchRunResponse(
                success=True,
                processedCount=0,
                deployedCount=0,
                failedCount=0,
                details=[{"message": "No leads currently marked READY in column M"}]
            )

        existing_slugs = self.sheets_service.get_existing_slugs()
        processed_details = []
        deployed_count = 0
        failed_count = 0

        # 3. Process each lead
        for lead in ready_leads:
            logger.info("Processing lead at row %d: %s", lead.rowIndex, lead.worksName)

            # A. Validation
            is_valid, validation_err = self.validate_lead(lead)
            if not is_valid:
                logger.warning("Lead validation failed for row %d: %s", lead.rowIndex, validation_err)
                failed_count += 1
                if not dry_run:
                    self.sheets_service.update_lead_demo_metadata(
                        row_index=lead.rowIndex,
                        demo_slug="",
                        demo_status="FAILED",
                        demo_url="",
                        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                        outreach_approved="REJECTED",
                        error_message=validation_err
                    )
                processed_details.append({
                    "row": lead.rowIndex,
                    "business": lead.worksName,
                    "status": "FAILED",
                    "error": validation_err
                })
                continue

            # B. Generate unique slug
            slug = lead.demoSlug or generate_unique_slug(lead.worksName, existing_slugs)
            existing_slugs.add(slug)

            # C. Update state to GENERATING
            if not dry_run:
                try:
                    self.sheets_service.set_lead_status(lead.rowIndex, "GENERATING")
                except Exception as e:
                    logger.warning("Could not set GENERATING status for row %d: %s", lead.rowIndex, e)

            # D. AI Copy & Template Generation
            try:
                demo_data = self.ai_generator.generate_demo_content(lead, slug)
            except Exception as e:
                logger.error("AI content generation failed for row %d: %s", lead.rowIndex, e)
                failed_count += 1
                if not dry_run:
                    self.sheets_service.update_lead_demo_metadata(
                        row_index=lead.rowIndex,
                        demo_slug=slug,
                        demo_status="FAILED",
                        demo_url="",
                        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
                        outreach_approved="PENDING",
                        error_message=f"AI generation failed: {str(e)}"
                    )
                processed_details.append({
                    "row": lead.rowIndex,
                    "business": lead.worksName,
                    "status": "FAILED",
                    "error": str(e)
                })
                continue

            # E. Deploy & Health Check
            status, preview_url, deploy_error = self.deployer.deploy_and_verify(demo_data, dry_run=dry_run)
            now_str = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")

            if status == "DEPLOYED":
                deployed_count += 1
                logger.info("Successfully deployed row %d -> %s", lead.rowIndex, preview_url)
            else:
                failed_count += 1
                logger.warning("Deployment incomplete for row %d: %s", lead.rowIndex, deploy_error)

            # F. Writeback to Google Sheets columns L-Q
            if not dry_run:
                try:
                    self.sheets_service.update_lead_demo_metadata(
                        row_index=lead.rowIndex,
                        demo_slug=slug,
                        demo_status=status,
                        demo_url=preview_url,
                        generated_at=now_str,
                        outreach_approved="PENDING",
                        error_message=deploy_error
                    )
                except Exception as e:
                    logger.error("Failed to write back metadata for row %d: %s", lead.rowIndex, e)

            processed_details.append({
                "row": lead.rowIndex,
                "business": lead.worksName,
                "slug": slug,
                "status": status,
                "url": preview_url,
                "error": deploy_error
            })

        return BatchRunResponse(
            success=True,
            processedCount=len(ready_leads),
            deployedCount=deployed_count,
            failedCount=failed_count,
            details=processed_details
        )


