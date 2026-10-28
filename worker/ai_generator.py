import json
import logging
import re
from datetime import datetime
from typing import Optional, Tuple, List
from .config import settings
from .models import (
    LeadRow, DemoWebsiteData, ServiceItemModel, FeatureItemModel,
    BusinessContactModel, DisclaimerModel, BusinessCategory
)

logger = logging.getLogger("ai_generator")

# Curated High-Resolution Architectural & Industry Imagery (Unsplash CDN)
TEMPLATE_IMAGES = {
    "real_estate": {
        "hero": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80",
        "plots": [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", # Sea Beach Plot
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", # Farmhouse Plot
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80", # Industrial Plot
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", # Luxury Villa
        ]
    },
    "interior_design": {
        "hero": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80",
        "services": [
            "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "hotel": {
        "hero": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
        "services": [
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "education": {
        "hero": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80",
        "services": [
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80"
        ]
    },
    "professional_services": {
        "hero": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80",
        "services": [
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
        ]
    }
}

def extract_clean_brand(raw_name: str) -> Tuple[str, List[str]]:
    """
    Separates a brand identity from comma-separated descriptor keywords.
    E.g.: 'Prinal Real Estate Property, Farm House Plot, 1 Acre Plot, Industrial Plot, Sea Beach Plot, Umbergaon Gujrat Property'
    -> brand: 'Prinal Real Estate Property'
    -> tags: ['Farm House Plots', '1 Acre Plots', 'Industrial Plots', 'Sea Beach Plots', 'Umbergaon Coastal Property']
    """
    if not raw_name:
        return "Premier Enterprise", []
    
    parts = [p.strip() for p in re.split(r'[,|/•]', raw_name) if p.strip()]
    if not parts:
        return raw_name.strip(), []
    
    brand_name = parts[0]
    # Clean up trailing words like 'Property' if duplicated
    brand_name = re.sub(r'\s+', ' ', brand_name).strip()

    tags = []
    for p in parts[1:]:
        clean_tag = p.strip()
        if len(clean_tag) > 2 and clean_tag.lower() not in [t.lower() for t in tags]:
            tags.append(clean_tag)

    return brand_name, tags

def classify_category(category_text: str, business_name: str) -> BusinessCategory:
    combined = f"{category_text} {business_name}".lower()
    if any(k in combined for k in ["real estate", "property", "plot", "land", "acres", "realtor", "broker"]):
        return "real_estate"
    if any(k in combined for k in ["interior", "decor", "architect", "renovation", "furniture"]):
        return "interior_design"
    if any(k in combined for k in ["hotel", "resort", "cottage", "stay", "guest house", "lodging"]):
        return "hotel"
    if any(k in combined for k in ["school", "academy", "classes", "institute", "college", "tutor"]):
        return "education"
    return "professional_services"

def format_phone_display(phone_raw: str) -> Tuple[str, str]:
    digits = re.sub(r'\D', '', phone_raw)
    if not digits:
        return "Direct Inquiry", ""
    if len(digits) == 10:
        return f"+91 {digits[:5]} {digits[5:]}", digits
    elif len(digits) == 12 and digits.startswith("91"):
        return f"+91 {digits[2:7]} {digits[7:]}", digits[2:]
    return phone_raw, digits

def build_whatsapp_link(phone_digits: str, brand_name: str, site_type: str) -> str:
    num = phone_digits
    if len(num) == 10:
        num = f"91{num}"
    pitch = "I saw your website concept" if site_type == "new" else "I saw your website redesign concept"
    msg = f"Hello {brand_name}, {pitch} on ShamshadCodes and would like to inquire about your property listings."
    encoded_msg = re.sub(r'\s+', '%20', msg)
    return f"https://wa.me/{num}?text={encoded_msg}"

class AIContentGenerator:
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.gemini_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL

    def generate_demo_content(self, lead: LeadRow, slug: str) -> DemoWebsiteData:
        brand_name, brand_tags = extract_clean_brand(lead.worksName)
        template_type = classify_category(lead.companyCategory, lead.worksName)
        phone_display, phone_digits = format_phone_display(lead.mobileNumber)
        whatsapp_url = build_whatsapp_link(phone_digits, brand_name, lead.siteType)

        addr = lead.address or "Local Region"
        cat = lead.companyCategory or "Real Estate Consultant"
        is_redesign = lead.siteType == "redesign"

        # Modern high-end Real Estate copy
        if template_type == "real_estate":
            # Extract key plot types from tags if available
            has_beach = any("beach" in t.lower() for t in brand_tags) or "beach" in lead.worksName.lower()
            has_farm = any("farm" in t.lower() or "acre" in t.lower() for t in brand_tags) or "farm" in lead.worksName.lower()
            has_industrial = any("industrial" in t.lower() for t in brand_tags) or "industrial" in lead.worksName.lower()

            tagline = f"Exclusive Land & Property Investments in {addr}"
            hero_head = f"Prime Coastal, Farmhouse & Commercial Land Across {addr}"
            hero_sub = (
                f"Curated portfolio of high-appreciation land parcels, beachfront retreats, and strategic industrial acreage. "
                f"Advised by {brand_name} with verified titles and transparent documentation."
            )
            about = (
                f"{brand_name} is a premier land advisory firm rooted along {addr}. "
                "We connect discerning investors, families, and commercial enterprises with verified land assets. "
                "Every parcel is physically inspected and backed by complete revenue record screening."
            )
            val_prop = "100% verified legal titles, direct owner negotiation, and seamless on-ground site assistance."

            services = [
                ServiceItemModel(
                    id="s1",
                    title="Sea Beach & Coastal Villa Plots" if has_beach else "Prime Residential Plots",
                    description=f"Scenic, high-value land parcels situated minutes from the shoreline along {addr}. Ideal for luxury private villas and holiday retreats.",
                    highlights=["100% Clear Title & Demarcation", "Direct Coastal Highway Connectivity", "Immediate Registry & Possession"],
                ),
                ServiceItemModel(
                    id="s2",
                    title="Farm House & 1 Acre Acreages" if has_farm else "Agricultural Land Parcels",
                    description="Expansive green farm plots with fertile soil, water table access, and serene surroundings. Perfect for organic retreats and family estates.",
                    highlights=["Sizes from 1 to 5+ Acres", "Fenced Boundaries & Power Access", "High Long-Term Appreciation"],
                ),
                ServiceItemModel(
                    id="s3",
                    title="Industrial & Logistics Land" if has_industrial else "Commercial Development Land",
                    description="Strategic commercial plots with heavy-vehicle road frontage and proximity to industrial growth corridors.",
                    highlights=["Zoned for Warehousing & Production", "Wide Access Roads & 3-Phase Power", "Fast-Track Regulatory Approvals"],
                )
            ]

            features = [
                FeatureItemModel(
                    id="f1",
                    title="Verified Revenue Records",
                    description="Every property undergoes meticulous 7/12 title checks and boundary verifications before listing."
                ),
                FeatureItemModel(
                    id="f2",
                    title="Direct WhatsApp Site Booking",
                    description="Instantly receive survey maps, Google location pins, and arrange private guided site inspections."
                ),
                FeatureItemModel(
                    id="f3",
                    title="Deep Local Footprint",
                    description=f"Authoritative on-ground market knowledge covering growth trends, upcoming infrastructure, and realistic valuations in {addr}."
                )
            ]

            primary_cta = "Schedule VIP Site Visit"
            secondary_cta = "Download Plot Layouts"
            accent = "#f59e0b" # Luxury amber / gold

        elif template_type == "interior_design":
            tagline = f"Architectural Elegance & Luxury Interiors in {addr}"
            hero_head = f"Crafting Timeless Living Environments & Bespoke Interiors"
            hero_sub = f"Harmonizing form, function, and luxury materiality. Designed by {brand_name} for discerning homes and commercial spaces."
            about = f"Based in {addr}, {brand_name} transforms spatial concepts into refined living realities through bespoke cabinetry, curated lighting, and turnkey execution."
            val_prop = "Turnkey project management, transparent material sourcing, and 3D precision visualization."
            services = [
                ServiceItemModel(id="s1", title="Turnkey Residential Architecture", description="End-to-end luxury living, master suite, and spatial design.", highlights=["Custom modular joinery", "Bespoke architectural lighting"]),
                ServiceItemModel(id="s2", title="Modern Modular Kitchens", description="Ergonomic culinary spaces with European hardware.", highlights=["Quartz countertops", "Smart storage systems"]),
                ServiceItemModel(id="s3", title="Commercial & Executive Suites", description="Corporate workspaces engineered for aesthetics and focus.", highlights=["Acoustic optimization", "Refined executive ambiance"])
            ]
            features = [
                FeatureItemModel(id="f1", title="Photorealistic 3D Renders", description="Walk through your space in detail before physical build begins."),
                FeatureItemModel(id="f2", title="Premium Material Integrity", description="Hand-selected woods, Italian marbles, and vetted hardware."),
                FeatureItemModel(id="f3", title="Dedicated Project Lead", description="Single point of accountability ensuring strict timeline compliance.")
            ]
            primary_cta = "Book Design Consultation"
            secondary_cta = "View Spatial Portfolio"
            accent = "#d97706"

        elif template_type == "hotel":
            tagline = f"Coastal Tranquility & Bespoke Hospitality in {addr}"
            hero_head = f"Experience Coastal Serenity & Warm Heritage Hospitality"
            hero_sub = f"Relax in spacious oceanfront suites, savor authentic regional delicacies, and recharge at {brand_name}."
            about = f"Situated in {addr}, {brand_name} welcomes travelers, families, and weekenders seeking unhurried relaxation."
            val_prop = "Spacious ocean-breeze rooms, lush garden surroundings, and attentive hospitality."
            services = [
                ServiceItemModel(id="s1", title="Luxury Deluxe Suites", description="Air-conditioned heritage suites with private balconies and ocean vistas.", highlights=["Plush king bedding", "Rain showers & high-speed Wi-Fi"]),
                ServiceItemModel(id="s2", title="Garden Dining & Regional Cuisine", description="Farm-fresh ingredients and regional culinary specialties.", highlights=["Al-fresco garden seating", "Complimentary gourmet breakfast"]),
                ServiceItemModel(id="s3", title="Events & Private Gatherings", description="Scenic lawn spaces for family celebrations and intimate retreats.", highlights=["Customized event catering", "Dedicated event coordination"])
            ]
            features = [
                FeatureItemModel(id="f1", title="Shoreline Proximity", description="Just a short stroll to the serene coastal beach and sunsets."),
                FeatureItemModel(id="f2", title="Family & Pet Friendly", description="Expansive manicured grounds and secure gated parking."),
                FeatureItemModel(id="f3", title="Instant Direct Confirmation", description="Book directly on WhatsApp with zero platform commissions.")
            ]
            primary_cta = "Check Room Availability"
            secondary_cta = "Explore Suites & Tariffs"
            accent = "#0284c7"

        elif template_type == "education":
            tagline = f"Nurturing Academic Excellence & Leadership in {addr}"
            hero_head = f"Empowering Curious Minds & Future Leaders at {brand_name}"
            hero_sub = f"Holistic academic curriculum, disciplined mentorship, and experiential learning located at {addr}."
            about = f"{brand_name} fosters intellectual curiosity, emotional intelligence, and scholastic excellence in {addr}."
            val_prop = "Individualized student attention, modern interactive labs, and dedicated educators."
            services = [
                ServiceItemModel(id="s1", title="Foundational Academics", description="Structured syllabus mastery with emphasis on conceptual depth.", highlights=["Small cohort sizes", "Continuous progress monitoring"]),
                ServiceItemModel(id="s2", title="Advanced STEM & Creative Arts", description="Hands-on laboratory sessions, robotics, and creative workshops.", highlights=["Modern learning labs", "Project-based pedagogy"]),
                ServiceItemModel(id="s3", title="Admissions & Academic Counseling", description="Personalized guidance aligning learning tracks with student strengths.", highlights=["Transparent fee schedule", "Regular parent-educator forums"])
            ]
            features = [
                FeatureItemModel(id="f1", title="Distinguished Faculty", description="Passionate mentors committed to inspiring every student."),
                FeatureItemModel(id="f2", title="Modern Campus Facilities", description="Well-equipped libraries, digital classrooms, and safe sports grounds."),
                FeatureItemModel(id="f3", title="Active Parent Engagement", description="Direct communication and real-time student milestone tracking.")
            ]
            primary_cta = "Inquire for Admissions"
            secondary_cta = "Download Prospectus"
            accent = "#059669"

        else: # professional_services
            tagline = f"Strategic Commercial & Professional Advisory in {addr}"
            hero_head = f"Results-Driven Strategic Advisory with {brand_name}"
            hero_sub = f"Partnering with businesses and private clients in {addr} to deliver scalable solutions and high-integrity consulting."
            about = f"Operating from {addr}, {brand_name} combines deep industry expertise with agile execution to solve complex client challenges."
            val_prop = "Senior partner access, measurable business impact, and transparent engagement models."
            services = [
                ServiceItemModel(id="s1", title=f"Core {cat} Solutions", description=f"Comprehensive strategy and technical consulting tailored to {addr}.", highlights=["Actionable roadmap", "Benchmarked industry standards"]),
                ServiceItemModel(id="s2", title="Operational Optimization", description="Streamlining workflows and technology integration for peak efficiency.", highlights=["Rapid turnaround", "Measurable ROI"]),
                ServiceItemModel(id="s3", title="Client Advisory & Retainers", description="Continuous consultation and ongoing strategic support.", highlights=["Direct communication line", "Dedicated advisory team"])
            ]
            features = [
                FeatureItemModel(id="f1", title="Decisive Expertise", description="Proven methodology focused strictly on client outcomes."),
                FeatureItemModel(id="f2", title="Direct Partner Accessibility", description="Work directly with senior professionals without administrative lag."),
                FeatureItemModel(id="f3", title="Uncompromising Integrity", description="Complete confidentiality, transparent scopes, and reliable follow-through.")
            ]
            primary_cta = "Schedule Consultation"
            secondary_cta = "Explore Services"
            accent = "#6366f1"

        return DemoWebsiteData(
            slug=slug,
            businessName=brand_name, # Clean, sleek brand name
            category=cat,
            templateType=template_type,
            siteType=lead.siteType,
            existingWebsiteUrl=lead.website if is_redesign else None,
            tagline=tagline,
            heroHeadline=hero_head,
            heroSubheadline=hero_sub,
            aboutStory=about,
            valueProposition=val_prop,
            services=services,
            features=features,
            contact=BusinessContactModel(
                phone=phone_display,
                phoneRaw=phone_digits,
                whatsappLink=whatsapp_url,
                address=addr,
                googleMapsLink=lead.googleMapLink or None,
                websiteUrl=lead.website if is_redesign else None
            ),
            primaryCtaText=primary_cta,
            secondaryCtaText=secondary_cta,
            accentColor=accent,
            generatedAt=datetime.utcnow().isoformat() + "Z",
            disclaimer=DisclaimerModel(
                isConcept=True,
                conceptNotice=f"ShamshadCodes Concept Preview — Unofficial demonstration created for {brand_name}. Not affiliated with or endorsed by {brand_name}.",
                redesignNotice="Redesign Proposal: Highlighting ultra-fast mobile loading and direct WhatsApp lead capture." if is_redesign else None
            )
        )
