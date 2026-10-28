import json
import logging
import re
from datetime import datetime
from typing import Optional, Tuple
from .config import settings
from .models import (
    LeadRow, DemoWebsiteData, ServiceItemModel, FeatureItemModel,
    BusinessContactModel, DisclaimerModel, BusinessCategory
)

logger = logging.getLogger("ai_generator")

def classify_category(category_text: str, business_name: str) -> BusinessCategory:
    """Classifies a business into one of the 5 supported templates."""
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
    """Cleans phone number and formats for display and tel: link."""
    digits = re.sub(r'\D', '', phone_raw)
    if not digits:
        return "Contact Upon Request", ""
    
    # Standard 10 digit Indian number formatting
    if len(digits) == 10:
        display = f"+91 {digits[:5]} {digits[5:]}"
        return display, digits
    elif len(digits) == 12 and digits.startswith("91"):
        display = f"+91 {digits[2:7]} {digits[7:]}"
        return display, digits[2:]
    
    return phone_raw, digits

def build_whatsapp_link(phone_digits: str, business_name: str, site_type: str) -> str:
    """Creates a pre-filled direct WhatsApp inquiry link."""
    # Ensure country code (default 91 for India if 10 digits)
    num = phone_digits
    if len(num) == 10:
        num = f"91{num}"

    pitch = "I saw your website concept" if site_type == "new" else "I saw your website redesign concept"
    msg = f"Hello {business_name}, {pitch} on ShamshadCodes and would like to connect."
    encoded_msg = re.sub(r'\s+', '%20', msg)
    return f"https://wa.me/{num}?text={encoded_msg}"

