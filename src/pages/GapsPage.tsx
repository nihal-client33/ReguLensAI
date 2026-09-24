import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Calendar,
  X,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { Gap } from '../types';

export const GapsPage: React.FC = () => {
  const {
    gaps,
    obligations,
    controls,
    regulations,
    generateRemediationForGap,
    setActivePage,
    selectedGapId,
    setSelectedGapId
  } = useComplianceStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isGenerating, setIsGenerating] = useState(false);

  const gapTypes = [
    'All',
    'Regulatory Change Not Implemented',
    'Missing Evidence',
    'Failed Control Test',
    'Weak Control',
    'Missing Control'
  ];

  const filteredGaps = gaps.filter(g => {
    const matchesSearch =
      g.gapCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'All' || g.riskLevel === selectedRisk;
    const matchesType = selectedType === 'All' || g.gapType === selectedType;
    return matchesSearch && matchesRisk && matchesType;
  });

  const inspectedGap = selectedGapId
    ? gaps.find(g => g.gapCode === selectedGapId || g.id === selectedGapId)
    : null;

  const handleGenerateRemediation = async (gap: Gap) => {
    setIsGenerating(true);
    try {
      await generateRemediationForGap(gap.id);
      setActivePage('remediation');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Gap Assessment & Risk Prioritization</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700/50">
              {gaps.length} GRC Gaps Prioritized
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous gap identification, root cause diagnosis, and multi-factor risk prioritization
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
            placeholder="Search GAP code, title, owner..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Risk Priority:</span>
            <select
              value={selectedRisk}
              onChange={e => setSelectedRisk(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Risks</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Gap Type:</span>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            >
              {gapTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gaps Table */}
      <div className="rounded-xl bg-navy-900 border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Gap ID & Title</th>
                <th className="py-3 px-4">Gap Type</th>
                <th className="py-3 px-4">Regulation</th>
                <th className="py-3 px-4">Control Code</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredGaps.map(gap => {
                const isCrit = gap.riskLevel === 'Critical';

                return (
                  <tr
                    key={gap.id}
                    onClick={() => setSelectedGapId(gap.gapCode)}
                    className={`hover:bg-slate-850/60 transition-colors cursor-pointer group ${
                      isCrit ? 'bg-red-950/10' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/50">
                          {gap.gapCode}
                        </span>
                        <span className="font-semibold text-white group-hover:text-red-300 transition-colors">
                          {gap.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                        {gap.gapType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {gap.regulationId}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-indigo-300 whitespace-nowrap">
                      {gap.controlId || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          gap.riskLevel === 'Critical'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : gap.riskLevel === 'High'
                            ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {gap.riskLevel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      <span className={gap.riskScore > 85 ? 'text-red-400' : 'text-orange-400'}>
                        {gap.riskScore}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {gap.owner}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono">
                      {gap.dueDate}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          gap.status === 'Open'
                            ? 'bg-red-500/10 text-red-300 border border-red-500/20'
                            : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                        }`}
                      >
                        {gap.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedGapId(gap.gapCode);
                        }}
                        className="p-1 rounded bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-white"
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

      {/* Gap Detail Modal */}
      {inspectedGap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">
                    {inspectedGap.gapCode}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {inspectedGap.gapType}
                  </span>
                  <span className="text-xs font-bold text-red-400 font-mono">
                    Risk Score: {inspectedGap.riskScore}/100 ({inspectedGap.riskLevel})
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-2">{inspectedGap.title}</h3>
              </div>
              <button
                onClick={() => setSelectedGapId(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs">
              {/* Gap Summary */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Gap Summary</span>
                <p className="text-slate-200 leading-relaxed bg-slate-850 p-3 rounded-lg border border-slate-800">
                  {inspectedGap.description}
                </p>
              </div>

              {/* Multi-Factor Risk Breakdown */}
              <div className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Risk Factor Breakdown (Explainable Scoring)
                  </span>
                  <span className="text-[10px] text-slate-400">Calculated by Risk Prioritization Agent</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Regulatory Severity</span>
                      <span className="text-red-400 font-mono font-bold">{inspectedGap.riskFactors.regulatorySeverity}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-1.5" style={{ width: `${inspectedGap.riskFactors.regulatorySeverity}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Legal Exposure</span>
                      <span className="text-red-400 font-mono font-bold">{inspectedGap.riskFactors.legalImpact}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-red-500 h-1.5" style={{ width: `${inspectedGap.riskFactors.legalImpact}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Business Impact</span>
                      <span className="text-orange-400 font-mono font-bold">{inspectedGap.riskFactors.businessImpact}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-1.5" style={{ width: `${inspectedGap.riskFactors.businessImpact}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Control Weakness</span>
                      <span className="text-orange-400 font-mono font-bold">{inspectedGap.riskFactors.controlWeakness}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-1.5" style={{ width: `${inspectedGap.riskFactors.controlWeakness}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Financial Penalty</span>
                      <span className="text-amber-400 font-mono font-bold">{inspectedGap.riskFactors.financialImpact}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-1.5" style={{ width: `${inspectedGap.riskFactors.financialImpact}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">Customer Harm</span>
                      <span className="text-blue-400 font-mono font-bold">{inspectedGap.riskFactors.customerImpact}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-1.5" style={{ width: `${inspectedGap.riskFactors.customerImpact}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Root Cause & Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-850/60 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Root Cause Diagnosis</span>
                  <p className="text-slate-300 leading-relaxed">{inspectedGap.rootCause}</p>
                </div>
                <div className="p-3 bg-slate-850/60 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Assessment Notes</span>
                  <p className="text-slate-300 leading-relaxed">{inspectedGap.assessmentNotes}</p>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="p-3.5 bg-indigo-950/30 rounded-xl border border-indigo-800/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Recommended Remediation Action</span>
                </span>
                <p className="text-slate-200 leading-relaxed">{inspectedGap.recommendedAction}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Assigned Owner: <strong className="text-white">{inspectedGap.owner}</strong> • Due: {inspectedGap.dueDate}
              </span>

              <button
                onClick={() => handleGenerateRemediation(inspectedGap)}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>Synthesizing Plan...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Generate Remediation Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
