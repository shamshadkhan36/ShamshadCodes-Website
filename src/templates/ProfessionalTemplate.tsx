import React, { useState } from 'react';
import { DemoContent } from '../types/demo';
import { ConceptBanner } from '../components/ConceptBanner';
import { ContactBar } from '../components/ContactBar';
import { LeadInquiryModal } from '../components/LeadInquiryModal';
import {
  Briefcase, Phone, MessageCircle, MapPin, CheckCircle2,
  ShieldCheck, ArrowRight, Sparkles, HelpCircle
} from 'lucide-react';

interface TemplateProps {
  demo: DemoContent;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ demo }) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 sm:pb-0 font-sans">
      <ConceptBanner
        businessName={demo.businessName}
        isRedesign={demo.siteType === 'redesign'}
        existingUrl={demo.existingWebsiteUrl}
      />

      <header className="bg-white/90 backdrop-blur-md sticky top-10 sm:top-9 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 line-clamp-1">{demo.businessName}</span>
              <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider block">{demo.category}</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a href={`tel:${demo.contact.phoneRaw}`} className="text-xs font-semibold text-slate-700">
              {demo.contact.phone}
            </a>
            <button
              onClick={() => setInquiryOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm"
            >
              Consultation
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-indigo-400/30">
            Professional Services & Advisory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {demo.heroHeadline}
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            {demo.heroSubheadline}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={demo.contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Quick Chat</span>
            </a>
            <button
              onClick={() => setInquiryOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs tracking-wider uppercase transition"
            >
              {demo.primaryCtaText || "Get In Touch"}
            </button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demo.features.map((feat) => (
            <div key={feat.id} className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-indigo-600 mb-2" />
              <h2 className="text-sm font-bold text-slate-900">{feat.title}</h2>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">Expertise</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Our Core Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demo.services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <Briefcase className="w-6 h-6 text-indigo-600 mb-3" />
                <h3 className="font-bold text-lg text-slate-900">{service.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{service.description}</p>
                {service.highlights && (
                  <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                    {service.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => setInquiryOpen(true)}
                className="mt-4 text-xs font-bold text-indigo-600 text-left flex items-center gap-1"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="bg-white py-16 px-4 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-slate-900">About {demo.businessName}</h2>
          <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto">{demo.aboutStory}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-800 font-medium">
              <Phone className="w-3.5 h-3.5" />
              {demo.contact.phone}
            </span>
            {demo.contact.address && (
              <span className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-lg text-slate-800 font-medium">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {demo.contact.address}
              </span>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400 text-xs py-8 px-4 text-center">
        <p className="font-medium text-slate-300">{demo.businessName}</p>
        <p className="mt-2 text-[11px] text-slate-500">{demo.disclaimer.conceptNotice}</p>
      </footer>

      <ContactBar
        phone={demo.contact.phone}
        phoneRaw={demo.contact.phoneRaw}
        whatsappLink={demo.contact.whatsappLink}
        googleMapsLink={demo.contact.googleMapsLink}
      />

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
