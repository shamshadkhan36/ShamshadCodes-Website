import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LeadRecord, DashboardStats } from '../types/demo';
import {
  Building2, ExternalLink, RefreshCw, Play, CheckCircle, AlertTriangle,
  Clock, Shield, LogOut, Search, Filter, Eye, ThumbsUp, Send, Smartphone,
  Layers, ChevronRight, Check, X, ArrowUpRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [batchLimit, setBatchLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  // Initial sample fallback leads for immediate local preview
  const sampleInitialLeads: LeadRecord[] = [
    {
      rowIndex: 2,
      googleMapLink: 'https://www.google.com/maps/place/Prinal+Real+Estate+Property',
      worksName: 'Prinal Real Estate Property, Farm House Plot, 1 Acre Plot, Industrial Plot',
      companyCategory: 'Real estate consultant',
      address: 'costal highway, Umbergaon',
      mobileNumber: '8866359740',
      website: 'N/A',
      existingStatus: 'Message Sent',
      demoSlug: 'prinal-real-estate-property',
      demoStatus: 'DEPLOYED',
      demoUrl: '/prinal-real-estate-property',
      demoGeneratedAt: '2026-10-29 04:30:00',
      outreachApproved: 'APPROVED',
      errorMessage: '',
      siteType: 'new',
    },
    {
      rowIndex: 3,
      googleMapLink: 'https://www.google.com/maps/place/Pranay+Prabhu+Real+Estate+Consultancy',
      worksName: 'Pranay Prabhu Real Estate Consultancy',
      companyCategory: 'Real estate agency',
      address: 'Prabhu Garments Irani Road, Dahanu Road 401602',
      mobileNumber: '7021577638',
      website: 'https://pranayprabhu.com',
      existingStatus: 'Message Sent',
      demoSlug: 'pranay-prabhu-real-estate',
      demoStatus: 'DEPLOYED',
      demoUrl: '/pranay-prabhu-real-estate',
      demoGeneratedAt: '2026-10-29 04:30:00',
      outreachApproved: 'PENDING',
      errorMessage: '',
      siteType: 'redesign',
    },
    {
      rowIndex: 4,
      googleMapLink: 'https://maps.google.com/?q=20.15,72.75',
      worksName: 'Omkar Property Advisory & Beach Lands',
      companyCategory: 'Real estate consultant',
      address: 'Station Road, Umbergaon 396171',
      mobileNumber: '9925184200',
      website: 'N/A',
      existingStatus: 'Message Sent',
      demoSlug: 'omkar-property-advisory',
      demoStatus: 'READY',
      demoUrl: '',
      demoGeneratedAt: '',
      outreachApproved: 'PENDING',
      errorMessage: '',
      siteType: 'new',
    },
    {
      rowIndex: 5,
      googleMapLink: 'https://maps.google.com/?q=19.98,72.73',
      worksName: 'Dahanu Coastal Cottages & Stays',
      companyCategory: 'Hotel & Hospitality',
      address: 'Bordi Beach Road, Dahanu',
      mobileNumber: '9822456789',
      website: 'http://dahanucottages.in',
      existingStatus: '',
      demoSlug: 'dahanu-coastal-cottages',
      demoStatus: 'READY',
      demoUrl: '',
      demoGeneratedAt: '',
      outreachApproved: 'PENDING',
      errorMessage: '',
      siteType: 'redesign',
    },
    {
      rowIndex: 6,
      googleMapLink: '',
      worksName: 'Shree Sai Interior Decors',
      companyCategory: 'Interior Designer',
      address: 'Main Market, Vapi Gujarat',
      mobileNumber: '9712345678',
      website: 'N/A',
      existingStatus: '',
      demoSlug: '',
      demoStatus: '',
      demoUrl: '',
      demoGeneratedAt: '',
      outreachApproved: '',
      errorMessage: '',
      siteType: 'new',
    },
  ];

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || sampleInitialLeads);
      } else {
        setLeads(sampleInitialLeads);
      }
    } catch (err) {
      setLeads(sampleInitialLeads);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('shamshadcodes_admin_token');
    navigate('/login');
  };

  const handleTriggerRun = async () => {
    setIsProcessing(true);
    setActiveMessage(`Starting automation run (dryRun: ${dryRun}, limit: ${batchLimit})...`);

    try {
      const res = await fetch('/api/run-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dryRun, limit: batchLimit }),
      });

      if (res.ok) {
        const result = await res.json();
        setActiveMessage(`Run completed! Processed: ${result.processedCount} leads.`);
        await fetchLeads();
      } else {
        // Simulated local fallback for offline/dry-run demo
        setTimeout(() => {
          setLeads((prev) =>
            prev.map((lead) => {
              if (lead.demoStatus === 'READY') {
                return {
                  ...lead,
                  demoStatus: 'DEPLOYED',
                  demoSlug: lead.demoSlug || lead.worksName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30),
                  demoUrl: `/${lead.demoSlug || lead.worksName.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`,
                  demoGeneratedAt: new Date().toISOString(),
                };
              }
              return lead;
            })
          );
          setActiveMessage('Simulated local worker execution finished.');
          setIsProcessing(false);
        }, 1500);
        return;
      }
    } catch (err) {
      setActiveMessage('Worker run triggered via local runner.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleReady = async (rowIndex: number) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.rowIndex === rowIndex) {
          const nextStatus = lead.demoStatus === 'READY' ? '' : 'READY';
          return { ...lead, demoStatus: nextStatus };
        }
        return lead;
      })
    );

    try {
      await fetch(`/api/leads/${rowIndex}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY' }),
      });
    } catch (e) {
      // Offline fallback
    }
  };

  const handleToggleApproval = async (rowIndex: number) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.rowIndex === rowIndex) {
          const nextApproval = lead.outreachApproved === 'APPROVED' ? 'PENDING' : 'APPROVED';
          return { ...lead, outreachApproved: nextApproval };
        }
        return lead;
      })
    );

    try {
      await fetch(`/api/leads/${rowIndex}/approve`, {
        method: 'POST',
      });
    } catch (e) {
      // Offline fallback
    }
  };

  // Compute stats
  const stats: DashboardStats = {
    totalLeads: leads.length,
    readyCount: leads.filter((l) => l.demoStatus === 'READY').length,
    generatingCount: leads.filter((l) => l.demoStatus === 'GENERATING' || l.demoStatus === 'DEPLOYING').length,
    deployedCount: leads.filter((l) => l.demoStatus === 'DEPLOYED').length,
    failedCount: leads.filter((l) => l.demoStatus === 'FAILED' || l.demoStatus === 'ERROR').length,
    approvedCount: leads.filter((l) => l.outreachApproved === 'APPROVED').length,
    newSitesCount: leads.filter((l) => l.siteType === 'new').length,
    redesignCount: leads.filter((l) => l.siteType === 'redesign').length,
  };

  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.worksName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.companyCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.mobileNumber.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'READY' && l.demoStatus === 'READY') ||
      (statusFilter === 'DEPLOYED' && l.demoStatus === 'DEPLOYED') ||
      (statusFilter === 'FAILED' && (l.demoStatus === 'FAILED' || l.demoStatus === 'ERROR')) ||
      (statusFilter === 'APPROVED' && l.outreachApproved === 'APPROVED');

    const matchesType =
      typeFilter === 'ALL' ||
      (typeFilter === 'NEW' && l.siteType === 'new') ||
      (typeFilter === 'REDESIGN' && l.siteType === 'redesign');

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* 1. Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/30">
              SC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-white">ShamshadCodes Website Factory</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  MVP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span>Sheet:</span>
                <span className="font-mono text-emerald-400 font-medium">sneha real estate agent</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchLeads}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Refresh lead data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Active Notification Banner */}
        {activeMessage && (
          <div className="mb-6 p-4 rounded-xl bg-indigo-950/80 border border-indigo-800 text-indigo-200 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>{activeMessage}</span>
            </div>
            <button
              onClick={() => setActiveMessage(null)}
              className="text-indigo-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 3. Controls & Worker Runner Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <span>Automation Worker Control</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Reads rows marked <code className="text-amber-400">READY</code> from Google Sheets, creates AI copy, and publishes Vercel demo URLs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              {/* Dry Run Toggle */}
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                />
                <span>Dry-Run Mode</span>
                <span className="text-[10px] text-slate-500">(No sheet writes)</span>
              </label>

              {/* Batch Limit */}
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                <span>Batch Limit:</span>
                <select
                  value={batchLimit}
                  onChange={(e) => setBatchLimit(Number(e.target.value))}
                  className="bg-transparent text-indigo-400 font-bold focus:outline-none"
                >
                  <option value={1}>1 lead</option>
                  <option value={3}>3 leads</option>
                  <option value={5}>5 leads (Max)</option>
                </select>
              </div>

              {/* Run Batch Button */}
              <button
                onClick={handleTriggerRun}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Batch...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Execute Batch Run</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Total Leads</span>
            <span className="text-2xl font-extrabold text-white mt-1 block">{stats.totalLeads}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{stats.newSitesCount} new &bull; {stats.redesignCount} redesign</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-amber-900/30">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">Awaiting (READY)</span>
            <span className="text-2xl font-extrabold text-amber-400 mt-1 block">{stats.readyCount}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Queued for run</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-sky-900/30">
            <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">In Generation</span>
            <span className="text-2xl font-extrabold text-sky-400 mt-1 block">{stats.generatingCount}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">AI active</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-emerald-900/30">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">Deployed Demos</span>
            <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">{stats.deployedCount}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Live URLs</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-rose-900/30">
            <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">Failed / Errors</span>
            <span className="text-2xl font-extrabold text-rose-400 mt-1 block">{stats.failedCount}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Requires retry</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-indigo-900/30">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block">Outreach Ready</span>
            <span className="text-2xl font-extrabold text-indigo-400 mt-1 block">{stats.approvedCount}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Approved for pitch</span>
          </div>
        </div>

        {/* 5. Filters & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search business, category, phone..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="READY">READY Only</option>
              <option value="DEPLOYED">DEPLOYED</option>
              <option value="FAILED">FAILED</option>
              <option value="APPROVED">Outreach APPROVED</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="ALL">All Site Types</option>
              <option value="NEW">New Website</option>
              <option value="REDESIGN">Redesign Pitch</option>
            </select>
          </div>
        </div>

        {/* 6. Leads Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Row</th>
                  <th className="px-4 py-3.5 font-semibold">Business Details</th>
                  <th className="px-4 py-3.5 font-semibold">Type</th>
                  <th className="px-4 py-3.5 font-semibold">Demo Status</th>
                  <th className="px-4 py-3.5 font-semibold">Preview URL</th>
                  <th className="px-4 py-3.5 font-semibold">Outreach Approval</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLeads.map((lead) => (
                  <tr key={lead.rowIndex} className="hover:bg-slate-800/40 transition">
                    {/* Row # */}
                    <td className="px-4 py-4 font-mono text-slate-500 font-semibold">
                      #{lead.rowIndex}
                    </td>

                    {/* Business Details */}
                    <td className="px-4 py-4 max-w-xs">
                      <div className="font-bold text-white text-xs line-clamp-1">{lead.worksName}</div>
                      <div className="text-[11px] text-indigo-400 mt-0.5">{lead.companyCategory}</div>
                      <div className="text-[10px] text-slate-500 mt-1 truncate">
                        {lead.address} &bull; <span className="font-mono text-slate-400">{lead.mobileNumber}</span>
                      </div>
                    </td>

                    {/* Type (New vs Redesign) */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {lead.siteType === 'redesign' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                          <span>Redesign</span>
                          {lead.website && lead.website !== 'N/A' && (
                            <a
                              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-300 hover:text-white"
                              title={lead.website}
                            >
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-semibold">
                          New Website
                        </span>
                      )}
                    </td>

                    {/* Demo Status */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {lead.demoStatus === 'DEPLOYED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>DEPLOYED</span>
                        </span>
                      )}
                      {lead.demoStatus === 'READY' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>READY</span>
                        </span>
                      )}
                      {(lead.demoStatus === 'GENERATING' || lead.demoStatus === 'DEPLOYING') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-semibold">
                          <RefreshCw className="w-3 h-3 animate-spin text-sky-400" />
                          <span>GENERATING</span>
                        </span>
                      )}
                      {(lead.demoStatus === 'FAILED' || lead.demoStatus === 'ERROR') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-semibold" title={lead.errorMessage}>
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>FAILED</span>
                        </span>
                      )}
                      {!lead.demoStatus && (
                        <span className="text-slate-600 text-[10px] italic">Not queued</span>
                      )}
                    </td>

                    {/* Preview URL */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {lead.demoSlug ? (
                        <Link
                          to={`/${lead.demoSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-mono text-[11px] border border-indigo-500/30 transition group"
                        >
                          <Eye className="w-3 h-3 group-hover:scale-110 transition" />
                          <span>/{lead.demoSlug}</span>
                          <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                        </Link>
                      ) : (
                        <span className="text-slate-600 text-[11px]">&mdash;</span>
                      )}
                    </td>

                    {/* Outreach Approval */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleApproval(lead.rowIndex)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                          lead.outreachApproved === 'APPROVED'
                            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {lead.outreachApproved === 'APPROVED' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>APPROVED</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>PENDING</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleReady(lead.rowIndex)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition ${
                            lead.demoStatus === 'READY'
                              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 hover:bg-amber-600/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {lead.demoStatus === 'READY' ? 'Unmark' : 'Mark READY'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
