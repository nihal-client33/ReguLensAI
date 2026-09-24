import React, { useState } from 'react';
import {
  FileSpreadsheet,
  UploadCloud,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { Evidence } from '../types';

export const EvidencePage: React.FC = () => {
  const { evidence, controls, setIsUploadOpen, setActivePage, setSelectedGapId } = useComplianceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [inspectEvidence, setInspectEvidence] = useState<Evidence | null>(null);

  const statuses = ['All', 'Found', 'Missing', 'Expired', 'Insufficient', 'Contradictory'];

  const filteredEvidence = evidence.filter(evd => {
    const matchesSearch =
      evd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evd.controlCode && evd.controlCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      evd.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || evd.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Evidence Assessment & Repository</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              {evidence.length} Artifacts Tracked
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous verification of test logs, sample runs, and audit reports by Evidence Assessment Agent
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Evidence Artifact</span>
        </button>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 bg-navy-900/80 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400">Verified Evidence</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            {evidence.filter(e => e.status === 'Found').length} items
          </div>
        </div>
        <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-900/40">
          <div className="text-[11px] text-amber-300">Insufficient / Cadence Mismatch</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">
            {evidence.filter(e => e.status === 'Insufficient').length} items
          </div>
        </div>
        <div className="p-3 bg-red-950/20 rounded-xl border border-red-900/40">
          <div className="text-[11px] text-red-300">Missing Evidence</div>
          <div className="text-lg font-bold text-red-400 mt-0.5">
            {evidence.filter(e => e.status === 'Missing').length} items
          </div>
        </div>
        <div className="p-3 bg-amber-950/20 rounded-xl border border-amber-900/40">
          <div className="text-[11px] text-amber-300">Expired Evidence</div>
          <div className="text-lg font-bold text-amber-400 mt-0.5">
            {evidence.filter(e => e.status === 'Expired').length} items
          </div>
        </div>
        <div className="p-3 bg-purple-950/20 rounded-xl border border-purple-900/40">
          <div className="text-[11px] text-purple-300">Contradictory / Exceptions</div>
          <div className="text-lg font-bold text-purple-400 mt-0.5">
            {evidence.filter(e => e.status === 'Contradictory').length} items
          </div>
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
            placeholder="Search evidence name, control code, type..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 whitespace-nowrap">Sufficiency Status:</span>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Evidence Table */}
      <div className="rounded-xl bg-navy-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Evidence ID & Name</th>
                <th className="py-3 px-4">Mapped Control</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Uploaded Date</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Sufficiency Status</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEvidence.map(evd => {
                const isDeficient = evd.status !== 'Found';

                return (
                  <tr
                    key={evd.id}
                    onClick={() => setInspectEvidence(evd)}
                    className={`hover:bg-slate-850/60 transition-colors cursor-pointer group ${
                      isDeficient ? 'bg-amber-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          {evd.id}
                        </span>
                        <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                          {evd.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-mono">
                        {evd.fileSize || '2.1 MB'} • Source: {evd.sourceUrl || 'GRC Vault'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-indigo-300 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {evd.controlCode || evd.controlId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap font-medium">
                      {evd.type}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono">
                      {evd.uploadedAt}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                      <span className={evd.status === 'Expired' ? 'text-red-400 font-bold' : 'text-slate-300'}>
                        {evd.expiryDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          evd.status === 'Found'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : evd.status === 'Insufficient'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : evd.status === 'Expired'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                        }`}
                      >
                        {evd.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold">
                      <span className={evd.sufficiencyScore > 80 ? 'text-emerald-400' : 'text-amber-400'}>
                        {evd.sufficiencyScore}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setInspectEvidence(evd);
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

      {/* Evidence Inspection Modal */}
      {inspectEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700">
                    {inspectEvidence.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {inspectEvidence.type}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      inspectEvidence.status === 'Found'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    Status: {inspectEvidence.status}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1.5">{inspectEvidence.name}</h3>
              </div>
              <button
                onClick={() => setInspectEvidence(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-slate-850 rounded-lg border border-slate-800 space-y-2 text-xs">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                Evidence Assessment Agent Evaluation Notes:
              </span>
              <p className="text-slate-200 leading-relaxed font-mono">
                {inspectEvidence.evaluatorNotes}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-850/60 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Mapped Control Code</span>
                <span className="font-mono text-indigo-300 font-bold mt-0.5 block">
                  {inspectEvidence.controlCode || inspectEvidence.controlId}
                </span>
              </div>
              <div className="p-3 bg-slate-850/60 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Sufficiency Score</span>
                <span className="font-mono font-bold text-emerald-400 mt-0.5 block">
                  {inspectEvidence.sufficiencyScore}% Sufficiency
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400">
                Expiry: <strong className="text-slate-200 font-mono">{inspectEvidence.expiryDate}</strong>
              </span>

              {inspectEvidence.id === 'EVD-0092' && (
                <button
                  onClick={() => {
                    setInspectEvidence(null);
                    setSelectedGapId('GAP-1042');
                    setActivePage('gaps');
                  }}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 font-semibold"
                >
                  <span>View Resulting Gap (GAP-1042)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
