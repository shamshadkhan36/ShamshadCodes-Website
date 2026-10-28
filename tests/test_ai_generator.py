import pytest
from worker.ai_generator import classify_category, AIContentGenerator
from worker.models import LeadRow

def test_classify_category():
    assert classify_category("Real estate consultant", "Prinal Real Estate") == "real_estate"
    assert classify_category("Land broker", "Sea Beach Plot Umbergaon") == "real_estate"
    assert classify_category("Interior designer", "Luxury Decor Studio") == "interior_design"
    assert classify_category("Hospitality", "Sunrise Heritage Hotel") == "hotel"
    assert classify_category("Education", "Little Angels Academy") == "education"
    assert classify_category("Consultant", "Shamshad IT Solutions") == "professional_services"

def test_ai_generator_deterministic():
    generator = AIContentGenerator()
    lead = LeadRow(
        rowIndex=2,
        worksName="Prinal Real Estate Property",
        companyCategory="Real estate consultant",
        address="coastal highway, Umbergaon",
        mobileNumber="8866359740",
        website="N/A",
        siteType="new"
    )

    data = generator.generate_demo_content(lead, "prinal-real-estate-property")
    assert data.slug == "prinal-real-estate-property"
    assert data.templateType == "real_estate"
    assert data.businessName == "Prinal Real Estate Property"
    assert len(data.services) >= 3
    assert len(data.features) >= 3
    assert data.contact.phoneRaw == "8866359740"
    assert data.disclaimer.isConcept is True
