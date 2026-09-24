import React from 'react';
import {
  Shield,
  ArrowRight,
  Play,
  FileCheck2,
  GitFork,
  AlertTriangle,
  SlidersHorizontal,
  Scale,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';

export const LandingPage: React.FC = () => {
  const { setActivePage, startGuidedDemo } = useComplianceStore();

  const pipelineSteps = [
    { title: 'Regulations', desc: '11 Tracked (RBI, Basel, FATF)', color: 'text-indigo-400', border: 'border-indigo-500/40' },
    { title: 'Obligations', desc: '43 Atomic Clauses Extracted', color: 'text-sky-400', border: 'border-sky-500/40' },
    { title: 'Controls', desc: '32 Bank Internal Controls', color: 'text-emerald-400', border: 'border-emerald-500/40' },
    { title: 'Evidence', desc: '13 Artifacts & Test Logs', color: 'text-teal-400', border: 'border-teal-500/40' },
    { title: 'Testing', desc: 'Design & Operating Efficacy', color: 'text-amber-400', border: 'border-amber-500/40' },
    { title: 'Gaps', desc: '7 GRC Gaps Prioritized', color: 'text-red-400', border: 'border-red-500/40' },
    { title: 'Remediation', desc: 'Human-in-the-Loop Approved', color: 'text-purple-400', border: 'border-purple-500/40' },
  ];

  const features = [
    {
      icon: Sparkles,
      title: 'Autonomous Regulatory Ingestion',
      desc: 'Parses complex gazettes, circulars, and guidelines into structured metadata, effective dates, and affected banking entities.'
    },
    {
      icon: FileCheck2,
      title: 'AI Obligation Extraction',
      desc: 'Converts unstructured legal text into atomic obligations with frequency, owner, applicability rationale, and required evidence.'
    },
    {
      icon: GitFork,
      title: 'Semantic Control Mapping',
      desc: 'Aligns regulatory obligations to internal bank controls with explainable confidence scoring and coverage assessment.'
    },
    {
      icon: Layers,
      title: 'Evidence Sufficiency Audit',
      desc: 'Continuously verifies test results, batch logs, and third-party attestations to flag missing, insufficient, or expired evidence.'
    },
    {
      icon: AlertTriangle,
      title: 'Risk-Based Gap Prioritization',
      desc: 'Evaluates regulatory severity, customer impact, financial penalty, and control weakness to calculate grounded GRC risk scores.'
    },
    {
      icon: SlidersHorizontal,
      title: 'What-If Simulation Engine',
      desc: 'Model the cascade blast radius of hypothetical regulatory shifts (e.g. Annual to Quarterly frequency) across the entire bank.'
    },
    {
      icon: Scale,
      title: 'Cross-Regulation Matrix',
      desc: 'Identifies common obligations, duplicate controls, and reconciles subtle frequency and scope differences across jurisdictions.'
    },
    {
      icon: Lock,
      title: 'Traceability & Human-in-the-Loop',
      desc: 'Maintains an immutable audit chain from source paragraph to final CCO remediation sign-off with 0 blind automation.'
    }
  ];

  return (
    <div className="min-h-full bg-[#0a0f1d] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Gen Enterprise Banking RegTech Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Turn complex regulations into{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
            actionable controls.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
          ReguLens AI is an agentic regulatory intelligence and control assurance platform that connects
          regulations, obligations, internal controls, evidence, testing, gaps, and remediation in one
          traceable, explainable workflow.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <button
            onClick={() => setActivePage('dashboard')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <span>Launch Compliance Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={startGuidedDemo}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white shadow-md transition-all hover:scale-105"
          >
            <Play className="w-4 h-4 text-amber-400 fill-current" />
            <span>Launch Guided Demo (3 Min)</span>
          </button>
        </div>
      </div>

      {/* Visual Animated Compliance Pipeline */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400">
            Unbroken End-to-End Traceability Chain
          </h2>
          <p className="text-sm font-semibold text-slate-300 mt-1">
            Every AI finding is grounded in regulatory source text and internal evidence
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {pipelineSteps.map((step, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl bg-navy-900/90 border ${step.border} flex flex-col justify-between text-center relative group hover:scale-105 transition-all shadow-md`}
            >
              <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold mb-1">
                Stage 0{idx + 1}
              </div>
              <div className={`text-xs font-bold ${step.color} tracking-wide`}>{step.title}</div>
              <div className="text-[11px] text-slate-400 mt-1.5 leading-snug">{step.desc}</div>
              {idx < pipelineSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600 font-bold">
                  ›
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Capabilities Grid */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">Enterprise Compliance Capabilities</h2>
          <p className="text-xs text-slate-400">Engineered for Chief Compliance Officers, Risk Managers, and Internal Auditors</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-indigo-600/50 transition-all space-y-2.5 shadow-sm group hover:bg-slate-850/80"
              >
                <div className="h-9 w-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Personas Bar */}
      <div className="max-w-5xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 text-center space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400">
          Built for Bank Governance & Operations
        </h3>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {[
            'Chief Compliance Officer',
            'Financial Crime Compliance Lead',
            'Risk & ALM Officer',
            'Chief Information Security Officer (CISO)',
            'Internal Audit Director',
            'Control Owner & Operations Lead'
          ].map((persona, pIdx) => (
            <span
              key={pIdx}
              className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium"
            >
              {persona}
            </span>
          ))}
        </div>
        <div className="pt-2">
          <button
            onClick={() => setActivePage('dashboard')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            <span>Enter the ReguLens AI Compliance Workspace</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
