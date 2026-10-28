import pytest
from pathlib import Path
from worker.slug_service import clean_business_name_for_slug, generate_unique_slug

def test_clean_business_name_for_slug():
    name1 = "Prinal Real Estate Property, Farm House Plot, 1 Acre Plot, Industrial Plot, Sea Beach Plot, Umbergaon Gujrat Property"
    slug1 = clean_business_name_for_slug(name1)
    assert slug1 == "prinal-real-estate-property"

    name2 = "Pranay Prabhu Real Estate Consultancy"
    slug2 = clean_business_name_for_slug(name2)
    assert slug2 == "pranay-prabhu-real-estate-consultancy"

    name3 = "ABC Interiors & Renovations! #1 Studio"
    slug3 = clean_business_name_for_slug(name3)
    assert slug3 == "abc-interiors-renovations-1-studio"

    # Empty name fallback
    assert clean_business_name_for_slug("") == "business-demo"

def test_generate_unique_slug_deduplication(tmp_path):
    existing = {"prinal-real-estate-property", "prinal-real-estate-property-2"}
    new_slug = generate_unique_slug("Prinal Real Estate Property", existing_slugs=existing, demos_dir=tmp_path)
    assert new_slug == "prinal-real-estate-property-3"

def test_generate_unique_slug_with_file_existing(tmp_path):
    # Create existing file on disk
    (tmp_path / "sunrise-hotel.json").write_text("{}")
    new_slug = generate_unique_slug("Sunrise Hotel", existing_slugs=set(), demos_dir=tmp_path)
    assert new_slug == "sunrise-hotel-2"
