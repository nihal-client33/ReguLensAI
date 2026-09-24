import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  FileSpreadsheet,
  GitFork,
  AlertTriangle,
  KanbanSquare,
  Clock,
  SlidersHorizontal,
  Scale,
  Cpu,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useComplianceStore, ActivePage } from '../../services/store/complianceStore';

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'default' | 'critical' | 'warning' | 'indigo';
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    regulations,
    obligations,
    controls,
    evidence,
    gaps,
    regulatoryChanges,
    remediations
  } = useComplianceStore();

  const criticalGapsCount = gaps.filter(g => g.riskLevel === 'Critical' && g.status === 'Open').length;
  const pendingRemediationsCount = remediations.filter(r => r.approvalStatus === 'Pending Approval').length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'regulations',
      label: 'Regulations Intelligence',
      icon: BookOpen,
      badge: regulations.length,
      badgeVariant: 'default'
    },
    {
      id: 'obligations',
      label: 'Extracted Obligations',
      icon: FileCheck2,
      badge: obligations.length,
      badgeVariant: 'default'
    },
    {
      id: 'controls',
      label: 'Internal Control Framework',
      icon: ShieldCheck,
      badge: controls.length,
      badgeVariant: 'default'
    },
    {
      id: 'evidence',
      label: 'Evidence Repository',
      icon: FileSpreadsheet,
      badge: evidence.length,
      badgeVariant: 'default'
    },
    {
      id: 'compliance-map',
      label: 'Traceability & Compliance Map',
      icon: GitFork,
      badge: 'Core',
      badgeVariant: 'indigo'
    },
    {
      id: 'gaps',
      label: 'Gap Assessment & Risk',
      icon: AlertTriangle,
      badge: criticalGapsCount > 0 ? `${criticalGapsCount} Crit` : gaps.length,
      badgeVariant: criticalGapsCount > 0 ? 'critical' : 'warning'
    },
    {
      id: 'remediation',
      label: 'Remediation Board (GRC)',
      icon: KanbanSquare,
      badge: pendingRemediationsCount > 0 ? `${pendingRemediationsCount} Review` : undefined,
      badgeVariant: 'warning'
    },
    {
      id: 'changes',
      label: 'Regulatory Change Intelligence',
      icon: Clock,
      badge: regulatoryChanges.length,
      badgeVariant: 'indigo'
    },
    {
      id: 'simulation',
      label: 'What-If Simulation Engine',
      icon: SlidersHorizontal
    },
    {
      id: 'cross-regulation',
      label: 'Cross-Regulation Matrix',
      icon: Scale
    },
    {
      id: 'agents',
      label: 'AI Agents Activity Center',
      icon: Cpu,
      badge: '11 Active',
      badgeVariant: 'indigo'
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-navy-950/70 border-r border-slate-800/80 flex flex-col justify-between select-none overflow-y-auto max-h-[calc(100vh-4.5rem)]">
      <div className="py-3 px-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Traceability Workflow
        </div>

        <nav className="space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-full ${
                      item.badgeVariant === 'critical'
                        ? 'bg-red-500 text-white'
                        : item.badgeVariant === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badgeVariant === 'indigo'
                        ? 'bg-indigo-900/60 text-indigo-300 border border-indigo-700/50'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Traceability Flow Indicator in sidebar bottom */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 m-2 rounded-lg text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>GRC Chain Status</span>
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center justify-between text-slate-400">
            <span>Regs → Obligations</span>
            <span className="text-emerald-400 font-mono">100% (43/43)</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Obligations → Controls</span>
            <span className="text-emerald-400 font-mono">92%</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Controls → Evidence</span>
            <span className="text-amber-400 font-mono">82%</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
