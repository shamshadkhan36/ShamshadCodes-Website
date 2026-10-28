import React, { useState } from 'react';
import { AlertCircle, ChevronUp, ChevronDown, Sparkles, ExternalLink, Phone, MessageCircle } from 'lucide-react';

interface ConceptBannerProps {
  businessName: string;
  isRedesign?: boolean;
  existingUrl?: string;
}

export const ConceptBanner: React.FC<ConceptBannerProps> = ({
  businessName,
  isRedesign,
  existingUrl,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const claimPhoneNumber = '9370262177';
  const claimPhoneDisplay = '+91 93702 62177';

  const claimWhatsAppUrl = `https://wa.me/91${claimPhoneNumber}?text=${encodeURIComponent(
    `Hi ShamshadCodes, I saw the website concept demo for "${businessName}" and I would like to claim this website!`
  )}`;

  return (
    <aside aria-label="Website Concept Banner" className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg border-b border-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2.5 flex-1 min-w-0">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            <span className="bg-indigo-600/80 text-white font-semibold px-2 py-0.5 rounded text-[11px] tracking-wide uppercase flex-shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              ShamshadCodes Concept
            </span>

            {!collapsed && (
              <p className="truncate text-slate-200">
                <span className="font-medium text-white">{businessName}</span>
                <span className="hidden md:inline"> &mdash; Unofficial concept demonstration built to showcase modern web capabilities.</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 ml-4 flex-shrink-0">
            {isRedesign && existingUrl && !collapsed && (
              <a
                href={existingUrl.startsWith('http') ? existingUrl : `https://${existingUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white underline decoration-slate-500 text-xs"
              >
                <span>Current Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <a
              href={`tel:+91${claimPhoneNumber}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-xs border border-slate-700 hover:border-slate-500 px-2.5 py-1 rounded transition"
              title={`Call Shamshad directly at ${claimPhoneDisplay}`}
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{claimPhoneDisplay}</span>
            </a>

            <a
              href={claimWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-3 py-1 rounded text-xs transition shadow-sm flex items-center gap-1.5 active:scale-95"
              title={`Claim this website on WhatsApp: ${claimPhoneDisplay}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Claim This Website</span>
            </a>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-slate-400 hover:text-white p-1 rounded transition"
              title={collapsed ? "Expand banner" : "Minimize banner"}
              aria-label={collapsed ? "Expand concept banner" : "Minimize concept banner"}
            >
              {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {!collapsed && isRedesign && (
          <div className="mt-1.5 pt-1.5 border-t border-indigo-900/60 flex items-center gap-2 text-[11px] text-amber-300">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Redesign Proposal: Highlighting ultra-fast mobile performance, WhatsApp lead capture, and modern aesthetic.</span>
          </div>
        )}
      </div>
    </aside>
  );
};
