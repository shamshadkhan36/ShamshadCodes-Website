import React, { useState } from 'react';
import { DemoContent } from '../types/demo';
import { ConceptBanner } from '../components/ConceptBanner';
import { ContactBar } from '../components/ContactBar';
import { LeadInquiryModal } from '../components/LeadInquiryModal';
import {
  Palette, Phone, MessageCircle, MapPin, Sparkles, CheckCircle2,
  ArrowRight, Layers, Layout, Compass
} from 'lucide-react';

interface TemplateProps {
  demo: DemoContent;
}

export const InteriorDesignTemplate: React.FC<TemplateProps> = ({ demo }) => {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20 sm:pb-0 font-sans selection:bg-amber-100">
      <ConceptBanner
        businessName={demo.businessName}
        isRedesign={demo.siteType === 'redesign'}
        existingUrl={demo.existingWebsiteUrl}
      />

      <header className="bg-white/80 backdrop-blur-md sticky top-10 sm:top-9 z-40 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-md">
              <Palette className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="font-serif font-bold text-lg text-stone-900 line-clamp-1">
                {demo.businessName}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-500 font-medium">
                {demo.category}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${demo.contact.phoneRaw}`}
              className="text-xs font-semibold text-stone-700 hover:text-stone-900"
            >
              {demo.contact.phone}
            </a>
            <button
              onClick={() => setInquiryOpen(true)}
              className="bg-stone-900 hover:bg-stone-800 text-stone-100 px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition"
            >
              Book Design Consultation
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-stone-900 text-stone-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-stone-800 text-amber-200 text-xs font-medium tracking-widest uppercase mb-4 border border-stone-700">
            Interior Architecture & Styling
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white leading-tight">
            {demo.heroHeadline}
          </h1>
          <p className="mt-5 text-stone-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
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
              <span>Discuss Your Space</span>
            </a>
            <button
              onClick={() => setInquiryOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-600 font-semibold text-xs tracking-wider uppercase transition"
            >
              {demo.primaryCtaText || "Explore Portfolio"}
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demo.features.map((feat) => (
            <div key={feat.id} className="bg-white p-6 rounded-2xl shadow-lg border border-stone-200">
              <Layers className="w-5 h-5 text-amber-700 mb-3" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">{feat.title}</h2>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-700 font-bold">Services</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-1">Thoughtful Design Solutions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demo.services.map((s) => (
            <div key={s.id} className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
              <div>
                <Layout className="w-6 h-6 text-stone-700 mb-3" />
                <h3 className="font-serif font-bold text-lg text-stone-900">{s.title}</h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">{s.description}</p>
                {s.highlights && (
                  <ul className="mt-3 space-y-1.5 border-t border-stone-100 pt-3">
                    {s.highlights.map((h, i) => (
                      <li key={i} className="text-[11px] text-stone-500 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => setInquiryOpen(true)}
                className="mt-5 text-xs font-bold text-amber-800 flex items-center gap-1"
              >
                <span>Consult on this</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* About & Studio Location */}
      <section className="bg-stone-100 py-16 px-4 sm:px-6 lg:px-8 border-t border-stone-200">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">Studio Philosophy</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 mt-2">About {demo.businessName}</h2>
          <p className="mt-4 text-stone-600 text-sm leading-relaxed max-w-2xl mx-auto">{demo.aboutStory}</p>
          <p className="mt-3 text-stone-500 text-xs max-w-xl mx-auto">{demo.valueProposition}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-stone-700">
            <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
              <Phone className="w-3.5 h-3.5 text-stone-500" />
              {demo.contact.phone}
            </span>
            {demo.contact.address && (
              <span className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                {demo.contact.address}
              </span>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-stone-950 text-stone-400 text-xs py-8 px-4 text-center">
        <p className="font-medium text-stone-300">{demo.businessName}</p>
        <p className="mt-2 text-[11px] text-stone-500">{demo.disclaimer.conceptNotice}</p>
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
