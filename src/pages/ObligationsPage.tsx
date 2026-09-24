import React, { useState } from 'react';
import {
  FileCheck2,
  Filter,
  Search,
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { Obligation } from '../types';

export const ObligationsPage: React.FC = () => {
  const { obligations, regulations, controls, setActivePage, setSelectedControlId } = useComplianceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedApplicability, setSelectedApplicability] = useState<string>('All');
  const [selectedObligation, setSelectedObligation] = useState<Obligation | null>(null);

  const filteredObligations = obligations.filter(obl => {
    const matchesSearch =
      obl.obligationCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obl.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obl.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obl.section.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'All' || obl.risk === selectedRisk;
    const matchesApp = selectedApplicability === 'All' || obl.applicability === selectedApplicability;
    return matchesSearch && matchesRisk && matchesApp;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Structured Regulatory Obligations</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              {obligations.length} Active Clauses
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Machine-readable atomic obligations extracted by Obligation Extraction Agent and Applicability Agent
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-navy-900/80 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search requirement, section, owner..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Risk:</span>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Risks</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Applicability:</span>
            <select
              value={selectedApplicability}
              onChange={e => setSelectedApplicability(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Applicable">Applicable</option>
              <option value="Partially Applicable">Partially Applicable</option>
              <option value="Requires Review">Requires Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Obligations Grid / List */}
      <div className="rounded-xl bg-navy-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Code & Section</th>
                <th className="py-3 px-4">Requirement Statement</th>
                <th className="py-3 px-4">Regulation</th>
                <th className="py-3 px-4">Applicability</th>
                <th className="py-3 px-4">Cadence</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Mapped Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredObligations.map(obl => (
                <tr
                  key={obl.id}
                  onClick={() => setSelectedObligation(obl)}
                  className="hover:bg-slate-850/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                      {obl.obligationCode}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{obl.section}</div>
                  </td>
                  <td className="py-3 px-4 max-w-md">
                    <div className="text-slate-200 font-normal leading-relaxed line-clamp-2 group-hover:text-white transition-colors">
                      {obl.requirement}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {obl.regulationName || obl.regulationId}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        obl.applicability === 'Applicable'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : obl.applicability === 'Partially Applicable'
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}
                    >
                      {obl.applicability}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-300 whitespace-nowrap">
                    {obl.frequency}
                  </td>
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {obl.owner}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                        obl.risk === 'Critical'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : obl.risk === 'High'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {obl.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">
                    {obl.confidenceScore}%
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      {obl.mappedControlIds.map(cid => (
                        <button
                          key={cid}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedControlId(cid);
                            setActivePage('controls');
                          }}
                          className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-slate-700 transition-colors"
                        >
                          {cid}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Obligation Inspection Drawer / Modal */}
      {selectedObligation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                    {selectedObligation.obligationCode}
                  </span>
                  <span className="font-semibold text-xs text-white">{selectedObligation.section}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {selectedObligation.obligationType}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-2 leading-relaxed">
                  {selectedObligation.requirement}
                </h3>
              </div>
              <button
                onClick={() => setSelectedObligation(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicability Reasoning:</span>
                <p className="text-slate-300 mt-0.5">{selectedObligation.applicabilityReasoning}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Required Evidence:</span>
                <p className="text-indigo-300 font-mono mt-0.5">{selectedObligation.requiredEvidence}</p>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Source Gazette Reference:</span>
                <p className="text-slate-400 font-mono mt-0.5">{selectedObligation.sourceReference}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AI Extraction Confidence: {selectedObligation.confidenceScore}%
              </span>
              <button
                onClick={() => {
                  setSelectedObligation(null);
                  setActivePage('controls');
                }}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <span>Inspect Mapped Controls</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
