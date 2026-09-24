import React, { useState } from 'react';
import {
  History,
  X,
  Download,
  Filter,
  CheckCircle2,
  Cpu,
  User,
  ShieldAlert
} from 'lucide-react';
import { useComplianceStore } from '../../services/store/complianceStore';

export const AuditTrailModal: React.FC = () => {
  const { isAuditOpen, setIsAuditOpen, auditLogs } = useComplianceStore();
  const [filterQuery, setFilterQuery] = useState('');

  if (!isAuditOpen) return null;

  const filteredLogs = auditLogs.filter(
    l =>
      l.user.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.entity.toLowerCase().includes(filterQuery.toLowerCase()) ||
      l.entityId.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Entity', 'Entity ID', 'Old Value', 'New Value', 'AI Agent', 'Status'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.user}"`,
      `"${l.role}"`,
      `"${l.action}"`,
      `"${l.entity}"`,
      `"${l.entityId}"`,
      `"${l.oldValue}"`,
      `"${l.newValue}"`,
      `"${l.agentInvolved || ''}"`,
      `"${l.status}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ReguLens_Audit_Trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <History className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Immutable Compliance Audit Log</h3>
              <p className="text-[11px] text-slate-400">
                Complete traceability of user approvals, overrides, and autonomous agent decisions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => setIsAuditOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-850/50 flex items-center gap-3">
          <div className="relative flex-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={filterQuery}
              onChange={e => setFilterQuery(e.target.value)}
              placeholder="Filter by user, action, entity code (e.g., GAP-1042)..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400 whitespace-nowrap">
            Showing <span className="font-bold text-white">{filteredLogs.length}</span> recorded events
          </span>
        </div>

        {/* Audit Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/60 sticky top-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">User / Actor</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Entity</th>
                <th className="py-2.5 px-4">Old Value → New Value</th>
                <th className="py-2.5 px-4">Agent Involved</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-200 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-indigo-400" />
                      <span>{log.user}</span>
                    </div>
                    <div className="text-[10px] text-slate-500">{log.role}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{log.action}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-[11px] text-indigo-300">
                      {log.entityId}
                    </span>
                    <div className="text-[10px] text-slate-500 mt-0.5">{log.entity}</div>
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    <span className="text-slate-400">{log.oldValue}</span>
                    <span className="mx-1.5 text-slate-600">→</span>
                    <span className="text-emerald-300 font-semibold">{log.newValue}</span>
                  </td>
                  <td className="py-3 px-4">
                    {log.agentInvolved ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 px-2 py-0.5 rounded-full">
                        <Cpu className="w-3 h-3 text-indigo-400" />
                        <span>{log.agentInvolved}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Direct User Action</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
