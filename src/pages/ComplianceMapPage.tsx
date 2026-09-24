import React, { useState } from 'react';
import {
  GitFork,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  FileCheck2,
  FileSpreadsheet,
  KanbanSquare,
  Sparkles,
  Info,
  ChevronRight,
  X
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';

interface TraceChain {
  id: string;
  name: string;
  domain: string;
  regulation: { id: string; name: string; section: string; regulator: string };
  obligation: { code: string; text: string; frequency: string; confidence: number };
  control: { code: string; name: string; frequency: string; owner: string };
  evidence: { id: string; name: string; status: string; score: number };
  testResult: { result: string; finding: string };
  gap: { code: string; title: string; risk: string; score: number } | null;
  remediation: { code: string; title: string; status: string; deadline: string } | null;
}

export const ComplianceMapPage: React.FC = () => {
  const { setActivePage, setSelectedGapId } = useComplianceStore();

  const sampleChains: TraceChain[] = [
    {
      id: 'CHAIN-01',
      name: 'Customer Risk Categorization Cadence (Hackathon Key Scenario)',
      domain: 'Anti-Money Laundering',
      regulation: {
        id: 'REG-RBI-KYC-2026',
        name: 'RBI Master Direction - KYC',
        section: 'Section 12.4',
        regulator: 'Reserve Bank of India'
      },
      obligation: {
        code: 'OBL-001',
        text: 'Review customer risk categorization at least quarterly for High-Risk customers.',
        frequency: 'Quarterly',
        confidence: 96
      },
      control: {
        code: 'AML-C-023',
        name: 'Customer Risk Categorization Review (Periodic)',
        frequency: 'Annual (Mismatch!)',
        owner: 'AML Operations'
      },
      evidence: {
        id: 'EVD-0092',
        name: 'Annual Customer Risk Batch Run Log (FY25-26)',
        status: 'Insufficient',
        score: 42
      },
      testResult: {
        result: 'Design Exception',
        finding: 'Batch scheduler only executes on March 31 annually; no quarterly high-risk execution module active.'
      },
      gap: {
        code: 'GAP-1042',
        title: 'Customer Risk Review Cadence Mismatch (Annual vs Quarterly)',
        risk: 'Critical',
        score: 92
      },
      remediation: {
        code: 'REM-001',
        title: 'Update AML Batch Scoring Rule Engine to Quarterly Execution',
        status: 'In Progress (Approved)',
        deadline: '15 Oct 2026'
      }
    },
    {
      id: 'CHAIN-02',
      name: 'Cyber Incident 6-Hour Reporting Window Assurance',
      domain: 'Cybersecurity',
      regulation: {
        id: 'REG-RBI-CYBER-2025',
        name: 'RBI Cyber Security Framework',
        section: 'Section 7.2',
        regulator: 'Reserve Bank of India'
      },
      obligation: {
        code: 'OBL-009',
        text: 'Mandatory 6-hour reporting window for Severity 1 and 2 cyber incidents to CSIRT-Fin.',
        frequency: 'Continuous',
        confidence: 98
      },
      control: {
        code: 'CYB-C-104',
        name: 'Cyber Incident Rapid Triage & Regulatory Escalation',
        frequency: 'Continuous',
        owner: 'CISO Incident Response'
      },
      evidence: {
        id: 'EVD-0104',
        name: 'Incident Escalation Drill Timestamps (Q2 2026)',
        status: 'Found',
        score: 98
      },
      testResult: {
        result: 'Test Passed',
        finding: 'Simulated breach reported within 2 hours 31 minutes. Full compliance verified.'
      },
      gap: null,
      remediation: null
    },
    {
      id: 'CHAIN-03',
      name: 'Digital Lending Direct Disbursement Flow',
      domain: 'Credit Operations',
      regulation: {
        id: 'REG-RBI-DLG-2025',
        name: 'RBI Guidelines on Digital Lending',
        section: 'Section 4.1',
        regulator: 'Reserve Bank of India'
      },
      obligation: {
        code: 'OBL-015',
        text: 'Direct account-to-account disbursement without pass-through pool accounts.',
        frequency: 'Continuous',
        confidence: 97
      },
      control: {
        code: 'CRD-C-012',
        name: 'Direct Digital Loan Disbursement Engine',
        frequency: 'Continuous',
        owner: 'Retail Credit Operations'
      },
      evidence: {
        id: 'EVD-0118',
        name: 'Sample Ledger of 500 Direct NEFT/IMPS Disbursements',
        status: 'Found',
        score: 96
      },
      testResult: {
        result: 'Test Passed',
        finding: 'Zero intermediary pool accounts detected across all sample transactions.'
      },
      gap: null,
      remediation: null
    },
    {
      id: 'CHAIN-04',
      name: 'Offline Air-Gapped Disaster Recovery Viability',
      domain: 'Business Continuity',
      regulation: {
        id: 'REG-RBI-CYBER-2025',
        name: 'RBI Cyber Security Framework',
        section: 'Section 11.1',
        regulator: 'Reserve Bank of India'
      },
      obligation: {
        code: 'OBL-011',
        text: 'Air-gapped immutable backups with verified quarterly restoration drill.',
        frequency: 'Quarterly',
        confidence: 95
      },
      control: {
        code: 'BCP-C-019',
        name: 'Air-Gapped Immutable Backup & DR Drill',
        frequency: 'Quarterly',
        owner: 'IT Resilience'
      },
      evidence: {
        id: 'EVD-0112',
        name: 'Core Banking DR Restoration Drill Certificate',
        status: 'Expired',
        score: 35
      },
      testResult: {
        result: 'Test Expired',
        finding: 'Last verified restoration certificate expired on 25 June 2026. No active drill on record.'
      },
      gap: {
        code: 'GAP-1024',
        title: 'Disaster Recovery Restoration Drill Evidence Expired',
        risk: 'Critical',
        score: 88
      },
      remediation: {
        code: 'REM-002',
        title: 'Execute Emergency Core Banking Immutable Backup Restoration Drill',
        status: 'Backlog (Pending)',
        deadline: '05 Oct 2026'
      }
    }
  ];

  const [selectedChainId, setSelectedChainId] = useState<string>('CHAIN-01');
  const [inspectedNode, setInspectedNode] = useState<{ stage: string; data: any } | null>(null);

  const activeChain = sampleChains.find(c => c.id === selectedChainId) || sampleChains[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Traceability & Compliance Map</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
              Unbroken Audit Chain
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual connected node pipeline proving grounded traceability from central bank directive to remediation sign-off
          </p>
        </div>

        {/* Chain Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Select Workflow:</span>
          <select
            value={selectedChainId}
            onChange={e => setSelectedChainId(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
          >
            {sampleChains.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Pipeline Container */}
      <div className="p-6 rounded-2xl bg-navy-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{activeChain.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                {activeChain.domain}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any node to inspect evidence references, scoring factors, and reasoning
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Traceability Verified
          </span>
        </div>

        {/* Connected Node Chain */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative py-4">
          {/* Node 1: Regulation */}
          <div
            onClick={() => setInspectedNode({ stage: 'Regulation', data: activeChain.regulation })}
            className="p-3.5 rounded-xl bg-slate-850/90 border border-indigo-500/50 hover:border-indigo-400 cursor-pointer transition-all hover:scale-105 flex flex-col justify-between shadow-md group"
          >
            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">01. Regulation</div>
            <div className="my-2">
              <div className="font-bold text-xs text-white line-clamp-2 group-hover:text-indigo-300">
                {activeChain.regulation.name}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-1">{activeChain.regulation.section}</div>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">{activeChain.regulation.regulator}</div>
          </div>

          {/* Node 2: Obligation */}
          <div
            onClick={() => setInspectedNode({ stage: 'Obligation', data: activeChain.obligation })}
            className="p-3.5 rounded-xl bg-slate-850/90 border border-sky-500/50 hover:border-sky-400 cursor-pointer transition-all hover:scale-105 flex flex-col justify-between shadow-md group"
          >
            <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">02. Obligation</div>
            <div className="my-2">
              <span className="font-mono text-xs font-bold text-sky-300 bg-sky-950 px-1 rounded">
                {activeChain.obligation.code}
              </span>
              <div className="text-xs text-slate-300 mt-1.5 line-clamp-2">
                {activeChain.obligation.text}
              </div>
            </div>
            <div className="text-[10px] font-mono text-emerald-400">{activeChain.obligation.confidence}% Conf</div>
          </div>

          {/* Node 3: Control */}
          <div
            onClick={() => setInspectedNode({ stage: 'Internal Control', data: activeChain.control })}
            className="p-3.5 rounded-xl bg-slate-850/90 border border-emerald-500/50 hover:border-emerald-400 cursor-pointer transition-all hover:scale-105 flex flex-col justify-between shadow-md group"
          >
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">03. Control</div>
            <div className="my-2">
              <span className="font-mono text-xs font-bold text-emerald-300 bg-emerald-950 px-1 rounded">
                {activeChain.control.code}
              </span>
              <div className="text-xs text-slate-200 font-semibold mt-1.5 line-clamp-2">
                {activeChain.control.name}
              </div>
            </div>
            <div className="text-[10px] font-bold text-amber-300">{activeChain.control.frequency}</div>
          </div>

          {/* Node 4: Evidence */}
          <div
            onClick={() => setInspectedNode({ stage: 'Evidence Artifact', data: activeChain.evidence })}
            className="p-3.5 rounded-xl bg-slate-850/90 border border-teal-500/50 hover:border-teal-400 cursor-pointer transition-all hover:scale-105 flex flex-col justify-between shadow-md group"
          >
            <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">04. Evidence</div>
            <div className="my-2">
              <span className="font-mono text-xs font-bold text-teal-300 bg-teal-950 px-1 rounded">
                {activeChain.evidence.id}
              </span>
              <div className="text-xs text-slate-300 mt-1.5 line-clamp-2">
                {activeChain.evidence.name}
              </div>
            </div>
            <div className={`text-[10px] font-semibold ${activeChain.evidence.status === 'Found' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {activeChain.evidence.status} ({activeChain.evidence.score}%)
            </div>
          </div>

          {/* Node 5: Test Result */}
          <div
            onClick={() => setInspectedNode({ stage: 'Testing Procedure', data: activeChain.testResult })}
            className="p-3.5 rounded-xl bg-slate-850/90 border border-amber-500/50 hover:border-amber-400 cursor-pointer transition-all hover:scale-105 flex flex-col justify-between shadow-md group"
          >
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">05. Testing</div>
            <div className="my-2">
              <div className="font-bold text-xs text-amber-300">
                {activeChain.testResult.result}
              </div>
              <div className="text-[11px] text-slate-300 mt-1.5 line-clamp-2">
                {activeChain.testResult.finding}
              </div>
            </div>
            <div className="text-[10px] text-slate-500">Audit Verified</div>
          </div>

          {/* Node 6: Gap */}
          <div
            onClick={() => activeChain.gap && setInspectedNode({ stage: 'Gap Finding', data: activeChain.gap })}
            className={`p-3.5 rounded-xl bg-slate-850/90 border cursor-pointer transition-all hover:scale-105 flex flex-col justify-between shadow-md group ${
              activeChain.gap ? 'border-red-500/60 hover:border-red-400 bg-red-950/20' : 'border-slate-800 opacity-60'
            }`}
          >
            <div className="text-[10px] font-bold text-red-400 uppercase tracking-wider">06. Gap</div>
            <div className="my-2">
              {activeChain.gap ? (
                <>
                  <span className="font-mono text-xs font-bold text-red-300 bg-red-950 px-1 rounded">
                    {activeChain.gap.code}
                  </span>
                  <div className="text-xs text-red-200 font-semibold mt-1.5 line-clamp-2">
                    {activeChain.gap.title}
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500 italic">No Gap (Compliant)</div>
              )}
            </div>
            <div className="text-[10px] text-red-400 font-mono">
              {activeChain.gap ? `Risk: ${activeChain.gap.score}/100` : 'Pass'}
            </div>
          </div>

          {/* Node 7: Remediation */}
          <div
            onClick={() => activeChain.remediation && setInspectedNode({ stage: 'Remediation Action', data: activeChain.remediation })}
            className={`p-3.5 rounded-xl bg-slate-850/90 border cursor-pointer transition-all hover:scale-105 flex flex-col justify-between shadow-md group ${
              activeChain.remediation ? 'border-purple-500/60 hover:border-purple-400 bg-purple-950/20' : 'border-slate-800 opacity-60'
            }`}
          >
            <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">07. Remediation</div>
            <div className="my-2">
              {activeChain.remediation ? (
                <>
                  <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950 px-1 rounded">
                    {activeChain.remediation.code}
                  </span>
                  <div className="text-xs text-purple-200 mt-1.5 line-clamp-2">
                    {activeChain.remediation.title}
                  </div>
                </>
              ) : (
                <div className="text-xs text-slate-500 italic">N/A (Satisfied)</div>
              )}
            </div>
            <div className="text-[10px] text-purple-300 font-semibold">
              {activeChain.remediation ? activeChain.remediation.status : 'None Needed'}
            </div>
          </div>
        </div>

        {/* Narrative Chain Summary */}
        <div className="p-4 bg-slate-850 rounded-xl border border-slate-750 text-xs text-slate-300 space-y-1.5 font-mono">
          <div className="text-indigo-400 font-bold text-[11px] uppercase tracking-wider">
            Traceability Chain Provenance Proof:
          </div>
          <p className="leading-relaxed">
            {activeChain.regulation.id} ({activeChain.regulation.section}) → {activeChain.obligation.code} → {activeChain.control.code} → {activeChain.evidence.id} → {activeChain.testResult.result} → {activeChain.gap ? activeChain.gap.code : 'No Gap'} → {activeChain.remediation ? activeChain.remediation.code : 'None'}
          </p>
        </div>
      </div>

      {/* Node Inspector Drawer */}
      {inspectedNode && (
        <div className="p-5 rounded-xl bg-navy-900 border border-indigo-500/50 shadow-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Deep Inspection: {inspectedNode.stage}</span>
            </h4>
            <button onClick={() => setInspectedNode(null)} className="text-slate-400 hover:text-white text-xs">
              Close ✕
            </button>
          </div>

          <div className="text-xs text-slate-200 bg-slate-850 p-4 rounded-lg font-mono space-y-2">
            <pre className="whitespace-pre-wrap">{JSON.stringify(inspectedNode.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
