import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Play,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  FileText,
  Shield,
  Layers,
  FileCheck2,
  Cpu
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { RegulatoryChange } from '../types';

export const RegulatoryChangePage: React.FC = () => {
  const {
    regulatoryChanges,
    runImpactAnalysisForChange,
    setActivePage,
    setSelectedGapId
  } = useComplianceStore();

  const [selectedChangeId, setSelectedChangeId] = useState<string>(
    regulatoryChanges[0]?.id || 'CHG-RBI-KYC-2026-09'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string | null>(null);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);

  const activeChange = regulatoryChanges.find(c => c.id === selectedChangeId) || regulatoryChanges[0];

  const handleRunImpactAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnalysisResult(false);

    const steps = [
      'Analyzing regulation text & gazette diffs...',
      'Extracting obligations & clauses...',
      'Checking legal applicability for bank entities...',
      'Searching bank internal control framework...',
      'Evaluating existing evidence sufficiency...',
      'Calculating cascade risk & blast radius...',
      'Synthesizing remediation recommendations...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 350));
    }

    await runImpactAnalysisForChange(activeChange.id);
    setIsAnalyzing(false);
    setAnalysisStep(null);
    setShowAnalysisResult(true);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Regulatory Change Intelligence</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              Autonomous Horizon Scanning
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Timeline tracking, granular textual diff comparison, and autonomous cascade impact analysis
          </p>
        </div>

        <button
          onClick={handleRunImpactAnalysis}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          {isAnalyzing ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              <span>Multi-Agent Swarm Analyzing...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-amber-400" />
              <span>Run Autonomous Impact Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Live Agent Runner Overlay when executing */}
      {isAnalyzing && (
        <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-500/60 text-white shadow-2xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center font-mono">
              <Cpu className="w-5 h-5 text-white animate-spin" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider">
                Autonomous Swarm Execution in Progress
              </span>
              <p className="text-xs font-semibold text-white mt-0.5 font-mono">
                {analysisStep}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container: Timeline Selector on Left, Diff & Impact on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Change Timeline List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Detected Regulatory Amendments ({regulatoryChanges.length})
          </h3>

          <div className="space-y-2.5">
            {regulatoryChanges.map(change => {
              const isSelected = change.id === selectedChangeId;

              return (
                <div
                  key={change.id}
                  onClick={() => {
                    setSelectedChangeId(change.id);
                    setShowAnalysisResult(false);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-navy-900 border-indigo-500 shadow-lg shadow-indigo-600/20'
                      : 'bg-navy-900/60 border-slate-800 hover:border-slate-700 hover:bg-navy-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-mono text-indigo-400 font-semibold">{change.changeDate}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded font-semibold text-[10px] ${
                        change.impactLevel === 'Critical'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {change.impactLevel} Impact
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white leading-snug">{change.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{change.changeSummary}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>{change.previousVersion} → {change.newVersion}</span>
                    <span>{change.affectedControlCount} controls</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Before vs After Textual Diff & Blast Radius */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Change Banner */}
          <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700 font-mono">
                  {activeChange.regulationName}
                </span>
                <h2 className="text-base font-bold text-white mt-2">{activeChange.title}</h2>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {activeChange.changeSummary}
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800 text-center">
              <div className="p-2 bg-slate-850 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Obligations</span>
                <span className="font-bold text-sky-400 font-mono text-sm">{activeChange.affectedObligationCount}</span>
              </div>
              <div className="p-2 bg-slate-850 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Affected Controls</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">{activeChange.affectedControlCount}</span>
              </div>
              <div className="p-2 bg-slate-850 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Internal Policies</span>
                <span className="font-bold text-purple-400 font-mono text-sm">{activeChange.affectedPolicyCount}</span>
              </div>
              <div className="p-2 bg-slate-850 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Evidence Types</span>
                <span className="font-bold text-teal-400 font-mono text-sm">{activeChange.affectedEvidenceCount}</span>
              </div>
              <div className="p-2 bg-slate-850 rounded-lg">
                <span className="text-[10px] text-slate-400 block">Potential Gaps</span>
                <span className="font-bold text-red-400 font-mono text-sm">{activeChange.potentialGapsCount}</span>
              </div>
            </div>
          </div>

          {/* Autonomous Impact Summary (Shown after running analysis) */}
          {showAnalysisResult && (
            <div className="p-5 rounded-2xl bg-indigo-950/40 border-2 border-indigo-500 shadow-xl space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Autonomous Impact Analysis Results</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700 font-semibold">
                  2 Critical Actions Required
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">High-Risk Discrepancy</span>
                  <div className="font-semibold text-white">AML-C-023 Review Cadence</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Control scheduled annually; new rule requires quarterly high-risk execution.
                  </p>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Resulting GRC Gap</span>
                  <div className="font-semibold text-red-300 font-mono">GAP-1042 Prioritized</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Risk score: 92/100 (Critical). Monetary penalty risk under Sec 47A.
                  </p>
                </div>
                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Proposed Remediation</span>
                  <div className="font-semibold text-indigo-300 font-mono">REM-001 Synthesized</div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Reconfigure batch scheduler & update Section 4.2 of AML Policy.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-mono">
                  Grounded confidence score: <strong className="text-emerald-400">98%</strong>
                </span>
                <button
                  onClick={() => {
                    setSelectedGapId('GAP-1042');
                    setActivePage('gaps');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors"
                >
                  <span>Review Prioritized Gap (GAP-1042)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Granular Before vs After Textual Diff */}
          <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Granular Section Diff & Textual Comparison
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  AI highlighted additions, removals, and wording changes from central gazette
                </p>
              </div>

              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-red-400">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Removed
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Added
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Modified
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {activeChange.diffDetails.map((diff, dIdx) => (
                <div key={dIdx} className="p-4 bg-slate-850/60 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-indigo-300 font-mono">{diff.section}</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Before Text */}
                    <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold uppercase text-red-400 block font-mono">
                        Previous Version ({activeChange.previousVersion})
                      </span>
                      <p className="text-slate-300 leading-relaxed font-mono">
                        {diff.beforeText ? (
                          <span className="line-through text-red-300/80">{diff.beforeText}</span>
                        ) : (
                          <span className="text-slate-500 italic">No prior provision (Newly introduced clause)</span>
                        )}
                      </p>
                    </div>

                    {/* After Text */}
                    <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 block font-mono">
                        Amended Version ({activeChange.newVersion})
                      </span>
                      <p className="text-slate-200 leading-relaxed font-mono">
                        {diff.afterText ? (
                          <span className="text-emerald-300 font-medium bg-emerald-950/50 px-1 rounded">
                            {diff.afterText}
                          </span>
                        ) : (
                          <span className="text-red-400 font-semibold italic">Clause rescinded / removed</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
