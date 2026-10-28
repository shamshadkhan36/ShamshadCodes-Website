import React, { useState } from 'react';
import { DemoContent } from '../types/demo';
import { ConceptBanner } from '../components/ConceptBanner';
import { ContactBar } from '../components/ContactBar';
import { LeadInquiryModal } from '../components/LeadInquiryModal';
import {
  MapPin, Phone, MessageCircle, Building2, CheckCircle2,
  Compass, ShieldCheck, ArrowRight, Home, Sparkles
} from 'lucide-react';

interface TemplateProps {
  demo: DemoContent;
}

export const RealEstateTemplate: React.FC<TemplateProps> = ({ demo }) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-0 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Unapproved Concept Disclaimer Banner */}
      <ConceptBanner
        businessName={demo.businessName}
        isRedesign={demo.siteType === 'redesign'}
        existingUrl={demo.existingWebsiteUrl}
      />

      {/* 2. Top Navigation */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-10 sm:top-9 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 line-clamp-1">
                {demo.businessName}
              </span>
              <span className="text-[11px] font-medium text-amber-700 block tracking-wide uppercase">
                {demo.category}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${demo.contact.phoneRaw}`}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-amber-600 transition"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>{demo.contact.phone}</span>
            </a>

            <button
              onClick={() => setInquiryOpen(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm active:scale-95"
            >
              Request Property Details
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-6">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Trusted Local Property Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            {demo.heroHeadline}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {demo.heroSubheadline}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={demo.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Inquiry</span>
            </a>

            <button
              onClick={() => setInquiryOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span>{demo.primaryCtaText || "Explore Opportunities"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {demo.contact.address && (
            <div className="mt-8 inline-flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{demo.contact.address}</span>
            </div>
          )}
        </div>
      </section>

      {/* 4. Strategic Strengths / Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demo.features.map((feat) => (
            <div
              key={feat.id}
              className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hover:shadow-2xl transition duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">{feat.title}</h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Services & Portfolios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Property Portfolio</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Tailored Real Estate Solutions
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Explore property consultation, agricultural plots, residential developments, and commercial properties.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demo.services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:border-amber-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="p-6">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center mb-4">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {service.highlights && service.highlights.length > 0 && (
                  <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="flex items-center text-xs text-slate-600 gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Verified Advisory</span>
                <button
                  onClick={() => setInquiryOpen(true)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                >
                  <span>Inquire Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Honest Business Story & Location */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-400 text-xs font-semibold mb-3 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Client Commitment</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              About {demo.businessName}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              {demo.aboutStory}
            </p>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              {demo.valueProposition}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{demo.contact.phone}</span>
              </div>
              {demo.contact.address && (
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>{demo.contact.address}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Speak Directly with the Consultant</h3>
            <p className="text-xs text-slate-400 mb-6">
              Connect directly via phone, WhatsApp, or request an in-person site visit.
            </p>

            <div className="space-y-3">
              <a
                href={`tel:${demo.contact.phoneRaw}`}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 font-semibold text-sm transition"
              >
                <Phone className="w-4 h-4" />
                <span>Call {demo.contact.phone}</span>
              </a>

              <a
                href={demo.contact.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Connect via WhatsApp</span>
              </a>

              {demo.contact.googleMapsLink && (
                <a
                  href={demo.contact.googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs transition border border-slate-600"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>View on Google Maps</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-8 px-4 border-t border-slate-800 text-center">
        <p className="font-semibold text-slate-300">{demo.businessName} &bull; {demo.category}</p>
        <p className="mt-1">{demo.contact.address}</p>
        <p className="mt-3 text-[11px] text-slate-500 max-w-lg mx-auto">
          {demo.disclaimer.conceptNotice}
        </p>
      </footer>

      {/* Mobile Sticky Bar */}
      <ContactBar
        phone={demo.contact.phone}
        phoneRaw={demo.contact.phoneRaw}
        whatsappLink={demo.contact.whatsappLink}
        googleMapsLink={demo.contact.googleMapsLink}
      />

      {/* Inquiry Modal */}
      <LeadInquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        businessName={demo.businessName}
        phone={demo.contact.phone}
        category={demo.category}
      />
    </div>
  );
};
