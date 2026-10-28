import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DemoContent } from '../types/demo';
import { sampleDemos } from '../data/sample-demos';
import { RealEstateTemplate } from '../templates/RealEstateTemplate';
import { InteriorDesignTemplate } from '../templates/InteriorDesignTemplate';
import { HotelTemplate } from '../templates/HotelTemplate';
import { EducationTemplate } from '../templates/EducationTemplate';
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate';
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export const DemoViewer: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [demo, setDemo] = useState<DemoContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDemo() {
      if (!slug) {
        setError('No demo slug specified.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Strategy 1: Check in-memory sample demos first (instant)
      if (sampleDemos[slug]) {
        if (isMounted) {
          setDemo(sampleDemos[slug]);
          setLoading(false);
        }
        return;
      }

      // Strategy 2: Fetch from static public directory /demos/{slug}.json
      try {
        const res = await fetch(`/demos/${encodeURIComponent(slug)}.json`);
        if (res.ok) {
          const data: DemoContent = await res.json();
          if (isMounted) {
            setDemo(data);
            setLoading(false);
          }
          return;
        }
      } catch (err) {
        // Fall through to Strategy 3
      }

      // Strategy 3: Fetch from worker dynamic API /api/demos/{slug}
      try {
        const apiRes = await fetch(`/api/demos/${encodeURIComponent(slug)}`);
        if (apiRes.ok) {
          const data: DemoContent = await apiRes.json();
          if (isMounted) {
            setDemo(data);
            setLoading(false);
          }
          return;
        }
      } catch (err) {
        // Fall through
      }

      if (isMounted) {
        setError(`Demo "${slug}" was not found or is still generating.`);
        setLoading(false);
      }
    }

    loadDemo();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-4">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-tight">Loading Demo Preview...</h2>
        <p className="text-sm text-slate-400 mt-1">Retrieving verified business configuration for <span className="font-mono text-indigo-300">/{slug}</span></p>
      </div>
    );
  }

  if (error || !demo) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Demo Not Found</h1>
          <p className="text-sm text-slate-400 mt-2">
            We couldn't find a generated website preview for slug:
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 my-4 font-mono text-xs text-rose-300 break-all">
            {slug}
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Ensure this lead is marked as <code className="text-amber-300">READY</code> in the Google Sheet and that the automation worker has executed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/dashboard"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render template based on category
  switch (demo.templateType) {
    case 'real_estate':
      return <RealEstateTemplate demo={demo} />;
    case 'interior_design':
      return <InteriorDesignTemplate demo={demo} />;
    case 'hotel':
      return <HotelTemplate demo={demo} />;
    case 'education':
      return <EducationTemplate demo={demo} />;
    case 'professional_services':
    default:
      return <ProfessionalTemplate demo={demo} />;
  }
};
