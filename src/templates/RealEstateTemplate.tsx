import React, { useState } from 'react';
import { DemoContent } from '../types/demo';
import { ConceptBanner } from '../components/ConceptBanner';
import { ContactBar } from '../components/ContactBar';
import { LeadInquiryModal } from '../components/LeadInquiryModal';
import {
  MapPin, Phone, MessageCircle, Building2, CheckCircle2,
  Compass, ShieldCheck, ArrowRight, Home, Sparkles, Calendar,
  FileCheck, Trees, Waves, Factory, Navigation, ChevronRight,
  Clock, Menu, X, Mail, Send, Award, Check, Lock, ChevronDown, CheckSquare,
  ExternalLink, Heart
} from 'lucide-react';

interface TemplateProps {
  demo: DemoContent;
}

// Curated high-res imagery for property projects
const PROJECT_ITEMS = [
  {
    id: 'p1',
    category: 'beach',
    title: 'Sea Beach & Coastal Villa Plots',
    location: 'Coastal Highway, Umbergaon',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    badge: 'Coastal Prime',
    tag: 'Beachfront Plot',
    specs: 'Direct Shoreline Access • Clear NA Title',
    description: 'Scenic beachfront land parcels situated minutes from the shoreline along Coastal Highway. Ideal for luxury weekend retreats and private villas.',
    features: ['100% Clear Title & Demarcation', 'Direct Coastal Highway Connectivity', 'Immediate Registry & Possession'],
  },
  {
    id: 'p2',
    category: 'farm',
    title: 'Farmhouse & 1 Acre Acreages',
    location: 'Umbergaon Green Belt',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    badge: 'Green Acreage',
    tag: 'Farmhouse Land',
    specs: '1 to 5+ Acres • Fenced & Water Table',
    description: 'Expansive agricultural and farmhouse plots with rich fertile soil, sweet groundwater, and peaceful green surroundings.',
    features: ['Sizes from 1 to 5+ Acres', 'Fenced Boundaries & Power Access', 'High Long-Term Land Appreciation'],
  },
  {
    id: 'p3',
    category: 'industrial',
    title: 'Industrial & Logistics Land Parcels',
    location: 'GIDC Corridor, Umbergaon',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    badge: 'High Growth',
    tag: 'Industrial Plot',
    specs: 'Highway Frontage • 3-Phase Power',
    description: 'Strategic commercial acreage with heavy-vehicle road frontage, 3-phase electricity, and fast-track GIDC logistics proximity.',
    features: ['Zoned for Warehousing & Production', 'Wide Access Roads for 40ft Trailers', 'Clear Legal Industrial Approvals'],
  },
  {
    id: 'p4',
    category: 'residential',
    title: 'Gated Residential Villa Land',
    location: 'Umbergaon West',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    badge: 'Exclusive',
    tag: 'Residential Plot',
    specs: 'Immediate Registry • Gated Enclave',
    description: 'Curated residential plots inside a planned private layout with internal asphalt roads, streetlights, and plantation boundaries.',
    features: ['Internal Road & Drainage Setup', 'Individual Water Connection', 'Ready for Immediate Construction'],
  }
];

