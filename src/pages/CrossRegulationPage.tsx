import React, { useState } from 'react';
import {
  Scale,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
  Info,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { CrossRegMatrixItem, ContradictionFinding } from '../types';

export const CrossRegulationPage: React.FC = () => {
  const { crossRegMatrix, contradictions } = useComplianceStore();

  const [activeTab, setActiveTab] = useState<'matrix' | 'contradictions'>('matrix');
  const [selectedContradiction, setSelectedContradiction] = useState<ContradictionFinding | null>(null);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Cross-Regulation Intelligence & Contradictions</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              Multi-Jurisdictional Alignment
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare RBI, Basel III, FATF, DPDP, and DORA frameworks for common obligations, control reuse, and legal contradictions
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cross-Regulation Matrix ({crossRegMatrix.length})
          </button>
          <button
            onClick={() => setActiveTab('contradictions')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'contradictions' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Contradiction Engine ({contradictions.length})
          </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        /* Cross-Regulation Matrix View */
        <div className="space-y-4">
          <div className="p-4 bg-navy-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Identified Opportunities: <strong>100% Control Reuse</strong> for Sanctions & Multi-Lingual Consent Frameworks</span>
            </div>
            <span className="text-emerald-400 font-mono text-[11px]">4 Matrix Domains Harmonized</span>
          </div>

          <div className="space-y-4">
            {crossRegMatrix.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-navy-900 border border-slate-800 hover:border-slate-700 space-y-4 shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                        {item.domain}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.status === 'Harmonized'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1">
                      {item.regulationA} <span className="text-slate-500 font-normal">vs</span> {item.regulationB}
                    </h3>
                  </div>

                  <span className="text-xs text-slate-400 italic">Topic: {item.topic}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Common Obligations */}
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-sky-400 block font-mono flex items-center gap-1">
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Common Obligations</span>
                    </span>
                    <div className="space-y-1">
                      {item.commonObligations.map((obl, oIdx) => (
                        <div key={oIdx} className="text-slate-300 text-[11px] leading-relaxed">
                          • {obl}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overlapping Controls */}
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Overlapping Controls</span>
                    </span>
                    <div className="space-y-1">
                      {item.overlappingControls.map((ctrl, cIdx) => (
                        <div key={cIdx} className="text-slate-300 text-[11px] leading-relaxed">
                          • {ctrl}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Control Reuse Strategy */}
                  <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-800/40 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-indigo-300 block font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Potential Control Reuse</span>
                    </span>
                    <p className="text-slate-200 text-[11px] leading-relaxed">
                      {item.reusableControls[0]}
                    </p>
                  </div>
                </div>

                {/* Divergence Notes */}
                <div className="p-3 bg-slate-850/50 rounded-lg text-xs text-slate-400 border border-slate-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-300">Regulatory Divergence Note: </strong>
                    <span>{item.divergenceNotes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Regulatory Contradiction Engine View */
        <div className="space-y-4">
          <div className="p-4 bg-navy-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300">
              AI classified <strong>{contradictions.length} potential friction points</strong> across banking circulars and privacy statutes.
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              0 Direct Statutory Blockers
            </span>
          </div>

          <div className="space-y-4">
            {contradictions.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedContradiction(item)}
                className="p-5 rounded-2xl bg-navy-900 border border-slate-800 hover:border-indigo-600/50 cursor-pointer transition-all space-y-4 shadow-md group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {item.id}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.classification === 'Frequency Difference'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : item.classification === 'Conditional Difference'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            : 'bg-sky-950 text-sky-300 border border-sky-800'
                        }`}
                      >
                        {item.classification}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">{item.confidence}% Confidence</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 group-hover:text-indigo-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Compared Quotes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-indigo-400">{item.regulationA.name}</span>
                      <span className="text-slate-500">{item.regulationA.section}</span>
                    </div>
                    <blockquote className="text-slate-300 italic font-mono bg-slate-900 p-2 rounded border border-slate-800">
                      "{item.regulationA.quote}"
                    </blockquote>
                    <div className="text-[10px] text-slate-400">Cadence: {item.regulationA.frequency}</div>
                  </div>

                  <div className="p-3 bg-slate-850 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold text-purple-400">{item.regulationB.name}</span>
                      <span className="text-slate-500">{item.regulationB.section}</span>
                    </div>
                    <blockquote className="text-slate-300 italic font-mono bg-slate-900 p-2 rounded border border-slate-800">
                      "{item.regulationB.quote}"
                    </blockquote>
                    <div className="text-[10px] text-slate-400">Cadence: {item.regulationB.frequency}</div>
                  </div>
                </div>

                {/* Explanation & Reconciliation */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-850/60 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      AI Legal Reasoning:
                    </span>
                    <p className="text-slate-200 leading-relaxed">{item.explanation}</p>
                  </div>

                  <div className="p-3 bg-emerald-950/20 rounded-lg border border-emerald-900/40">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Reconciliation Strategy:</span>
                    </span>
                    <p className="text-slate-200 leading-relaxed font-mono">{item.reconciliationStrategy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
