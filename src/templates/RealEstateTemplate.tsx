import React, { useState } from 'react';
import { DemoContent } from '../types/demo';
import { ConceptBanner } from '../components/ConceptBanner';
import { ContactBar } from '../components/ContactBar';
import { LeadInquiryModal } from '../components/LeadInquiryModal';
import {
  MapPin, Phone, MessageCircle, Building2, CheckCircle2,
  Compass, ShieldCheck, ArrowRight, Home, Sparkles, Calendar,
  FileCheck, Trees, Waves, Factory, Navigation, ChevronRight,
  Clock, Share2
} from 'lucide-react';

interface TemplateProps {
  demo: DemoContent;
}

// Curated high-res imagery for property types
const PROPERTY_IMAGES = [
  {
    category: 'beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    badge: 'Coastal Prime',
    tag: 'Beachfront Plot',
    specs: 'Direct Shoreline Access • Clear NA Title'
  },
  {
    category: 'farm',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
    badge: 'Green Acreage',
    tag: 'Farmhouse Plot',
    specs: '1 to 5+ Acres • Fenced & Water Table'
  },
  {
    category: 'industrial',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    badge: 'High Appreciation',
    tag: 'Industrial / Commercial',
    specs: 'Highway Frontage • 3-Phase Power'
  },
  {
    category: 'residential',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
    badge: 'Exclusive',
    tag: 'Gated Villa Land',
    specs: 'Immediate Registry • Gated Enclave'
  }
];

export const RealEstateTemplate: React.FC<TemplateProps> = ({ demo }) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('Morning (10:00 AM)');

  // Clean, elegant display name
  const brandName = demo.businessName.split(/[,|/•]/)[0].trim();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hello ${brandName}, I would like to schedule a private site visit for ${selectedDate || 'this weekend'} (${selectedSlot}). Please share details.`
    );
    window.open(`https://wa.me/91${demo.contact.phoneRaw}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 pb-20 sm:pb-0">
      {/* 1. Official Concept Disclaimer Banner */}
      <ConceptBanner
        businessName={brandName}
        isRedesign={demo.siteType === 'redesign'}
        existingUrl={demo.existingWebsiteUrl}
      />

      {/* 2. Glassmorphic Navigation Bar */}
      <nav className="bg-slate-900/80 backdrop-blur-xl sticky top-10 sm:top-9 z-40 border-b border-slate-800/80 transition">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-extrabold shadow-lg shadow-amber-500/20">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white block">
                {brandName}
              </span>
              <span className="text-[11px] font-semibold text-amber-400/90 tracking-widest uppercase block mt-0.5">
                {demo.category || "Luxury Land & Property Advisory"}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-5">
            <a
              href={`tel:${demo.contact.phoneRaw}`}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-amber-400 transition"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span>{demo.contact.phone}</span>
            </a>

            <button
              onClick={() => setInquiryOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule VIP Visit</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section with Luxury Architecture Background */}
      <header className="relative min-h-[620px] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background photo with cinematic dark gradient overlay */}
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
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
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

          {/* CTA Group */}
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

            <button
              onClick={() => setInquiryOpen(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition flex items-center justify-center gap-2 backdrop-blur-md active:scale-95 shadow-xl"
            >
              <span>{demo.primaryCtaText || "Explore Land Opportunities"}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Address Tag */}
          {demo.contact.address && (
            <div className="mt-8 inline-flex items-center gap-2 text-xs text-slate-400 bg-slate-900/70 border border-slate-800 px-4 py-1.5 rounded-full backdrop-blur-md">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{demo.contact.address}</span>
            </div>
          )}
        </div>
      </header>

      {/* 4. Luxury Floating Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demo.features.map((feat, idx) => (
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
      </section>

      {/* 5. Curated Property Showcase with High-Res Photography */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">
              <Home className="w-3.5 h-3.5" />
              <span>Featured Portfolios</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Prime Land & Property Offerings
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Verified coastal plots, fertile agricultural acreages, and industrial developments in {demo.contact.address}.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-2">
            <span className="text-xs text-slate-400 mr-2">Advisory Status:</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available for Inspection</span>
            </span>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {demo.services.map((service, index) => {
            const photo = PROPERTY_IMAGES[index % PROPERTY_IMAGES.length];

            return (
              <div
                key={service.id}
                className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl hover:border-amber-500/40 transition duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Photo with Overlay Badge */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-800">
                    <img
                      src={photo.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 font-bold text-[10px] tracking-wider uppercase border border-amber-500/30">
                        {photo.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{demo.contact.address}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                      {service.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Highlights */}
                    {service.highlights && service.highlights.length > 0 && (
                      <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4">
                        {service.highlights.map((h, i) => (
                          <div key={i} className="flex items-center text-xs text-slate-300 gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase font-semibold">Title Status</span>
                      <span className="text-xs font-bold text-emerald-400">100% Clear & Verified</span>
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
            );
          })}
        </div>
      </section>

      {/* 6. VIP Interactive Site Visit Booking Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold tracking-widest uppercase text-amber-400 block mb-2">
              Bespoke Advisory Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Book a Private Guided Site Tour
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              We arrange on-ground inspections with senior consultants who walk you through survey demarcation pegs, water availability, road access, and revenue paperwork.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <FileCheck className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Full Document Inspection</h4>
                <p className="text-[11px] text-slate-400 mt-1">Review 7/12 records and title deeds prior to committing.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <Navigation className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Direct Pickup & Guidance</h4>
                <p className="text-[11px] text-slate-400 mt-1">Personalized guidance from Coastal Highway directly to the site.</p>
              </div>
            </div>
          </div>

          {/* Interactive Booking Form Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white">Schedule Inspection</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Select your preferred date for WhatsApp confirmation.</p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Time of Day</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Morning (10:00 AM)">Morning (10:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (02:00 PM)">Afternoon (02:00 PM - 04:00 PM)</option>
                  <option value="Sunset Viewing (05:00 PM)">Sunset Viewing (05:00 PM - 06:30 PM)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-4 active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Confirm Tour on WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. Location & Maps Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Local Headquarters</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Visit {brandName}
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                {demo.aboutStory}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-rose-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>{demo.contact.address}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{demo.contact.phone}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 justify-center items-center lg:items-end">
              {demo.contact.googleMapsLink && (
                <a
                  href={demo.contact.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2 shadow-xl"
                >
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Open Route on Google Maps</span>
                </a>
              )}

              <a
                href={`tel:${demo.contact.phoneRaw}`}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-xl"
              >
                <Phone className="w-4 h-4" />
                <span>Call Principal Consultant</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 text-center">
        <p className="font-extrabold text-white text-sm">{brandName}</p>
        <p className="text-xs text-slate-400 mt-1">{demo.contact.address} &bull; {demo.contact.phone}</p>
        <div className="mt-4 max-w-xl mx-auto p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
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

      {/* Modal */}
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
