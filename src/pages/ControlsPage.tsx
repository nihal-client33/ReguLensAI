import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { Control } from '../types';

export const ControlsPage: React.FC = () => {
  const { controls, obligations, evidence, setActivePage, selectedControlId, setSelectedControlId } = useComplianceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedEffectiveness, setSelectedEffectiveness] = useState<string>('All');
  const [inspectControl, setInspectControl] = useState<Control | null>(
    selectedControlId ? controls.find(c => c.id === selectedControlId) || null : null
  );

  const domains = ['All', 'Anti-Money Laundering', 'Cybersecurity', 'Credit Operations', 'Consumer Lending', 'Treasury & Liquidity', 'Vendor Risk Management', 'Data Privacy', 'Operations'];

  const filteredControls = controls.filter(c => {
    const matchesSearch =
      c.controlCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
    const matchesEff = selectedEffectiveness === 'All' || c.effectiveness === selectedEffectiveness;
    return matchesSearch && matchesDomain && matchesEff;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Internal Control Framework</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              {controls.length} Controls Assessed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bank policy and technical controls evaluated for design & operating effectiveness by Control Framework Agent
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
            placeholder="Search control code, title, owner..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Domain:</span>
            <select
              value={selectedDomain}
              onChange={e => setSelectedDomain(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              {domains.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Effectiveness:</span>
            <select
              value={selectedEffectiveness}
              onChange={e => setSelectedEffectiveness(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Effective">Effective</option>
              <option value="Partially Effective">Partially Effective</option>
              <option value="Not Tested">Not Tested</option>
            </select>
          </div>
        </div>
      </div>

      {/* Controls Table */}
      <div className="rounded-xl bg-navy-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Control ID</th>
                <th className="py-3 px-4">Control Name & Domain</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Mapped Obligations</th>
                <th className="py-3 px-4">Effectiveness</th>
                <th className="py-3 px-4">Evidence Status</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredControls.map(ctrl => {
                const isFrequencyMismatch = ctrl.id === 'AML-C-023';

                return (
                  <tr
                    key={ctrl.id}
                    onClick={() => setInspectControl(ctrl)}
                    className={`hover:bg-slate-850/60 transition-colors cursor-pointer group ${
                      isFrequencyMismatch ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {ctrl.controlCode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                        <span>{ctrl.name}</span>
                        {isFrequencyMismatch && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Cadence Mismatch
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{ctrl.domain}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {ctrl.owner}
                    </td>
                    <td className="py-3.5 px-4 font-medium whitespace-nowrap">
                      <span className={isFrequencyMismatch ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                        {ctrl.frequency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap font-mono">
                      {ctrl.mappedObligationIds.length} obligations
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          ctrl.effectiveness === 'Effective'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : ctrl.effectiveness === 'Partially Effective'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-300 border border-red-500/20'
                        }`}
                      >
                        {ctrl.effectiveness}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          ctrl.evidenceStatus === 'Evidence Available'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : ctrl.evidenceStatus === 'Evidence Expired'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {ctrl.evidenceStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          ctrl.riskLevel === 'Critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : ctrl.riskLevel === 'High'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {ctrl.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setInspectControl(ctrl);
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white"
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

      {/* Control Detail Inspector */}
      {inspectControl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                    {inspectControl.controlCode}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {inspectControl.domain}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {inspectControl.effectiveness}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1.5">{inspectControl.name}</h3>
              </div>
              <button
                onClick={() => setInspectControl(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-850 p-3 rounded-lg border border-slate-800">
              {inspectControl.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-850/60 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Execution Frequency</span>
                <span className="font-semibold text-white mt-0.5 block">{inspectControl.frequency}</span>
              </div>
              <div className="p-3 bg-slate-850/60 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Last Tested Date</span>
                <span className="font-mono text-slate-300 mt-0.5 block">{inspectControl.lastTestedDate}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-850/60 rounded-lg border border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Testing Procedure:</span>
              <p className="text-slate-300 leading-relaxed">{inspectControl.testingProcedure}</p>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400">
                Control Owner: <strong className="text-slate-200">{inspectControl.owner}</strong>
              </span>
              <button
                onClick={() => {
                  setInspectControl(null);
                  setActivePage('evidence');
                }}
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                <span>View Evidence Artifacts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
