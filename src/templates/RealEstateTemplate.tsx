import React, { useState } from 'react';
import { DemoContent } from '../types/demo';
import { ConceptBanner } from '../components/ConceptBanner';
import { ContactBar } from '../components/ContactBar';
import { LeadInquiryModal } from '../components/LeadInquiryModal';
import {
  MapPin, Phone, MessageCircle, Building2, CheckCircle2,
  Compass, ShieldCheck, ArrowRight, Home, Sparkles, Calendar,
  FileCheck, Trees, Waves, Factory, Navigation, ChevronRight,
  Clock, Menu, X, Mail, Send, Award, Check
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
  
  // Site Visit Booking form state
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('Morning (10:00 AM)');

  // Contact section form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCategory, setContactCategory] = useState('Sea Beach Plot');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Clean brand name
  const brandName = demo.businessName.split(/[,|/•]/)[0].trim();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${brandName}, I would like to schedule a private site visit for ${selectedDate || 'this weekend'} (${selectedSlot}). Please share details.`
    );
    window.open(`https://wa.me/91${demo.contact.phoneRaw}?text=${text}`, '_blank');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${brandName},\nMy Name: ${contactName}\nPhone: ${contactPhone}\nInterested In: ${contactCategory}\nMessage: ${contactMessage}`
    );
    window.open(`https://wa.me/91${demo.contact.phoneRaw}?text=${text}`, '_blank');
    setContactSubmitted(true);
  };

  const filteredProjects = activeTab === 'ALL' 
    ? PROJECT_ITEMS 
    : PROJECT_ITEMS.filter(p => p.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20 sm:pb-0">
      {/* 1. Unapproved Concept Disclaimer Banner */}
      <ConceptBanner
        businessName={brandName}
        isRedesign={demo.siteType === 'redesign'}
        existingUrl={demo.existingWebsiteUrl}
      />

      {/* 2. Glassmorphic Navigation with Home, About, Projects, Contact Us */}
      <nav className="bg-slate-900/90 backdrop-blur-xl sticky top-10 sm:top-9 z-40 border-b border-slate-800 transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white block group-hover:text-amber-400 transition">
                {brandName}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-400/90 tracking-widest uppercase block">
                {demo.category || "Luxury Property Advisory"}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#home" className="hover:text-amber-400 transition py-1">Home</a>
            <a href="#about" className="hover:text-amber-400 transition py-1">About</a>
            <a href="#projects" className="hover:text-amber-400 transition py-1">Projects</a>
            <a href="#contact" className="hover:text-amber-400 transition py-1">Contact Us</a>
          </div>

          {/* Actions & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <a
              href={`tel:${demo.contact.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="font-mono">{demo.contact.phone}</span>
            </a>

            <a
              href="#contact"
              className="hidden sm:flex bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 items-center gap-1.5 active:scale-95"
            >
              <span>Schedule Tour</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3 animate-fadeIn">
            <a
              href="#home"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-amber-400 border-b border-slate-800/60"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-amber-400 border-b border-slate-800/60"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-amber-400 border-b border-slate-800/60"
            >
              Projects
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-amber-400"
            >
              Contact Us
            </a>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={demo.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ======================================================== */}
      {/* SECTION 1: HOME (Hero & Value Highlights) */}
      {/* ======================================================== */}
      <section id="home" className="relative min-h-[640px] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Cinematic Backdrop with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform animate-pulse duration-10000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wide uppercase">Verified Coastal & Farmhouse Acreages</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {demo.heroHeadline}
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {demo.heroSubheadline}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={demo.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm transition shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2.5 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Direct WhatsApp Inquiry</span>
            </a>

            <a
              href="#projects"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 shadow-xl"
            >
              <span>Explore Land Projects</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </a>
          </div>

          {/* Address Tag */}
          {demo.contact.address && (
            <div className="mt-8 inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-900/70 border border-slate-800 px-4 py-1.5 rounded-full backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{demo.contact.address}</span>
            </div>
          )}
        </div>
      </section>

      {/* Trust Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demo.features.map((feat) => (
            <div
              key={feat.id}
              className="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl hover:border-amber-500/40 transition duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white tracking-wide">{feat.title}</h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION 2: ABOUT US */}
      {/* ======================================================== */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>About Our Agency</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              About {brandName}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              {demo.aboutStory}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {demo.valueProposition}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-2xl font-black text-amber-400 block">100%</span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Clear 7/12 Title Screening</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-2xl font-black text-emerald-400 block">Direct</span>
                <span className="text-xs text-slate-400 font-medium mt-1 block">Seller-to-Buyer Registry</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <a
                href="#contact"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition inline-flex items-center gap-1.5 shadow"
              >
                <span>Connect With Advisor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={`tel:${demo.contact.phoneRaw}`}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition inline-flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {demo.contact.phone}</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Estate"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Verified Ground Advisory</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Physical land inspections & road demarcation checks across {demo.contact.address}.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: PROJECTS / PORTFOLIO */}
      {/* ======================================================== */}
      <section id="projects" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">
              <Home className="w-3.5 h-3.5" />
              <span>Current Listings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Land & Property Projects
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Explore coastal beachfront plots, expansive agricultural acreages, and industrial developments with verified boundaries.
            </p>
          </div>

          {/* Project Category Filter Tabs */}
          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Projects
            </button>
            <button
              onClick={() => setActiveTab('beach')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'beach'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Beach Plots
            </button>
            <button
              onClick={() => setActiveTab('farm')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'farm'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Farmhouses
            </button>
            <button
              onClick={() => setActiveTab('industrial')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'industrial'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Industrial Land
            </button>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl hover:border-amber-500/40 transition duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Photo & Badge */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-[10px] tracking-wider uppercase border border-amber-500/30">
                      {project.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{project.location}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-amber-300 font-semibold">{project.specs}</p>
                  <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-slate-800 pt-3">
                    {project.features.map((f, i) => (
                      <div key={i} className="flex items-center text-xs text-slate-300 gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-6 pt-0">
                <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Documentation</span>
                    <span className="text-xs font-bold text-emerald-400">Verified Legal Title</span>
                  </div>

                  <a
                    href={demo.contact.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 shadow"
                  >
                    <span>Inquire</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Tour Scheduler Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">VIP On-Site Inspection</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Need to Inspect Boundary Pegs & Revenue Maps?
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
                We coordinate private site visits from Coastal Highway directly to property locations with full survey maps and 7/12 land records ready for review.
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <a
                href={demo.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-xl flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Book Guided Tour on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: CONTACT US */}
      {/* ======================================================== */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact {brandName}
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Speak directly with our senior consultant regarding property inquiries, site tours, or documentation checks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Information & Office Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Phone Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Telephone</h4>
                <a
                  href={`tel:${demo.contact.phoneRaw}`}
                  className="text-lg font-bold text-white hover:text-amber-400 transition mt-1 block font-mono"
                >
                  {demo.contact.phone}
                </a>
                <p className="text-xs text-slate-500 mt-1">Available Mon–Sun: 9:00 AM – 7:30 PM</p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">WhatsApp Business</h4>
                <p className="text-xs text-slate-300 mt-1">Instant plot layouts, location pins & survey maps</p>
                <a
                  href={demo.contact.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Address & Google Maps Card */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Office Location</h4>
                <p className="text-sm text-white font-medium mt-1 leading-relaxed">
                  {demo.contact.address}
                </p>

                {demo.contact.googleMapsLink && (
                  <a
                    href={demo.contact.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition border border-slate-700"
                  >
                    <Navigation className="w-3.5 h-3.5 text-rose-400" />
                    <span>Open in Google Maps</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
            <h3 className="text-xl font-bold text-white">Send Direct Property Inquiry</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">
              Fill out your details to receive customized land availability and survey records.
            </p>

            {contactSubmitted ? (
              <div className="py-12 text-center animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-white">Inquiry Prepared for WhatsApp</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Your property request has been generated and sent to WhatsApp. The advisor will respond promptly.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone / WhatsApp Number</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Interested Property Type</label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Sea Beach Plot">Sea Beach & Coastal Plot</option>
                    <option value="Farmhouse Land">Farmhouse & 1 Acre Acreage</option>
                    <option value="Industrial Land">Industrial / Logistics Plot</option>
                    <option value="Residential Plot">Gated Residential Plot</option>
                    <option value="General Consultation">General Land Advisory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Requirement / Questions</label>
                  <textarea
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your budget, preferred plot size, or specific requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-4 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry to {brandName}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 text-center">
        <p className="font-extrabold text-white text-sm">{brandName}</p>
        <p className="text-xs text-slate-400 mt-1">{demo.contact.address} &bull; {demo.contact.phone}</p>
        
        <div className="mt-4 flex justify-center space-x-6 text-xs text-slate-500">
          <a href="#home" className="hover:text-amber-400 transition">Home</a>
          <a href="#about" className="hover:text-amber-400 transition">About</a>
          <a href="#projects" className="hover:text-amber-400 transition">Projects</a>
          <a href="#contact" className="hover:text-amber-400 transition">Contact Us</a>
        </div>

        <div className="mt-6 max-w-xl mx-auto p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
          {demo.disclaimer.conceptNotice}
        </div>
      </footer>

      {/* Sticky Mobile Contact Bar */}
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
