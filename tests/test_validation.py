import pytest
from worker.sheets_service import determine_site_type
from worker.ai_generator import format_phone_display, build_whatsapp_link

def test_determine_site_type():
    # Candidates for New Website
    assert determine_site_type("") == "new"
    assert determine_site_type("N/A") == "new"
    assert determine_site_type("na") == "new"
    assert determine_site_type("none") == "new"
    assert determine_site_type("-") == "new"
    assert determine_site_type("no website") == "new"

    # Candidates for Redesign
    assert determine_site_type("https://pranayprabhu.com") == "redesign"
    assert determine_site_type("www.sunrisehotel.in") == "redesign"
    assert determine_site_type("mybusiness.co.in") == "redesign"

def test_format_phone_display():
    display, digits = format_phone_display("8866359740")
    assert display == "+91 88663 59740"
    assert digits == "8866359740"

    display2, digits2 = format_phone_display("+91-7021577638")
    assert display2 == "+91 70215 77638"
    assert digits2 == "7021577638"

def test_build_whatsapp_link():
    url = build_whatsapp_link("8866359740", "Prinal Real Estate", "new")
    assert "wa.me/918866359740" in url
    assert "website%20concept" in url
