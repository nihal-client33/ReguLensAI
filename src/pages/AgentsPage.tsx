import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  RotateCw,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';

interface AgentCardData {
  id: number;
  name: string;
  role: string;
  status: 'Online' | 'Busy' | 'Idle';
  confidence: number;
  lastExecution: string;
  activeTask: string;
  capabilities: string[];
}

export const AgentsPage: React.FC = () => {
  const { agentRuns, regulatoryChanges, runImpactAnalysisForChange } = useComplianceStore();
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeTab, setActiveTab] = useState<'agents' | 'logs'>('agents');

  const agentsList: AgentCardData[] = [
    {
      id: 1,
      name: 'Regulatory Intelligence Agent',
      role: 'Reads legal text, identifies regulator, jurisdiction, effective date, tracks versions & textual diffs.',
      status: 'Online',
      confidence: 99,
      lastExecution: '4 mins ago',
      activeTask: 'Monitoring RBI, FATF, BCBS, and DPDP official gazettes for circular revisions.',
      capabilities: ['Document Ingestion', 'Gazette Scraping', 'Jurisdiction Tagging', 'Diff Classification']
    },
    {
      id: 2,
      name: 'Obligation Extraction Agent',
      role: 'Parses unstructured circulars into atomic, verifiable compliance obligations with frequency & risk.',
      status: 'Online',
      confidence: 96,
      lastExecution: '12 mins ago',
      activeTask: 'Extracted 43 structured obligations across 11 banking regulations.',
      capabilities: ['Semantic Clause Chunking', 'Frequency Deduction', 'Mandatory vs Conditional Tagging']
    },
    {
      id: 3,
      name: 'Applicability Agent',
      role: 'Determines whether an obligation applies to the bank, business units, products, or legal entities.',
      status: 'Online',
      confidence: 94,
      lastExecution: '15 mins ago',
      activeTask: 'Evaluated retail and corporate portfolios against RBI KYC Section 12.4 applicability.',
      capabilities: ['Scope & Entity Matching', 'Exemption Logic', 'Product Filter Matrix']
    },
    {
      id: 4,
      name: 'Control Framework Agent',
      role: 'Analyzes internal bank policies, SOPs, control owners, and procedures to maintain the control inventory.',
      status: 'Online',
      confidence: 95,
      lastExecution: '18 mins ago',
      activeTask: 'Maintains 32 active bank controls across AML, Cyber, Credit, and Governance domains.',
      capabilities: ['Internal SOP Ingestion', 'Ownership Extraction', 'Testing Schedule Maintenance']
    },
    {
      id: 5,
      name: 'Regulatory-Control Mapping Agent',
      role: 'Binds external obligations to internal controls using confidence scoring and semantic coverage analysis.',
      status: 'Online',
      confidence: 94,
      lastExecution: '20 mins ago',
      activeTask: 'Mapped OBL-001 to AML-C-023. Identified critical frequency disparity (Quarterly vs Annual).',
      capabilities: ['Semantic Cosine Matching', 'Coverage Scoring', 'Control Reuse Analysis']
    },
    {
      id: 6,
      name: 'Evidence Assessment Agent',
      role: 'Audits evidence records (reports, CSV samples, system logs) for sufficiency, expiry, and validity.',
      status: 'Online',
      confidence: 95,
      lastExecution: '25 mins ago',
      activeTask: 'Flagged EVD-0112 (expired DR certificate) and EVD-0092 (annual batch log insufficient for quarterly).',
      capabilities: ['Expiry Monitoring', 'Completeness Verification', 'Sufficiency Scoring']
    },
    {
      id: 7,
      name: 'Control Effectiveness Agent',
      role: 'Evaluates design and operating effectiveness using historical test results and audit findings.',
      status: 'Online',
      confidence: 92,
      lastExecution: '30 mins ago',
      activeTask: 'Assessed 32 controls: 24 Effective, 6 Partially Effective, 2 Draft/Not Tested.',
      capabilities: ['Design Effectiveness Check', 'Operating Drift Detection', 'Test Log Reconciliation']
    },
    {
      id: 8,
      name: 'Gap Analysis Agent',
      role: 'Identifies discrepancies between regulatory requirements and bank controls; assigns unique GAP-IDs.',
      status: 'Online',
      confidence: 97,
      lastExecution: '35 mins ago',
      activeTask: 'Maintains 7 active gaps including GAP-1042 (Customer Risk Review Cadence).',
      capabilities: ['Missing Control Discovery', 'Weak Control Detection', 'Cadence Mismatch Triage']
    },
    {
      id: 9,
      name: 'Risk Prioritization Agent',
      role: 'Calculates multi-dimensional risk priority: regulatory severity, customer impact, financial penalty.',
      status: 'Online',
      confidence: 98,
      lastExecution: '38 mins ago',
      activeTask: 'Scored GAP-1042 at 92/100 (Critical) and GAP-1024 at 88/100 (Critical).',
      capabilities: ['Multi-Factor Scoring', 'Penalties Estimation', 'Enforcement Urgency Weighting']
    },
    {
      id: 10,
      name: 'Remediation Agent',
      role: 'Generates step-by-step remediation plans with control adjustments, policy updates, and suggested deadlines.',
      status: 'Online',
      confidence: 96,
      lastExecution: '42 mins ago',
      activeTask: 'Synthesized REM-001 (batch scheduler reconfiguration) for GAP-1042.',
      capabilities: ['Action Plan Synthesis', 'Root Cause Diagnosis', 'Milestone & Dependency Mapping']
    },
    {
      id: 11,
      name: 'Regulatory Impact Agent',
      role: 'Simulates the cascade effect of new regulations on obligations, controls, policies, and existing gaps.',
      status: 'Online',
      confidence: 98,
      lastExecution: '45 mins ago',
      activeTask: 'Simulated RBI KYC amendment cascade across 3 obligations, 7 controls, and 4 gaps.',
      capabilities: ['Cascade Graph Traversal', 'Blast Radius Calculation', 'Policy Touchpoint Discovery']
    }
  ];

  const handleRunAll = async () => {
    setIsRunningAll(true);
    if (regulatoryChanges.length > 0) {
      await runImpactAnalysisForChange(regulatoryChanges[0].id);
    }
    setTimeout(() => {
      setIsRunningAll(false);
    }, 1500);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">AI Agents Activity Center</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              11 Autonomous Agents
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Specialized multi-agent cognitive architecture for continuous banking compliance assurance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('agents')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'agents' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Agent Swarm (11)
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Execution Stream ({agentRuns.length})
            </button>
          </div>

          <button
            onClick={handleRunAll}
            disabled={isRunningAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md shadow-indigo-600/30 transition-all"
          >
            {isRunningAll ? (
              <>
                <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                <span>Orchestrating Swarm...</span>
              </>
            ) : (
              <>
                <RotateCw className="w-3.5 h-3.5" />
                <span>Trigger Full Agent Cycle</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Architecture Traceability Flow Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-indigo-900/50 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-semibold text-slate-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Swarm Traceability Pipeline:</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono overflow-x-auto py-1">
          <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-indigo-300">Agent 1: Ingestion</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-indigo-300">Agent 2: Obligations</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-indigo-300">Agent 5: Mapping</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-indigo-300">Agent 6: Evidence</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-indigo-300">Agent 8: Gaps</span>
          <span>→</span>
          <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-indigo-300">Agent 10: Remediation</span>
        </div>
      </div>

      {activeTab === 'agents' ? (
        /* Agent Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agentsList.map(agent => (
            <div
              key={agent.id}
              className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-indigo-600/50 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-mono text-xs font-bold">
                      A{agent.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors">
                        {agent.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{agent.status}</span>
                        <span>•</span>
                        <span className="font-mono text-emerald-400 font-semibold">{agent.confidence}% Confidence</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {agent.lastExecution}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed">
                  {agent.role}
                </p>

                {/* Active task description */}
                <div className="mt-3 p-2 bg-slate-800/50 rounded-lg border border-slate-700/60 text-[11px] text-indigo-200/90 font-mono">
                  <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider mb-0.5">
                    Active Telemetry:
                  </span>
                  {agent.activeTask}
                </div>
              </div>

              {/* Capabilities chips */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((cap, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-1.5 py-0.5 bg-slate-800 text-[10px] text-slate-400 rounded border border-slate-700/60"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Agent Execution Stream */
        <div className="rounded-xl bg-navy-900 border border-slate-800 overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 bg-slate-850/60 flex items-center justify-between">
            <h3 className="font-semibold text-xs text-white uppercase tracking-wider">
              Live Agent Execution Stream & Reasoning
            </h3>
            <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Event Stream Connected
            </span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {agentRuns.map(run => (
              <div key={run.id} className="p-4 hover:bg-slate-800/30 transition-colors flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-900/40 border border-indigo-700/40 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{run.agentName}</span>
                      <span className="px-2 py-0.5 text-[10px] rounded font-medium bg-slate-800 text-indigo-300 border border-slate-700">
                        {run.step}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{run.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-mono">{run.details}</p>

                  {run.confidence && (
                    <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Decision confidence: {run.confidence}%</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-slate-400">Grounded against regulatory circular metadata</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
