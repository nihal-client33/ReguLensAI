import React from 'react';
import {
  Play,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useComplianceStore } from '../../services/store/complianceStore';

export const GuidedDemoModal: React.FC = () => {
  const {
    isGuidedDemoActive,
    guidedDemoStep,
    nextGuidedDemoStep,
    previousGuidedDemoStep,
    stopGuidedDemo,
    approveRemediation,
    remediations,
    setSelectedGapId
  } = useComplianceStore();

  if (!isGuidedDemoActive) return null;

  const steps = [
    {
      step: 1,
      title: 'Step 1: Detect Regulatory Amendment',
      page: 'changes',
      description: 'RBI published Master Direction KYC v4.2 amending Section 12.4. Notice the change timeline entry.',
      actionHint: 'Click "Next" to inspect the exact textual diffs between v4.1 and v4.2.'
    },
    {
      step: 2,
      title: 'Step 2: Compare Before vs After Regulatory Diff',
      page: 'changes',
      description: 'The AI highlighted text: customer review frequency changed from "Annual" to "Quarterly for High-Risk customers".',
      actionHint: 'Click "Run Impact Analysis" on the screen or click "Next" to trigger the multi-agent pipeline.'
    },
    {
      step: 3,
      title: 'Step 3: Autonomous AI Agent Ingestion & Obligations',
      page: 'obligations',
      description: 'Obligation Extraction Agent extracted OBL-001 (Quarterly review) and evaluated applicability for all bank accounts.',
      actionHint: 'Inspect OBL-001 with 96% AI confidence. Click "Next" to check affected controls.'
    },
    {
      step: 4,
      title: 'Step 4: Search Control Framework & Detect Cadence Mismatch',
      page: 'controls',
      description: 'Control Framework Agent mapped OBL-001 to AML-C-023. Notice AML-C-023 currently executes on an "Annual" schedule!',
      actionHint: 'Click "Next" to assess the available evidence.'
    },
    {
      step: 5,
      title: 'Step 5: Evidence Assessment Agent Detects Deficiency',
      page: 'evidence',
      description: 'Evidence EVD-0092 only contains annual batch execution logs. Evidence status is classified as "Insufficient".',
      actionHint: 'Click "Next" to view the resulting High-Risk compliance gap.'
    },
    {
      step: 6,
      title: 'Step 6: Risk-Based Gap Prioritization (GAP-1042)',
      page: 'gaps',
      description: 'Gap Analysis Agent generated GAP-1042 with Risk Score 92/100 (Critical). Inspect regulatory & legal impact factors.',
      actionHint: 'Click "Next" to review the AI-generated remediation plan.'
    },
    {
      step: 7,
      title: 'Step 7: Human-in-the-Loop Remediation Approval',
      page: 'remediation',
      description: 'Remediation Agent produced REM-001: update AML batch scheduler to quarterly execution and amend policy.',
      actionHint: 'Click "Approve Plan" to record CCO approval in the immutable audit log and advance.'
    },
    {
      step: 8,
      title: 'Step 8: What-If Simulation Engine (Annual → Quarterly)',
      page: 'simulation',
      description: 'Explore the visual dependency graph: Regulation → 4 Obligations → 7 Controls → 4 Business Units → 3 Potential Gaps.',
      actionHint: 'Click "Next" to view the end-to-end Traceability Chain.'
    },
    {
      step: 9,
      title: 'Step 9: End-to-End Traceability & Executive Dashboard',
      page: 'compliance-map',
      description: 'The full unbroken chain: Regulation → Obligation → Control → Evidence → Test → Gap → Remediation.',
      actionHint: 'Click "Finish Demo" to return to the Executive Dashboard with updated compliance metrics!'
    }
  ];

  const currentStepData = steps[guidedDemoStep - 1] || steps[0];

  const handleStepAction = () => {
    if (guidedDemoStep === 7) {
      // Auto-approve REM-001 if pending
      approveRemediation('REM-001');
    }
    nextGuidedDemoStep();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-bottom duration-300">
      <div className="bg-navy-900/95 border-2 border-indigo-500 rounded-2xl shadow-2xl p-4 backdrop-blur-xl text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/40 flex-shrink-0">
              {guidedDemoStep}/9
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">
                  Hackathon Demo Guide: Quarterly Customer Risk Review
                </span>
                <span className="px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300 text-[10px] font-mono border border-indigo-700/50">
                  Step {guidedDemoStep} of 9
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">{currentStepData.title}</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>
          </div>

          <button
            onClick={stopGuidedDemo}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Exit Demo Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 my-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${(guidedDemoStep / 9) * 100}%` }}
          />
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="text-[11px] text-slate-400 italic">
            💡 {currentStepData.actionHint}
          </div>

          <div className="flex items-center gap-2">
            {guidedDemoStep > 1 && (
              <button
                onClick={previousGuidedDemoStep}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleStepAction}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              <span>{guidedDemoStep === 9 ? 'Finish Demo' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