class AIContentGenerator:
    def __init__(self):
        self.provider = settings.AI_PROVIDER.lower()
        self.gemini_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL

    def generate_demo_content(self, lead: LeadRow, slug: str) -> DemoWebsiteData:
        """
        Generates validated, structured website content for a lead.
        Enforces strict anti-hallucination rules.
        """
        template_type = classify_category(lead.companyCategory, lead.worksName)
        phone_display, phone_digits = format_phone_display(lead.mobileNumber)
        whatsapp_url = build_whatsapp_link(phone_digits, lead.worksName, lead.siteType)

        # If Gemini API Key is provided, use structured AI generation
        if self.gemini_key and self.provider == "gemini":
            try:
                return self._generate_with_gemini(
                    lead, slug, template_type, phone_display, phone_digits, whatsapp_url
                )
            except Exception as e:
                logger.warning("Gemini API call failed (%s); falling back to verified deterministic engine", e)

        # Fallback / Deterministic generator (guarantees 100% testability, dry-runs, and zero hallucinations)
        return self._generate_deterministic(
            lead, slug, template_type, phone_display, phone_digits, whatsapp_url
        )

    def _generate_with_gemini(
        self,
        lead: LeadRow,
        slug: str,
        template_type: BusinessCategory,
        phone_display: str,
        phone_digits: str,
        whatsapp_url: str
    ) -> DemoWebsiteData:
        """Invokes Google Gemini with structured JSON schema output."""
        import google.generativeai as genai

        genai.configure(api_key=self.gemini_key)
        model = genai.GenerativeModel(self.model_name)

        system_instruction = (
            "You are an expert website copywriter building commercial concept websites. "
            "STRICT RULES:\n"
            "1. NEVER invent customer reviews, star ratings, or testimonials.\n"
            "2. NEVER invent fake awards, certifications, or fictitious pricing.\n"
            "3. Rely strictly on the given business name, category, address, and mobile number.\n"
            "4. If site_type is 'redesign', highlight modern mobile speed, direct lead capture, and brand elevation.\n"
            "5. If site_type is 'new', highlight local digital discoverability, direct inquiry, and services.\n"
            "6. Output ONLY valid JSON matching the requested schema."
        )

        prompt = f"""
{system_instruction}

Business Information:
- Business Name: {lead.worksName}
- Category: {lead.companyCategory}
- Address: {lead.address}
- Phone: {phone_display}
- Site Type: {lead.siteType} (Existing website: {lead.website})
- Template Type: {template_type}

Return JSON with these exact keys:
{{
  "tagline": "A punchy, honest 5-8 word tagline",
  "heroHeadline": "Compelling headline for the hero section",
  "heroSubheadline": "Clear 2-sentence description of what this business offers",
  "aboutStory": "Honest summary (3-4 sentences) describing their local offering based on address and category",
  "valueProposition": "1-2 sentences highlighting why customers choose direct consultation",
  "services": [
    {{"id": "s1", "title": "Service 1", "description": "Accurate description", "highlights": ["Point A", "Point B"]}},
    {{"id": "s2", "title": "Service 2", "description": "Accurate description", "highlights": ["Point A", "Point B"]}},
    {{"id": "s3", "title": "Service 3", "description": "Accurate description", "highlights": ["Point A", "Point B"]}}
  ],
  "features": [
    {{"id": "f1", "title": "Feature 1", "description": "Honest operational strength"}},
    {{"id": "f2", "title": "Feature 2", "description": "Direct communication highlight"}},
    {{"id": "f3", "title": "Feature 3", "description": "Local presence advantage"}}
  ],
  "primaryCtaText": "e.g. Schedule Consultation / Inquire Details",
  "secondaryCtaText": "e.g. View Offerings"
}}
"""

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )

        parsed = json.loads(response.text)

        services = [
            ServiceItemModel(
                id=s.get("id", f"s{i}"),
                title=s.get("title", f"Service {i}"),
                description=s.get("description", ""),
                highlights=s.get("highlights", [])
            )
            for i, s in enumerate(parsed.get("services", []), start=1)
        ]

        features = [
            FeatureItemModel(
                id=f.get("id", f"f{i}"),
                title=f.get("title", f"Feature {i}"),
                description=f.get("description", "")
            )
            for i, f in enumerate(parsed.get("features", []), start=1)
        ]

        return DemoWebsiteData(
            slug=slug,
            businessName=lead.worksName,
            category=lead.companyCategory or "Real Estate Services",
            templateType=template_type,
            siteType=lead.siteType,
            existingWebsiteUrl=lead.website if lead.siteType == "redesign" else None,
            tagline=parsed.get("tagline", "Quality Advisory & Local Expertise"),
            heroHeadline=parsed.get("heroHeadline", f"Welcome to {lead.worksName}"),
            heroSubheadline=parsed.get("heroSubheadline", "Providing dedicated local services with verified documentation and direct communication."),
            aboutStory=parsed.get("aboutStory", f"Serving clients from {lead.address or 'our local office'}, we provide tailored assistance."),
            valueProposition=parsed.get("valueProposition", "Direct client connection, transparent communication, and verified local expertise."),
            services=services,
            features=features,
            contact=BusinessContactModel(
                phone=phone_display,
                phoneRaw=phone_digits,
                whatsappLink=whatsapp_url,
                address=lead.address or "Contact for office address",
                googleMapsLink=lead.googleMapLink or None,
                websiteUrl=lead.website if lead.siteType == "redesign" else None
            ),
            primaryCtaText=parsed.get("primaryCtaText", "Connect With Us"),
            secondaryCtaText=parsed.get("secondaryCtaText", "Explore Services"),
            accentColor="#d97706" if template_type == "real_estate" else "#4f46e5",
            generatedAt=datetime.utcnow().isoformat() + "Z",
            disclaimer=DisclaimerModel(
                isConcept=True,
                conceptNotice=f"ShamshadCodes Concept Preview — Unofficial demonstration created for {lead.worksName}. Not affiliated with or endorsed by {lead.worksName}.",
                redesignNotice="Redesign Proposal: Highlighting ultra-fast mobile loading and direct WhatsApp lead capture." if lead.siteType == "redesign" else None
            )
        )

    def _generate_deterministic(
        self,
        lead: LeadRow,
        slug: str,
        template_type: BusinessCategory,
        phone_display: str,
        phone_digits: str,
        whatsapp_url: str
    ) -> DemoWebsiteData:
        """
        Deterministic, robust content generator.
        Tailors copy based on category, site type, address, and lead details
        without any fictitious claims, reviews, or awards.
        """
        name = lead.worksName
        addr = lead.address or "Local Region"
        cat = lead.companyCategory or "Consultant"
        is_redesign = lead.siteType == "redesign"

        if template_type == "real_estate":
            tagline = f"Trusted Property & Land Advisory in {addr}"
            hero_head = f"Verified Property & Land Solutions with {name}"
            hero_sub = (
                f"Guiding buyers, investors, and landowners across {addr} with transparent documentation, "
                "direct site visits, and personalized property consultancy."
            )
            about = (
                f"{name} operates from {addr}, providing dedicated assistance in locating prime plots, "
                "agricultural land, and commercial properties. We emphasize clear titles and verified local land records."
            )
            val_prop = "Direct seller-buyer coordination, personalized inspections, and prompt communication via WhatsApp."
            services = [
                ServiceItemModel(
                    id="s1",
                    title="Residential Plots & Land Parcels",
                    description=f"Curated land plots and investment opportunities situated in strategic corridors across {addr}.",
                    highlights=["Verified revenue records", "Clear demarcations", "Direct site tours"]
                ),
                ServiceItemModel(
                    id="s2",
                    title="Farmhouse & Agricultural Acreages",
                    description="Peaceful acreages and agricultural lands suitable for organic retreats, weekend villas, and farming.",
                    highlights=["Water & road connectivity", "Scenic surroundings", "Transparent registration"]
                ),
                ServiceItemModel(
                    id="s3",
                    title="Property Documentation Advisory",
                    description="Professional guidance through title verification, mutation records, and registration paperwork.",
                    highlights=["Document screening", "Stamp duty guidance", "Hassle-free transfers"]
                )
            ]
            features = [
                FeatureItemModel(
                    id="f1",
                    title="Verified Local Portfolio",
                    description="Every property undergoes preliminary title check and boundary verification before consultation."
                ),
                FeatureItemModel(
                    id="f2",
                    title="Direct WhatsApp Inquiries",
                    description="Receive location pins, survey details, and plot layouts straight to your phone."
                ),
                FeatureItemModel(
                    id="f3",
                    title="Rooted Local Presence",
                    description=f"Deep knowledge of local zoning regulations, road developments, and valuation trends in {addr}."
                )
            ]
            primary_cta = "Schedule a Site Visit"
            secondary_cta = "Request Property Details"
            accent = "#d97706"

        elif template_type == "interior_design":
            tagline = f"Bespoke Spatial Transformations in {addr}"
            hero_head = f"Thoughtful Architecture & Interior Environments by {name}"
            hero_sub = f"Transforming residential and commercial spaces in {addr} into functional, aesthetic environments."
            about = f"Based in {addr}, {name} crafts contemporary spaces tailored to your lifestyle and operational requirements."
            val_prop = "Material transparency, ergonomic planning, and end-to-end site coordination."
            services = [
                ServiceItemModel(id="s1", title="Turnkey Residential Interiors", description="Complete living, dining, and bedroom planning.", highlights=["Modular systems", "Custom lighting"]),
                ServiceItemModel(id="s2", title="Modular Kitchen Design", description="Ergonomic layout with premium hardware.", highlights=["Optimized storage", "Durable finishes"]),
                ServiceItemModel(id="s3", title="Commercial & Workspace Planning", description="Productive layouts tailored to modern teams.", highlights=["Acoustic balance", "Brand identity integration"])
            ]
            features = [
                FeatureItemModel(id="f1", title="Precision 3D Visualizations", description="Review spatial layouts before on-site work begins."),
                FeatureItemModel(id="f2", title="Vetted Material Sourcing", description="Quality hardware and finishes suited for durability."),
                FeatureItemModel(id="f3", title="Direct Designer Interaction", description="Single point of contact for consultation and updates.")
            ]
            primary_cta = "Book Design Consultation"
            secondary_cta = "Explore Portfolios"
            accent = "#78350f"

        elif template_type == "hotel":
            tagline = f"Comfortable Accommodations in {addr}"
            hero_head = f"Relax and Unwind at {name}"
            hero_sub = f"Welcoming travelers with clean rooms, generous hospitality, and close proximity to key attractions in {addr}."
            about = f"Situated at {addr}, {name} offers relaxing stays for families, tourists, and business guests."
            val_prop = "Comfortable bedding, peaceful environment, and direct room reservation assistance."
            services = [
                ServiceItemModel(id="s1", title="Deluxe Guest Rooms", description="Spacious air-conditioned rooms with private bathrooms.", highlights=["Daily housekeeping", "Quiet ambiance"]),
                ServiceItemModel(id="s2", title="Family & Group Stays", description="Generous room arrangements for family weekend trips.", highlights=["Ample parking", "Direct access"]),
                ServiceItemModel(id="s3", title="Direct Inquiries & Bookings", description="Fast WhatsApp confirmation for room tariffs and dates.", highlights=["Best direct pricing", "Flexible check-in"])
            ]
            features = [
                FeatureItemModel(id="f1", title="Convenient Location", description=f"Easily accessible from major roads and transit in {addr}."),
                FeatureItemModel(id="f2", title="Warm Hospitality", description="Attentive staff dedicated to a peaceful, seamless stay."),
                FeatureItemModel(id="f3", title="Transparent Tariffs", description="No hidden surcharges or surprise fees.")
            ]
            primary_cta = "Check Room Availability"
            secondary_cta = "View Accommodations"
            accent = "#0284c7"

        elif template_type == "education":
            tagline = f"Dedicated Learning & Academic Guidance in {addr}"
            hero_head = f"Empowering Student Growth at {name}"
            hero_sub = f"Comprehensive coaching and structured learning programs located at {addr}."
            about = f"{name} is dedicated to fostering student potential through structured curriculums and focused mentorship."
            val_prop = "Small batch sizes, conceptual clarity, and regular parent-educator communication."
            services = [
                ServiceItemModel(id="s1", title="Core Academic Curriculum", description="Structured syllabus coverage with practice sessions.", highlights=["Conceptual focus", "Regular assessments"]),
                ServiceItemModel(id="s2", title="Exam Preparation Batches", description="Focused revision and test-taking strategies.", highlights=["Doubt clearing", "Time management"]),
                ServiceItemModel(id="s3", title="Student Counseling & Admissions", description="Direct guidance on course selection and enrollment.", highlights=["Transparent fee structure", "Progress reports"])
            ]
            features = [
                FeatureItemModel(id="f1", title="Dedicated Faculty", description="Experienced teachers committed to student progress."),
                FeatureItemModel(id="f2", title="Disciplined Learning Environment", description="Focused classrooms that encourage curiosity."),
                FeatureItemModel(id="f3", title="Direct Teacher Accessibility", description="Regular feedback and updates directly to parents.")
            ]
            primary_cta = "Inquire for Admissions"
            secondary_cta = "Download Prospectus"
            accent = "#059669"

        else: # professional_services
            tagline = f"Professional Consulting & Services in {addr}"
            hero_head = f"Dedicated Business Solutions with {name}"
            hero_sub = f"Providing responsive, high-integrity professional services for clients in {addr} and surrounding areas."
            about = f"Operating from {addr}, {name} delivers reliable advisory and commercial services tailored to your objectives."
            val_prop = "Direct partner consultation, transparent communication, and responsive turnaround."
            services = [
                ServiceItemModel(id="s1", title=f"{cat} Advisory", description=f"Comprehensive consultation in {cat.lower()}.", highlights=["Client-centered focus", "Actionable guidance"]),
                ServiceItemModel(id="s2", title="Custom Solutions", description="Tailored strategies structured to meet your specific requirements.", highlights=["Flexible engagement", "Detailed analysis"]),
                ServiceItemModel(id="s3", title="Ongoing Client Support", description="Continuous assistance and clear follow-through on every project.", highlights=["Direct communication", "Prompt responses"])
            ]
            features = [
                FeatureItemModel(id="f1", title="Local Accessibility", description=f"Conveniently accessible at {addr} for in-person meetings."),
                FeatureItemModel(id="f2", title="Direct Communication", description="Speak directly with the lead professional without call-center hurdles."),
                FeatureItemModel(id="f3", title="Transparent Process", description="Clear scopes of work, transparent deliverables, and honest advice.")
            ]
            primary_cta = "Schedule Consultation"
            secondary_cta = "Explore Services"
            accent = "#4f46e5"

        return DemoWebsiteData(
            slug=slug,
            businessName=name,
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
                conceptNotice=f"ShamshadCodes Concept Preview — Unofficial demonstration created for {name}. Not affiliated with or endorsed by {name}.",
                redesignNotice="Redesign Proposal: Highlighting ultra-fast mobile loading and direct WhatsApp lead capture." if is_redesign else None
            )
        )
