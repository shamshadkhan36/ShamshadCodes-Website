import pytest
from unittest.mock import MagicMock
from worker.pipeline import DemoPipeline
from worker.models import LeadRow
from worker.vercel_deployer import VercelDeployer

def test_pipeline_dry_run_batch_limit():
    mock_sheets = MagicMock()
    # Return 7 ready leads
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

    assert result.success is True
    assert result.processedCount == 5
    # In dry run, sheets update_lead_demo_metadata should NOT be called
    mock_sheets.update_lead_demo_metadata.assert_not_called()

def test_pipeline_invalid_lead_handling():
    mock_sheets = MagicMock()
    invalid_lead = LeadRow(
        rowIndex=2,
        worksName="", # empty business name -> should fail validation
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

    assert result.success is True
    assert result.failedCount == 1
    assert result.deployedCount == 0
    # Should record failure in sheet
    mock_sheets.update_lead_demo_metadata.assert_called_once()
    args, kwargs = mock_sheets.update_lead_demo_metadata.call_args
    assert kwargs.get("demo_status") == "FAILED"
