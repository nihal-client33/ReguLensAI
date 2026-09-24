import React, { useState } from 'react';
import {
  KanbanSquare,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Check,
  X,
  FileEdit,
  ShieldCheck,
  ChevronRight,
  Eye,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useComplianceStore } from '../services/store/complianceStore';
import { Remediation } from '../types';

export const RemediationPage: React.FC = () => {
  const {
    remediations,
    approveRemediation,
    rejectRemediation,
    role,
    setSelectedGapId,
    setActivePage
  } = useComplianceStore();

  const [inspectRemediation, setInspectRemediation] = useState<Remediation | null>(null);

  const columns: Array<{ id: Remediation['status']; label: string; color: string }> = [
    { id: 'Backlog', label: 'Backlog / Triage', color: 'border-slate-700 bg-slate-900/60' },
    { id: 'In Progress', label: 'In Progress (Active Sprint)', color: 'border-indigo-800/60 bg-indigo-950/20' },
    { id: 'Validation', label: 'Compliance Validation', color: 'border-amber-800/60 bg-amber-950/20' },
    { id: 'Completed', label: 'Completed & Signed Off', color: 'border-emerald-800/60 bg-emerald-950/20' }
  ];

  const handleApprove = (remId: string) => {
    approveRemediation(remId);
    if (inspectRemediation && inspectRemediation.id === remId) {
      setInspectRemediation(prev => prev ? { ...prev, approvalStatus: 'Approved', status: 'In Progress' } : null);
    }
  };

  const handleReject = (remId: string) => {
    rejectRemediation(remId, 'Requires refined milestone scope');
    if (inspectRemediation && inspectRemediation.id === remId) {
      setInspectRemediation(prev => prev ? { ...prev, approvalStatus: 'Rejected' } : null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Remediation Governance Board</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-900/60 text-purple-300 border border-purple-700/50">
              Human-in-the-Loop GRC
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Governed execution, AI action plans, and Chief Compliance Officer verification workflows
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-indigo-400" />
          <span>Active Approver: <strong className="text-white">{role}</strong></span>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(col => {
          const colRemediations = remediations.filter(r => r.status === col.id);

          return (
            <div
              key={col.id}
              className={`p-4 rounded-xl border ${col.color} flex flex-col space-y-3 min-h-[550px] shadow-sm`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-200 tracking-wide">{col.label}</span>
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {colRemediations.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colRemediations.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs text-slate-500 italic">
                    No items in {col.label.toLowerCase()}
                  </div>
                ) : (
                  colRemediations.map(rem => (
                    <div
                      key={rem.id}
                      onClick={() => setInspectRemediation(rem)}
                      className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-750 hover:border-indigo-500/60 cursor-pointer transition-all hover:scale-[1.02] space-y-2.5 shadow-md group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/40">
                          {rem.gapCode}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            rem.approvalStatus === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : rem.approvalStatus === 'Pending Approval'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {rem.approvalStatus}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {rem.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {rem.recommendation}
                      </p>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>Progress</span>
                          <span className="font-mono text-indigo-300">{rem.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-1.5" style={{ width: `${rem.progress}%` }} />
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[120px]">{rem.owner}</span>
                        <span className="font-mono text-slate-400">{rem.suggestedDeadline}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Remediation Detail & Approval Modal */}
      {inspectRemediation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-700">
                    {inspectRemediation.gapCode}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      inspectRemediation.approvalStatus === 'Approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : 'bg-amber-950 text-amber-300 border border-amber-700'
                    }`}
                  >
                    {inspectRemediation.approvalStatus}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Priority: {inspectRemediation.priority}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-2">{inspectRemediation.title}</h3>
              </div>
              <button
                onClick={() => setInspectRemediation(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Recommendation */}
              <div className="p-3.5 bg-indigo-950/30 rounded-xl border border-indigo-800/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-300 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Synthesized Remediation Recommendation</span>
                </span>
                <p className="text-slate-200 leading-relaxed font-mono">
                  {inspectRemediation.recommendation}
                </p>
              </div>

              {/* Action Plan Tasks */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Action Plan & Implementation Tasks ({inspectRemediation.actionItems.length})
                </span>
                <div className="space-y-1.5">
                  {inspectRemediation.actionItems.map(item => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-850 rounded-lg border border-slate-750 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-4 w-4 rounded flex items-center justify-center text-[10px] ${
                            item.completed ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {item.completed ? '✓' : ''}
                        </span>
                        <div>
                          <div className={`font-medium ${item.completed ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                            {item.task}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Assigned to: {item.owner} • Due: {item.deadline}
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">{item.id}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scope Changes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Control Definition Change</span>
                  <p className="text-slate-300 leading-relaxed">{inspectRemediation.controlChange}</p>
                </div>
                <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Internal Policy Amendment</span>
                  <p className="text-slate-300 leading-relaxed">{inspectRemediation.policyChange}</p>
                </div>
              </div>

              {/* Verification Criteria */}
              <div className="p-3 bg-slate-850 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Sign-off & Verification Criteria</span>
                <p className="text-slate-300 leading-relaxed">{inspectRemediation.verificationCriteria}</p>
              </div>
            </div>

            {/* Human-in-the-loop Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                Deadline: <strong className="text-white font-mono">{inspectRemediation.suggestedDeadline}</strong>
              </div>

              <div className="flex items-center gap-2">
                {inspectRemediation.approvalStatus !== 'Approved' ? (
                  <>
                    <button
                      onClick={() => handleReject(inspectRemediation.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-xs font-semibold text-red-200 border border-red-800 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject Plan</span>
                    </button>

                    <button
                      onClick={() => handleApprove(inspectRemediation.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Recommendation ({role})</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/40">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approved by {inspectRemediation.approvedBy || 'CCO'} on {inspectRemediation.approvedAt || '2026-09-20'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
