import unittest
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from worker.slug_service import clean_business_name_for_slug, generate_unique_slug
from worker.sheets_service import determine_site_type
from worker.ai_generator import format_phone_display, build_whatsapp_link, classify_category, AIContentGenerator
from worker.models import LeadRow
from worker.pipeline import DemoPipeline
from unittest.mock import MagicMock

class TestWebsiteFactorySuite(unittest.TestCase):
    def test_clean_business_name_for_slug(self):
        name1 = "Prinal Real Estate Property, Farm House Plot, 1 Acre Plot, Industrial Plot, Sea Beach Plot, Umbergaon Gujrat Property"
        self.assertEqual(clean_business_name_for_slug(name1), "prinal-real-estate-property")

        name2 = "Pranay Prabhu Real Estate Consultancy"
        self.assertEqual(clean_business_name_for_slug(name2), "pranay-prabhu-real-estate-consultancy")

        name3 = "ABC Interiors & Renovations! #1 Studio"
        self.assertEqual(clean_business_name_for_slug(name3), "abc-interiors-renovations-1-studio")

        self.assertEqual(clean_business_name_for_slug(""), "business-demo")

    def test_slug_deduplication(self):
        existing = {"prinal-real-estate-property", "prinal-real-estate-property-2"}
        new_slug = generate_unique_slug("Prinal Real Estate Property", existing_slugs=existing, demos_dir=Path("/non-existent"))
        self.assertEqual(new_slug, "prinal-real-estate-property-3")

    def test_determine_site_type(self):
        self.assertEqual(determine_site_type(""), "new")
        self.assertEqual(determine_site_type("N/A"), "new")
        self.assertEqual(determine_site_type("none"), "new")
        self.assertEqual(determine_site_type("-"), "new")
        self.assertEqual(determine_site_type("https://pranayprabhu.com"), "redesign")
        self.assertEqual(determine_site_type("www.sunrisehotel.in"), "redesign")

    def test_phone_and_whatsapp_formatting(self):
        display, digits = format_phone_display("8866359740")
        self.assertEqual(display, "+91 88663 59740")
        self.assertEqual(digits, "8866359740")

        url = build_whatsapp_link("8866359740", "Prinal Real Estate", "new")
        self.assertIn("wa.me/918866359740", url)
        self.assertIn("website%20concept", url)

    def test_category_classification(self):
        self.assertEqual(classify_category("Real estate consultant", "Prinal Real Estate"), "real_estate")
        self.assertEqual(classify_category("Interior designer", "Luxury Decor Studio"), "interior_design")
        self.assertEqual(classify_category("Hospitality", "Sunrise Heritage Hotel"), "hotel")
        self.assertEqual(classify_category("Education", "Little Angels Academy"), "education")
        self.assertEqual(classify_category("Consultant", "Shamshad IT Solutions"), "professional_services")

    def test_ai_generator_deterministic(self):
        generator = AIContentGenerator()
        lead = LeadRow(
            rowIndex=2,
            worksName="Prinal Real Estate Property",
            companyCategory="Real estate consultant",
            address="costal highway, Umbergaon",
            mobileNumber="8866359740",
            website="N/A",
            siteType="new"
        )
        data = generator.generate_demo_content(lead, "prinal-real-estate-property")
        self.assertEqual(data.slug, "prinal-real-estate-property")
        self.assertEqual(data.templateType, "real_estate")
        self.assertEqual(data.businessName, "Prinal Real Estate Property")
        self.assertGreaterEqual(len(data.services), 3)
        self.assertGreaterEqual(len(data.features), 3)
        self.assertEqual(data.contact.phoneRaw, "8866359740")
        self.assertTrue(data.disclaimer.isConcept)

    def test_pipeline_dry_run_batch_limit(self):
        mock_sheets = MagicMock()
        leads = [
            LeadRow(
                rowIndex=i,
                worksName=f"Business Test {i}",
                companyCategory="Real estate consultant",
                address="Test Road",
                mobileNumber="9876543210",
                website="N/A",
                demoStatus="READY"
            )
            for i in range(2, 9)
        ]
        mock_sheets.get_ready_leads.return_value = leads[:5]
        mock_sheets.get_existing_slugs.return_value = set()

        pipeline = DemoPipeline(sheets_service=mock_sheets)
        result = pipeline.run_batch(limit=5, dry_run=True)

        self.assertTrue(result.success)
        self.assertEqual(result.processedCount, 5)
        mock_sheets.update_lead_demo_metadata.assert_not_called()

    def test_pipeline_invalid_lead_handling(self):
        mock_sheets = MagicMock()
        invalid_lead = LeadRow(
            rowIndex=2,
            worksName="",
            companyCategory="Real estate",
            address="",
            mobileNumber="",
            website="",
            demoStatus="READY"
        )
        mock_sheets.get_ready_leads.return_value = [invalid_lead]
        mock_sheets.get_existing_slugs.return_value = set()

        pipeline = DemoPipeline(sheets_service=mock_sheets)
        result = pipeline.run_batch(limit=5, dry_run=False)

        self.assertTrue(result.success)
        self.assertEqual(result.failedCount, 1)
        self.assertEqual(result.deployedCount, 0)
        mock_sheets.update_lead_demo_metadata.assert_called_once()
        args, kwargs = mock_sheets.update_lead_demo_metadata.call_args
        self.assertEqual(kwargs.get("demo_status"), "FAILED")

if __name__ == "__main__":
    unittest.main(verbosity=2)
