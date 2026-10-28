from typing import List, Optional, Literal
from pydantic import BaseModel, Field

BusinessCategory = Literal[
    'real_estate',
    'interior_design',
    'hotel',
    'education',
    'professional_services'
]

DemoSiteType = Literal['new', 'redesign']

DemoStatusType = Literal[
    'READY',
    'GENERATING',
    'DEPLOYING',
    'DEPLOYED',
    'FAILED',
    'ERROR',
    ''
]

class ServiceItemModel(BaseModel):
    id: str = Field(description="Unique service ID like s1, s2")
    title: str = Field(description="Honest name of the service or property type")
    description: str = Field(description="Accurate factual description of the service")
    highlights: Optional[List[str]] = Field(default_factory=list, description="List of 2-3 genuine focus points")

class FeatureItemModel(BaseModel):
    id: str = Field(description="Unique feature ID like f1, f2")
    title: str = Field(description="Key benefit or strength")
    description: str = Field(description="Clear explanation without fake claims or awards")

class BusinessContactModel(BaseModel):
    phone: str
    phoneRaw: str
    whatsappLink: str
    address: str
    googleMapsLink: Optional[str] = None
    websiteUrl: Optional[str] = None

class DisclaimerModel(BaseModel):
    isConcept: bool = True
    conceptNotice: str
    redesignNotice: Optional[str] = None

class DemoWebsiteData(BaseModel):
    slug: str
    businessName: str
    category: str
    templateType: BusinessCategory
    siteType: DemoSiteType
    existingWebsiteUrl: Optional[str] = None
    tagline: str
    heroHeadline: str
    heroSubheadline: str
    aboutStory: str
    valueProposition: str
    services: List[ServiceItemModel]
    features: List[FeatureItemModel]
    contact: BusinessContactModel
    primaryCtaText: str
    secondaryCtaText: str
    accentColor: Optional[str] = "#4f46e5"
    generatedAt: str
    disclaimer: DisclaimerModel

class LeadRow(BaseModel):
    rowIndex: int
    googleMapLink: str = ""
    worksName: str = ""
    companyCategory: str = ""
    address: str = ""
    mobileNumber: str = ""
    website: str = ""
    existingStatus: str = ""
    demoSlug: str = ""
    demoStatus: str = ""
    demoUrl: str = ""
    demoGeneratedAt: str = ""
    outreachApproved: str = ""
    errorMessage: str = ""
    siteType: DemoSiteType = "new"

class BatchRunRequest(BaseModel):
    dryRun: bool = False
    limit: int = 5

class BatchRunResponse(BaseModel):
    success: bool
    processedCount: int
    deployedCount: int
    failedCount: int
    details: List[dict]
