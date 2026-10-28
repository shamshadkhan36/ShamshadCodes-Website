export type BusinessCategory = 
  | 'real_estate' 
  | 'interior_design' 
  | 'hotel' 
  | 'education' 
  | 'professional_services';

export type DemoSiteType = 'new' | 'redesign';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  highlights?: string[];
  icon?: string;
  image?: string;
  tag?: string;
  badge?: string;
  specs?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface BusinessContact {
  phone: string;
  phoneRaw: string;
  whatsappLink: string;
  address: string;
  googleMapsLink?: string;
  email?: string;
  websiteUrl?: string;
}

export interface DemoContent {
  slug: string;
  businessName: string;
  cleanBrandName?: string;
  brandTags?: string[];
  category: string;
  templateType: BusinessCategory;
  siteType: DemoSiteType;
  existingWebsiteUrl?: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage?: string;
  aboutStory: string;
  valueProposition: string;
  services: ServiceItem[];
  features: FeatureItem[];
  contact: BusinessContact;
  primaryCtaText: string;
  secondaryCtaText: string;
  accentColor?: string;
  generatedAt: string;
  disclaimer: {
    isConcept: boolean;
    conceptNotice: string;
    redesignNotice?: string;
  };
}

export interface LeadRecord {
  rowIndex: number;
  googleMapLink: string;
  worksName: string;
  companyCategory: string;
  address: string;
  mobileNumber: string;
  website: string;
  existingStatus: string;
  demoSlug: string;
  demoStatus: 'READY' | 'GENERATING' | 'DEPLOYED' | 'FAILED' | 'ERROR' | '' | string;
  demoUrl: string;
  demoGeneratedAt: string;
  outreachApproved: 'PENDING' | 'APPROVED' | 'REJECTED' | '' | string;
  errorMessage: string;
  siteType: DemoSiteType;
}

export interface DashboardStats {
  totalLeads: number;
  readyCount: number;
  generatingCount: number;
  deployedCount: number;
  failedCount: number;
  approvedCount: number;
  newSitesCount: number;
  redesignCount: number;
}
