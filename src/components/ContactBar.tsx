import React from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

interface ContactBarProps {
  phone: string;
  phoneRaw: string;
  whatsappLink: string;
  googleMapsLink?: string;
  accentColor?: string;
}

export const ContactBar: React.FC<ContactBarProps> = ({
  phone,
  phoneRaw,
  whatsappLink,
  googleMapsLink,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-4 py-2.5 sm:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${phoneRaw || phone}`}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow hover:bg-slate-800 transition active:scale-95"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call Now</span>
        </a>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow hover:bg-emerald-500 transition active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>
      </div>

      {googleMapsLink && (
        <div className="text-center mt-1.5">
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 underline"
          >
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>Open Location in Google Maps</span>
          </a>
        </div>
      )}
    </div>
  );
};
