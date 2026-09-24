import React, { useState } from 'react';
import {
  BookOpen,
  UploadCloud,
  Search,
  Filter,
  Eye,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  Calendar,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { Regulation } from '../types';

export const RegulationsPage: React.FC = () => {
  const {
    regulations,
    obligations,
    controls,
    setIsUploadOpen,
    selectedRegulationId,
    setSelectedRegulationId
  } = useComplianceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('All');
  const [viewSourceText, setViewSourceText] = useState<string | null>(null);

  const jurisdictions = ['All', 'India', 'Global / Multi-Jurisdiction', 'Global', 'European Union / Cross-Border'];

  const filteredRegulations = regulations.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.regulator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJurisdiction =
      selectedJurisdiction === 'All' || r.jurisdiction.includes(selectedJurisdiction);
    return matchesSearch && matchesJurisdiction;
  });

  const selectedRegulation = regulations.find(r => r.id === selectedRegulationId);
  const relatedObligations = selectedRegulation
    ? obligations.filter(o => o.regulationId === selectedRegulation.id)
    : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Regulatory Intelligence</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              {regulations.length} Tracked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous ingestion, version control, and clause extraction from official central bank gazettes
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Regulation (PDF/DOCX)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-navy-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search regulations, regulators, topics..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 whitespace-nowrap">Jurisdiction:</span>
          <select
            value={selectedJurisdiction}
            onChange={e => setSelectedJurisdiction(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            {jurisdictions.map(j => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Regulations Table */}
      <div className="rounded-xl bg-navy-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Regulation Title & Topic</th>
                <th className="py-3 px-4">Regulator</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4">Effective Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Obligations</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRegulations.map(reg => {
                const oblCount = obligations.filter(o => o.regulationId === reg.id).length;

                return (
                  <tr
                    key={reg.id}
                    className="hover:bg-slate-850/60 transition-colors group cursor-pointer"
                    onClick={() => setSelectedRegulationId(reg.id)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                        {reg.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {reg.topic}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300 whitespace-nowrap">
                      {reg.regulator}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {reg.jurisdiction}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-indigo-300 whitespace-nowrap">
                      {reg.version}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {reg.publishedDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold whitespace-nowrap">
                      {reg.effectiveDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          reg.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                      {oblCount} obl
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedRegulationId(reg.id);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                        title="View Extracted Obligations & Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regulation Detail Modal */}
      {selectedRegulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-4xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/60">
                    {selectedRegulation.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                    {selectedRegulation.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Version: {selectedRegulation.version}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">{selectedRegulation.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Issued by {selectedRegulation.regulator} • {selectedRegulation.jurisdiction}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {selectedRegulation.sourceTextSnippet && (
                  <button
                    onClick={() => setViewSourceText(selectedRegulation.sourceTextSnippet || '')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-indigo-300 hover:text-white transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Source Text</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedRegulationId(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-6">
              {/* Metadata Overview Banner */}
              <div className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Published Date</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{selectedRegulation.publishedDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Effective Date</span>
                  <span className="font-semibold text-indigo-300 mt-0.5 block">{selectedRegulation.effectiveDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Regulatory Topic</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">{selectedRegulation.topic}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Obligations</span>
                  <span className="font-semibold text-emerald-400 font-mono text-sm mt-0.5 block">
                    {relatedObligations.length} Extracted
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Scope & Regulatory Summary
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-850/40 p-3 rounded-lg border border-slate-800/80">
                  {selectedRegulation.description}
                </p>
              </div>

              {/* Affected Products */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Affected Products & Business Lines
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRegulation.affectedProducts.map((p, pIdx) => (
                    <span
                      key={pIdx}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 border border-slate-700"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Obligations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-indigo-400" />
                    <span>Extracted Obligations ({relatedObligations.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Parsed by Obligation Extraction Agent</span>
                </div>

                <div className="space-y-2.5">
                  {relatedObligations.map(obl => (
                    <div
                      key={obl.id}
                      className="p-4 rounded-xl bg-slate-850/70 border border-slate-800 hover:border-slate-700 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                            {obl.obligationCode}
                          </span>
                          <span className="font-semibold text-xs text-white">{obl.section}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              obl.risk === 'Critical'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                : obl.risk === 'High'
                                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {obl.risk} Risk
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="text-slate-400">Cadence: <strong className="text-slate-200">{obl.frequency}</strong></span>
                          <span className="text-emerald-400 font-mono font-semibold">{obl.confidenceScore}% Conf</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed font-normal">
                        "{obl.requirement}"
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                        <div>
                          <span>Owner: <strong className="text-slate-300">{obl.owner}</strong></span>
                          <span className="mx-2">•</span>
                          <span>Applicability: <strong className="text-indigo-300">{obl.applicability}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span>Mapped Controls:</span>
                          {obl.mappedControlIds.map(cid => (
                            <span
                              key={cid}
                              className="font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] border border-slate-700"
                            >
                              {cid}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Source Text Drawer / Modal */}
      {viewSourceText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-navy-900 border border-slate-700 rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Original Regulatory Text Snippet</span>
              </h3>
              <button onClick={() => setViewSourceText(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-slate-850 rounded-lg border border-slate-750 text-xs font-mono text-slate-200 leading-relaxed">
              {viewSourceText}
            </div>
            <div className="text-[11px] text-slate-400 italic">
              Extracted directly from official regulatory circular gazette for traceability compliance.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