export const RealEstateTemplate: React.FC<TemplateProps> = ({ demo }) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'beach' | 'farm' | 'industrial'>('ALL');
  
  // Hero Step Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [whatsAppUpdates, setWhatsAppUpdates] = useState(true);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Newsletter Subscribe State
  const [subscriberPhone, setSubscriberPhone] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Contact section form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCategory, setContactCategory] = useState('Sea Beach Plot');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Clean, elegant display name
  const brandName = demo.businessName.split(/[,|/•]/)[0].trim();

  // Extract city or location highlight (e.g. Umbergaon)
  const locationHighlight = demo.contact.address.includes('Umbergaon') 
    ? 'Umbergaon' 
    : demo.contact.address.split(',')[0].trim() || 'Umbergaon';

  const handleHeroLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${brandName},\nI would like to request property details for ${locationHighlight}.\nName: ${leadName}\nPhone: ${leadPhone}\nWhatsApp Updates: ${whatsAppUpdates ? 'Yes' : 'No'}`
    );
    window.open(`https://wa.me/91${demo.contact.phoneRaw}?text=${text}`, '_blank');
    setLeadSubmitted(true);
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${brandName}, please subscribe me to new property listing alerts for ${locationHighlight}. Phone: ${subscriberPhone}`
    );
    window.open(`https://wa.me/91${demo.contact.phoneRaw}?text=${text}`, '_blank');
    setSubscribed(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${brandName},\nName: ${contactName}\nPhone: ${contactPhone}\nInterested In: ${contactCategory}\nMessage: ${contactMessage}`
    );
    window.open(`https://wa.me/91${demo.contact.phoneRaw}?text=${text}`, '_blank');
    setContactSubmitted(true);
  };

  const filteredProjects = activeTab === 'ALL' 
    ? PROJECT_ITEMS 
    : PROJECT_ITEMS.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-rose-100 selection:text-rose-900 pb-20 sm:pb-0">
      {/* 1. Unapproved Concept Disclaimer Banner */}
      <ConceptBanner
        businessName={brandName}
        isRedesign={demo.siteType === 'redesign'}
        existingUrl={demo.existingWebsiteUrl}
      />

      {/* 2. Top Info Utility Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-2 px-4 sm:px-8 border-b border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Verified Local Property Advisory</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>{demo.contact.address}</span>
            <span className="text-slate-600">•</span>
            <span>Open 7 Days : 9:00 AM – 7:30 PM</span>
          </div>

          <div className="flex items-center space-x-5 text-slate-300">
            <a href={`tel:${demo.contact.phoneRaw}`} className="hover:text-white transition flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-rose-400" />
              <span className="font-mono">{demo.contact.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3. Clean White Navigation Bar with Coral Red CTA Button */}
      <nav className="bg-white/95 backdrop-blur-md sticky top-10 sm:top-9 z-40 border-b border-slate-100 shadow-sm transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-[#D1495B] to-amber-500 text-white flex items-center justify-center font-extrabold shadow-md shadow-rose-900/10 group-hover:scale-105 transition">
              <Building2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-slate-900 block group-hover:text-[#D1495B] transition">
                {brandName}
              </span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                {demo.category || "Real Estate Advisory"}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#home" className="hover:text-[#D1495B] transition py-1">Home</a>
            <a href="#about" className="hover:text-[#D1495B] transition py-1">About</a>
            <a href="#projects" className="hover:text-[#D1495B] transition py-1">Projects</a>
            <a href="#contact" className="hover:text-[#D1495B] transition py-1">Contact Us</a>
          </div>

          {/* Actions & Coral Red "Get Free Quote" CTA */}
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${demo.contact.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#D1495B] transition"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                <Phone className="w-3.5 h-3.5 text-[#D1495B]" />
              </div>
              <span className="font-mono">{demo.contact.phone}</span>
            </a>

            <a
              href="#contact"
              className="bg-[#D1495B] hover:bg-[#C0394B] text-white px-6 py-2.5 rounded-full text-xs font-bold transition shadow-md shadow-rose-900/15 flex items-center gap-1.5 active:scale-95"
            >
              <span>Get Free Quote</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-xl animate-fadeIn">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700 hover:text-[#D1495B] border-b border-slate-100"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700 hover:text-[#D1495B] border-b border-slate-100"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700 hover:text-[#D1495B] border-b border-slate-100"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-700 hover:text-[#D1495B]"
            >
              Contact Us
            </a>

            <div className="pt-2">
              <a
                href={demo.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-2 shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Instant Inquiry</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ======================================================== */}
      {/* SECTION 1: HOME (Hero with Elevated Consultation Form Card) */}
      {/* ======================================================== */}
      <section id="home" className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft Background Graphic */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-rose-200 to-transparent pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Bold Copy with Colored Highlight */}
          <div className="lg:col-span-7">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-[#D1495B] text-xs font-bold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D1495B] animate-ping"></span>
              <span>VERIFIED REAL ESTATE & LAND ADVISORY</span>
            </div>

            {/* Headline with Signature Highlight Color */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Land & Property Services in{' '}
              <span className="text-[#D1495B] underline decoration-[#D1495B]/20 decoration-wavy">
                {locationHighlight}
              </span>
            </h1>

            {/* Clean Description */}
            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              We help you find verified land and properties that match your vision. {brandName} brings you verified coastal plots, fertile agricultural farmhouses, and strategic industrial land with complete transparent documentation and direct site visits.
            </p>

            {/* Highlights Checklist */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>100% Verified 7/12 Title Screening</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Direct Seller-to-Buyer Negotiations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>VIP Site Inspections with Survey Maps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>End-to-End Registration & Mutation</span>
              </div>
            </div>

            {/* Call / WhatsApp Direct Action Bar */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={demo.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-emerald-950/10 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${demo.contact.phoneRaw}`}
                className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs tracking-wider uppercase transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#D1495B]" />
                <span>Call {demo.contact.phone}</span>
              </a>
            </div>
          </div>

          {/* Right Column: Elevated Consultation Form Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xl shadow-slate-300/40 border border-slate-100 relative">
              {/* Pill Badge */}
              <div className="inline-block px-3.5 py-1 rounded-full bg-rose-50 text-[#D1495B] text-[11px] font-bold tracking-wider uppercase mb-3">
                FREE CONSULTATION
              </div>

              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Properties for Every Budget
              </h3>

              {/* Step Indicator (1 - 2 - 3 - 4) */}
              <div className="flex items-center justify-between my-6 relative">
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-100 -z-0"></div>
                <div className="w-7 h-7 rounded-full bg-[#D1495B] text-white flex items-center justify-center font-bold text-xs z-10 shadow-sm">
                  1
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs z-10">
                  2
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs z-10">
                  3
                </div>
                <div className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center font-bold text-xs z-10">
                  4
                </div>
              </div>

              {leadSubmitted ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <Check className="w-7 h-7" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Inquiry Received</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Your request has been forwarded directly to WhatsApp for instant verification.
                  </p>
                  <button
                    onClick={() => setLeadSubmitted(false)}
                    className="mt-5 px-5 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleHeroLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#D1495B] focus:outline-none transition shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold">
                        IN +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="98765 43210"
                        className="w-full px-4 py-3 rounded-r-xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#D1495B] focus:outline-none transition shadow-sm"
                      />
                    </div>
                  </div>

                  {/* WhatsApp Opt-in Checkbox */}
                  <label className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={whatsAppUpdates}
                      onChange={(e) => setWhatsAppUpdates(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-0"
                    />
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>Get verified property updates on WhatsApp</span>
                  </label>

                  {/* Coral Red "Next" Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#D1495B] hover:bg-[#C0394B] text-white font-bold text-sm transition shadow-lg shadow-rose-900/15 flex items-center justify-center gap-2 active:scale-95 mt-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1 mt-2">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Your information is 100% secure</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trusted Locations Strip */}
      <section className="bg-slate-50 border-y border-slate-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            TRUSTED ACROSS {locationHighlight.toUpperCase()} LANDMARK CORRIDORS:
          </span>
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-600">
            <span>Coastal Highway</span>
            <span>•</span>
            <span>Beachfront Zone</span>
            <span>•</span>
            <span>Umbergaon Green Belt</span>
            <span>•</span>
            <span>GIDC Industrial Area</span>
            <span>•</span>
            <span>Station Corridor</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: ABOUT US */}
      {/* ======================================================== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-[11px] font-bold text-[#D1495B] uppercase tracking-widest block mb-2">
              ABOUT OUR ADVISORY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A consultant who stays till the registry is in your hand — and after.
            </h2>
            <p className="mt-5 text-base text-slate-600 leading-relaxed">
              {brandName} is an independent, verified consultancy guiding clients across all segments of the regional market — <strong>coastal plots, agricultural farmhouses, and industrial land</strong>.
            </p>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              We handle the whole transaction, not just the introduction. From shortlisting and on-ground site visits to revenue record verification, boundary demarcation, and registration paperwork — we don't disappear once the deal is signed.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-2xl font-black text-[#D1495B] block">100%</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">Title Due Diligence</span>
                <p className="text-[11px] text-slate-500 mt-1">Complete 7/12 land revenue checks prior to signing.</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-2xl font-black text-emerald-600 block">Direct</span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">Buyer-Seller Connection</span>
                <p className="text-[11px] text-slate-500 mt-1">Transparent deal negotiations with zero hidden margins.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative">
              <span className="text-[11px] font-bold tracking-widest uppercase text-rose-300 block mb-3">
                OUR COMMITMENT
              </span>
              <p className="text-xl sm:text-2xl font-serif italic text-slate-100 leading-relaxed">
                “To provide the most trusted and transparent land advisory in {locationHighlight}, ensuring every client buys with complete peace of mind.”
              </p>
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{brandName}</span>
                  <span className="text-[11px] text-slate-400 block">{demo.contact.address}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-rose-500/20 text-[#D1495B] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: PROJECTS / PORTFOLIO */}
      {/* ======================================================== */}
      <section id="projects" className="bg-slate-50 py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-bold text-[#D1495B] uppercase tracking-widest block mb-2">
                WHAT WE DEAL IN
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Every Kind of Land, at Prime {locationHighlight} Addresses
              </h2>
              <p className="text-sm text-slate-500 mt-2 max-w-xl">
                Whether you're after a beachfront villa plot, an income-producing farmhouse, or industrial acreage to build on.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeTab === 'ALL'
                    ? 'bg-[#D1495B] text-white shadow-md shadow-rose-900/10'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setActiveTab('beach')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeTab === 'beach'
                    ? 'bg-[#D1495B] text-white shadow-md shadow-rose-900/10'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Beach Plots
              </button>
              <button
                onClick={() => setActiveTab('farm')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeTab === 'farm'
                    ? 'bg-[#D1495B] text-white shadow-md shadow-rose-900/10'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Farmhouses
              </button>
              <button
                onClick={() => setActiveTab('industrial')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeTab === 'industrial'
                    ? 'bg-[#D1495B] text-white shadow-md shadow-rose-900/10'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Industrial Land
              </button>
            </div>
          </div>

          {/* Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo with Overlay Badge */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#D1495B] font-bold text-[10px] uppercase tracking-wider shadow-sm">
                        {project.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[11px] font-semibold text-white drop-shadow flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        <span>{project.location}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#D1495B] transition">
                      {project.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#D1495B] mt-1">{project.specs}</p>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
                      {project.features.map((f, i) => (
                        <div key={i} className="flex items-center text-xs text-slate-600 gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registry</span>
                      <span className="text-xs font-bold text-emerald-700">Immediate Possession</span>
                    </div>

                    <a
                      href={demo.contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-[#D1495B] hover:bg-[#C0394B] text-white font-bold text-xs transition shadow-sm flex items-center gap-1"
                    >
                      <span>Inquire</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: CONTACT US */}
      {/* ======================================================== */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-bold text-[#D1495B] uppercase tracking-widest block mb-2">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Contact {brandName}
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Speak directly with our senior consultant regarding plot availability, site tours, or documentation checks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-5">
            {/* Direct Phone */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#D1495B] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Telephone</h4>
                <a
                  href={`tel:${demo.contact.phoneRaw}`}
                  className="text-lg font-bold text-slate-900 hover:text-[#D1495B] transition mt-0.5 block font-mono"
                >
                  {demo.contact.phone}
                </a>
                <p className="text-xs text-slate-400 mt-1">Available Mon–Sun: 9:00 AM – 7:30 PM</p>
              </div>
            </div>

            {/* WhatsApp Business */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Business</h4>
                <p className="text-xs text-slate-600 mt-1">Instant plot layouts, location pins & survey maps</p>
                <a
                  href={demo.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Office Location */}
            <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-rose-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Office Address</h4>
                <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                  {demo.contact.address}
                </p>

                {demo.contact.googleMapsLink && (
                  <a
                    href={demo.contact.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                  >
                    <Navigation className="w-3.5 h-3.5 text-rose-500" />
                    <span>Open in Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
            <h3 className="text-xl font-extrabold text-slate-900">Send Direct Property Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Fill in your requirement to receive survey maps and available plot dimensions.
            </p>

            {contactSubmitted ? (
              <div className="py-10 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Inquiry Forwarded</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Your details have been pre-filled for WhatsApp. The consultant will respond promptly.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="mt-6 px-6 py-2 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#D1495B] focus:outline-none transition shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#D1495B] focus:outline-none transition shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Interested Property Type</label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#D1495B] focus:outline-none transition shadow-sm"
                  >
                    <option value="Sea Beach Plot">Sea Beach & Coastal Villa Plot</option>
                    <option value="Farmhouse Land">Farmhouse & 1 Acre Acreage</option>
                    <option value="Industrial Land">Industrial / Logistics Land</option>
                    <option value="Residential Plot">Gated Residential Plot</option>
                    <option value="General Consultation">General Property Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message / Requirement</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your budget, preferred plot dimensions, or site visit availability..."
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:ring-2 focus:ring-[#D1495B] focus:outline-none transition shadow-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#D1495B] hover:bg-[#C0394B] text-white font-bold text-xs transition shadow-lg shadow-rose-900/15 flex items-center justify-center gap-2 mt-4 active:scale-95 uppercase tracking-wider"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. LUXURY COMPREHENSIVE WHITE & SLATE FOOTER */}
      {/* ======================================================== */}
      <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
        {/* Top Newsletter / Quick Alert Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-slate-800">
          <div className="bg-slate-950 rounded-3xl p-8 sm:p-10 border border-slate-800/80 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold text-[#D1495B] uppercase tracking-widest block mb-1">
                PROPERTY ALERTS
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Get New Verified Listing Alerts for {locationHighlight}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Receive instant notifications when beachfront plots or agricultural acreages are listed with clear titles.
              </p>
            </div>

            {subscribed ? (
              <div className="px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Alerts Activated on WhatsApp</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <input
                  type="tel"
                  required
                  value={subscriberPhone}
                  onChange={(e) => setSubscriberPhone(e.target.value)}
                  placeholder="Enter your phone / WhatsApp"
                  className="px-4 py-3 rounded-full bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D1495B] w-full sm:w-72"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#D1495B] hover:bg-[#C0394B] text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main 4-Column Footer Links Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Column 1: Brand & Identity (4 cols) */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-[#D1495B] to-amber-500 text-white flex items-center justify-center font-extrabold shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-lg text-white block">
                    {brandName}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest block">
                    {demo.category || "Real Estate Advisory"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Independent real estate and land consultancy based in {locationHighlight}. We specialize in 100% verified legal title due diligence, coastal plot acquisition, and strategic agricultural acreages.
              </p>

              <div className="mt-6 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mon – Sun : 9:00 AM – 7:30 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Clear 7/12 Title Screening</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links (2 cols) */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><a href="#home" className="hover:text-white transition">Home</a></li>
                <li><a href="#about" className="hover:text-white transition">About Our Advisory</a></li>
                <li><a href="#projects" className="hover:text-white transition">Current Projects</a></li>
                <li><a href="#contact" className="hover:text-white transition">Contact & Office</a></li>
                <li><a href="#contact" className="hover:text-white transition">Schedule Inspection</a></li>
                <li><a href="#home" className="hover:text-white transition">Free Consultation</a></li>
              </ul>
            </div>

            {/* Column 3: Portfolios & Land Types (3 cols) */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                Property Portfolios
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#D1495B]"></span>
                  <a href="#projects" className="hover:text-white transition">Sea Beach & Coastal Plots</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#D1495B]"></span>
                  <a href="#projects" className="hover:text-white transition">Farmhouse & 1 Acre Acreages</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#D1495B]"></span>
                  <a href="#projects" className="hover:text-white transition">Industrial & Logistics Land</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#D1495B]"></span>
                  <a href="#projects" className="hover:text-white transition">Gated Residential Layouts</a>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#D1495B]"></span>
                  <a href="#projects" className="hover:text-white transition">Agricultural NA Conversions</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Location (3 cols) */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
                Headquarters
              </h4>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>{demo.contact.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <a href={`tel:${demo.contact.phoneRaw}`} className="font-mono text-white hover:text-amber-400 transition">
                    {demo.contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <a
                    href={demo.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold transition"
                  >
                    Direct WhatsApp Chat
                  </a>
                </div>

                {demo.contact.googleMapsLink && (
                  <div className="pt-2">
                    <a
                      href={demo.contact.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-semibold hover:bg-slate-700 transition"
                    >
                      <Navigation className="w-3 h-3 text-rose-400" />
                      <span>View on Google Maps</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar & Concept Note */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <a href="#about" className="hover:text-white transition">Privacy Policy</a>
            <span>•</span>
            <a href="#projects" className="hover:text-white transition">Terms of Advisory</a>
            <span>•</span>
            <a href="#contact" className="hover:text-white transition">Due Diligence Policy</a>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Powered by</span>
            <span className="font-bold text-white">ShamshadCodes Website Factory</span>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/60 text-center text-[10px] text-slate-500 leading-relaxed">
            {demo.disclaimer.conceptNotice}
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Pill */}
      <a
        href={demo.contact.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition active:scale-95"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>

      {/* Mobile Sticky Bar */}
      <ContactBar
        phone={demo.contact.phone}
        phoneRaw={demo.contact.phoneRaw}
        whatsappLink={demo.contact.whatsappLink}
        googleMapsLink={demo.contact.googleMapsLink}
      />

      {/* Quick Modal */}
      <LeadInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        businessName={brandName}
        phone={demo.contact.phone}
        category={demo.category}
      />
    </div>
  );
};
