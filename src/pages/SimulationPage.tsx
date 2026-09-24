import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Play,
  ArrowRight,
  Sparkles,
  GitFork,
  AlertTriangle,
  Clock,
  Layers,
  CheckCircle2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { WhatIfSimulation } from '../types';

export const SimulationPage: React.FC = () => {
  const { simulations, setActivePage, setSelectedGapId } = useComplianceStore();

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('SIM-001');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('Quarterly');
  const [targetCohort, setTargetCohort] = useState<string>('High-Risk Only');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<WhatIfSimulation['impactResults'] | null>(null);

  const activeScenario = simulations.find(s => s.scenarioId === selectedScenarioId) || simulations[0];

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Dynamic calculation based on frequency and cohort
    const isQuarterly = selectedFrequency === 'Quarterly';
    const isAll = targetCohort === 'All Customers';

    setSimResults({
      affectedRegulations: 2,
      affectedObligations: isAll ? 6 : 4,
      affectedControls: isAll ? 11 : 7,
      affectedBusinessUnits: isAll ? 6 : 4,
      additionalEvidenceRequired: isAll ? 24 : 12,
      potentialGaps: isAll ? 5 : 3,
      riskIncrease: isQuarterly ? 'High' : 'Medium',
      estimatedRemediationDays: isAll ? 75 : 45
    });

    setIsSimulating(false);
  };

  const results = simResults || activeScenario.impactResults;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">What-If Simulation Engine</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              Cascade Blast Radius Modeler
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate hypothetical regulatory shifts, cadence contractions, and operational shock waves across the bank
          </p>
        </div>

        {/* Scenario preset selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Pre-configured Scenario:</span>
          <select
            value={selectedScenarioId}
            onChange={e => {
              setSelectedScenarioId(e.target.value);
              setSimResults(null);
            }}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            {simulations.map(s => (
              <option key={s.scenarioId} value={s.scenarioId}>
                {s.scenarioTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Simulation Controls Bar */}
      <div className="p-5 rounded-2xl bg-navy-900 border border-slate-800 space-y-4 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
              <span>Simulation Hypothesis Parameters</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeScenario.description}
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
          >
            {isSimulating ? (
              <>
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>Simulating Cascade...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
                <span>Re-run Simulation</span>
              </>
            )}
          </button>
        </div>

        {/* Parameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Regulatory Review Frequency</label>
            <select
              value={selectedFrequency}
              onChange={e => setSelectedFrequency(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="Annual">Annual (Current Baseline - 365 Days)</option>
              <option value="Semi-Annual">Semi-Annual (180 Days)</option>
              <option value="Quarterly">Quarterly (Mandated High-Risk - 90 Days)</option>
              <option value="Monthly">Monthly (Ultra-High Scrutiny - 30 Days)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Target Account Population</label>
            <select
              value={targetCohort}
              onChange={e => setTargetCohort(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
            >
              <option value="High-Risk Only">High-Risk Accounts Only (Tier 3)</option>
              <option value="High & Medium">High & Medium Risk (Tier 2 & 3)</option>
              <option value="All Customers">All Customer Accounts (Tier 1, 2, 3)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Exception Resolution SLA</label>
            <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white">
              <option>10 Working Days (Aggressive)</option>
              <option>21 Working Days (Standard)</option>
              <option>30 Working Days (Relaxed)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Simulated Impact Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Regulations</span>
          <div className="text-xl font-bold text-indigo-400 mt-1 font-mono">{results.affectedRegulations}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Obligations</span>
          <div className="text-xl font-bold text-sky-400 mt-1 font-mono">{results.affectedObligations}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Controls Affected</span>
          <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{results.affectedControls}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Business Units</span>
          <div className="text-xl font-bold text-purple-400 mt-1 font-mono">{results.affectedBusinessUnits}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">New Evidence</span>
          <div className="text-xl font-bold text-teal-400 mt-1 font-mono">+{results.additionalEvidenceRequired}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/50 text-center">
          <span className="text-[10px] text-red-300 uppercase font-semibold">Potential Gaps</span>
          <div className="text-xl font-bold text-red-400 mt-1 font-mono">{results.potentialGaps}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Remediation Effort</span>
          <div className="text-xl font-bold text-amber-400 mt-1 font-mono">~{results.estimatedRemediationDays}d</div>
        </div>
      </div>

      {/* Visual Dependency Cascade Graph */}
      <div className="p-6 rounded-2xl bg-navy-900 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-indigo-400" />
            <span>Cascade Dependency Graph: Policy Shift → Downstream Blast Radius</span>
          </h3>
          <span className="text-xs text-indigo-400 font-mono">Live Dependency Traversal</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 py-2 text-xs">
          {/* Level 1: Directive Change */}
          <div className="p-3 bg-slate-850 rounded-xl border border-indigo-500/50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-indigo-400 block font-mono">01. Regulation Shift</span>
            <div className="font-bold text-white text-xs">{activeScenario.nodeChain.regulations[0]}</div>
            <div className="text-[11px] text-slate-400">
              Shift: {selectedFrequency} review cycle
            </div>
          </div>

          {/* Level 2: Obligations */}
          <div className="p-3 bg-slate-850 rounded-xl border border-sky-500/50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-sky-400 block font-mono">
              02. {activeScenario.nodeChain.obligations.length} Obligations
            </span>
            <div className="flex flex-wrap gap-1">
              {activeScenario.nodeChain.obligations.map(o => (
                <span key={o} className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-mono text-[10px]">
                  {o}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-400">Cadence rewritten</div>
          </div>

          {/* Level 3: Controls */}
          <div className="p-3 bg-slate-850 rounded-xl border border-emerald-500/50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block font-mono">
              03. {activeScenario.nodeChain.controls.length} Controls
            </span>
            <div className="flex flex-wrap gap-1">
              {activeScenario.nodeChain.controls.slice(0, 4).map(c => (
                <span key={c} className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px]">
                  {c}
                </span>
              ))}
              <span className="text-[10px] text-slate-400">+{activeScenario.nodeChain.controls.length - 4}</span>
            </div>
            <div className="text-[11px] text-slate-400">Batch rules re-scheduled</div>
          </div>

          {/* Level 4: Business Units */}
          <div className="p-3 bg-slate-850 rounded-xl border border-purple-500/50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-purple-400 block font-mono">
              04. {activeScenario.nodeChain.businessUnits.length} Teams
            </span>
            <div className="space-y-1">
              {activeScenario.nodeChain.businessUnits.map(b => (
                <div key={b} className="text-[11px] text-slate-300 truncate">
                  • {b}
                </div>
              ))}
            </div>
          </div>

          {/* Level 5: Evidence */}
          <div className="p-3 bg-slate-850 rounded-xl border border-teal-500/50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-teal-400 block font-mono">
              05. {activeScenario.nodeChain.evidenceTypes.length} Evidence Types
            </span>
            <div className="space-y-1">
              {activeScenario.nodeChain.evidenceTypes.map((e: string) => (
                <div key={e} className="text-[11px] text-slate-300 truncate">
                  • {e}
                </div>
              ))}
            </div>
          </div>

          {/* Level 6: Gaps */}
          <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/50 space-y-2">
            <span className="text-[10px] uppercase font-bold text-red-400 block font-mono">
              06. {activeScenario.nodeChain.gaps.length} Gaps
            </span>
            <div className="space-y-1 font-mono">
              {activeScenario.nodeChain.gaps.map((g: string) => (
                <button
                  key={g}
                  onClick={() => {
                    setSelectedGapId(g);
                    setActivePage('gaps');
                  }}
                  className="text-[11px] text-red-300 hover:text-red-100 font-bold block"
                >
                  › {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
