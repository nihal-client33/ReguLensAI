import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  FileSpreadsheet,
  Clock,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useComplianceStore } from '../services/store/complianceStore';

export const DashboardPage: React.FC = () => {
  const {
    regulations,
    controls,
    gaps,
    evidence,
    regulatoryChanges,
    remediations,
    setActivePage,
    setSelectedGapId,
    startGuidedDemo
  } = useComplianceStore();

  const openGaps = gaps.filter(g => g.status === 'Open' || g.status === 'Under Remediation');
  const criticalGaps = gaps.filter(g => g.riskLevel === 'Critical');
  const effectiveControls = controls.filter(c => c.effectiveness === 'Effective').length;
  const partiallyEffective = controls.filter(c => c.effectiveness === 'Partially Effective').length;
  const notTested = controls.filter(c => c.effectiveness === 'Not Tested' || c.effectiveness === 'Ineffective').length;

  // Chart data: Coverage by Domain
  const domainData = [
    { domain: 'AML & KYC', coverage: 89, target: 95 },
    { domain: 'Cybersecurity', coverage: 94, target: 95 },
    { domain: 'Digital Lending', coverage: 92, target: 95 },
    { domain: 'Treasury & LCR', coverage: 98, target: 95 },
    { domain: 'Data Privacy', coverage: 78, target: 90 },
    { domain: 'Vendor Risk', coverage: 84, target: 90 }
  ];

  // Chart data: Risk Distribution
  const riskData = [
    { name: 'Critical Risk', value: gaps.filter(g => g.riskLevel === 'Critical').length, color: '#ef4444' },
    { name: 'High Risk', value: gaps.filter(g => g.riskLevel === 'High').length, color: '#f97316' },
    { name: 'Medium Risk', value: gaps.filter(g => g.riskLevel === 'Medium').length, color: '#eab308' },
    { name: 'Low Risk', value: gaps.filter(g => g.riskLevel === 'Low').length, color: '#3b82f6' }
  ];

  // Chart data: Control Effectiveness
  const effectivenessData = [
    { name: 'Effective', count: effectiveControls, fill: '#10b981' },
    { name: 'Partially Effective', count: partiallyEffective, fill: '#f59e0b' },
    { name: 'Not Tested / Ineffective', count: notTested, fill: '#ef4444' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Quick Demo CTA */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-950/50 border border-indigo-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous Compliance Intelligence Active
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                11 Agents Monitoring
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              RBI Master Direction KYC amendment detected. GAP-1042 cadence discrepancy prioritized.
            </p>
          </div>
        </div>

        <button
          onClick={startGuidedDemo}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-105 whitespace-nowrap"
        >
          <Play className="w-3.5 h-3.5 fill-current text-amber-400" />
          <span>Run Demo Scenario (KYC Change)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-[11px] font-semibold text-slate-400 truncate">Regulatory Coverage</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">87%</div>
          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>+2.4% this mo</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
          <div className="text-[11px] font-semibold text-slate-400 truncate">Control Coverage</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">82%</div>
          <div className="text-[10px] text-slate-500 mt-1">32 controls active</div>
        </div>

        <div 
          onClick={() => setActivePage('gaps')}
          className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-red-500/40 cursor-pointer transition-colors"
        >
          <div className="text-[11px] font-semibold text-slate-400 truncate">Open Gaps</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{openGaps.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">GRC risk scored</div>
        </div>

        <div 
          onClick={() => {
            setSelectedGapId('GAP-1042');
            setActivePage('gaps');
          }}
          className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 hover:border-red-600/60 cursor-pointer transition-colors"
        >
          <div className="text-[11px] font-semibold text-red-300 truncate">Critical Gaps</div>
          <div className="text-xl font-bold text-red-400 mt-1">{criticalGaps.length}</div>
          <div className="text-[10px] text-red-400/80 mt-1">Immediate action</div>
        </div>

        <div 
          onClick={() => setActivePage('regulations')}
          className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="text-[11px] font-semibold text-slate-400 truncate">Regulations</div>
          <div className="text-xl font-bold text-white mt-1">{regulations.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">RBI, FATF, BCBS</div>
        </div>

        <div 
          onClick={() => setActivePage('controls')}
          className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="text-[11px] font-semibold text-slate-400 truncate">Controls Assessed</div>
          <div className="text-xl font-bold text-white mt-1">{controls.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">24 effective</div>
        </div>

        <div 
          onClick={() => setActivePage('evidence')}
          className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
        >
          <div className="text-[11px] font-semibold text-slate-400 truncate">Evidence Items</div>
          <div className="text-xl font-bold text-white mt-1">{evidence.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">1 expired, 2 missing</div>
        </div>

        <div 
          onClick={() => setActivePage('changes')}
          className="p-3.5 rounded-xl bg-navy-900/80 border border-slate-800 hover:border-indigo-600/40 cursor-pointer transition-colors"
        >
          <div className="text-[11px] font-semibold text-slate-400 truncate">Upcoming Changes</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">{regulatoryChanges.length}</div>
          <div className="text-[10px] text-slate-500 mt-1">Timeline queued</div>
        </div>
      </div>

      {/* Critical Alert Action Box */}
      <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/60 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-red-200">
              High Priority Finding: GAP-1042 Customer Risk Categorization Cadence Mismatch
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              RBI Master Direction KYC Section 12.4 update mandates quarterly reviews for High-Risk accounts. Bank control AML-C-023 currently executes annually. Remediation plan REM-001 is awaiting final verification.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedGapId('GAP-1042');
            setActivePage('gaps');
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/80 text-xs font-semibold text-red-100 border border-red-700 flex-shrink-0 transition-colors"
        >
          <span>Inspect GAP-1042</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coverage by Domain */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-navy-900/80 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Compliance Coverage by Banking Domain
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Assessed against RBI and Global Standards</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              Bank Average: 87%
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="domain" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} domain={[50, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="coverage" fill="#6366f1" radius={[4, 4, 0, 0]} name="Actual Coverage %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="p-5 rounded-xl bg-navy-900/80 border border-slate-800 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Gap Risk Priority Distribution
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Calculated by Risk Prioritization Agent</p>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
            {riskData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong className="text-white font-mono">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Effectiveness & Traceability Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Control Effectiveness Status */}
        <div className="p-5 rounded-xl bg-navy-900/80 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Internal Control Effectiveness (32 Assessed)
            </h3>
            <button
              onClick={() => setActivePage('controls')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View Inventory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Effective Controls (24)</span>
                <span className="text-emerald-400 font-mono font-semibold">75.0%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Partially Effective (6) - Frequency / Sample Gaps</span>
                <span className="text-amber-400 font-mono font-semibold">18.7%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '18.7%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Not Tested / Draft (2)</span>
                <span className="text-red-400 font-mono font-semibold">6.3%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '6.3%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Traceability Workflow Nav */}
        <div className="p-5 rounded-xl bg-navy-900/80 border border-slate-800 space-y-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Core Traceability Shortcuts
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Explore each stage of the compliance workflow</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setActivePage('compliance-map')}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-600/50 text-left transition-colors"
            >
              <div className="font-semibold text-white">Traceability Map</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Visual connected node graph</div>
            </button>

            <button
              onClick={() => setActivePage('remediation')}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-600/50 text-left transition-colors"
            >
              <div className="font-semibold text-white">Remediation Kanban</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Human-in-the-loop approvals</div>
            </button>

            <button
              onClick={() => setActivePage('simulation')}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-600/50 text-left transition-colors"
            >
              <div className="font-semibold text-white">What-If Simulation</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Frequency shift blast radius</div>
            </button>

            <button
              onClick={() => setActivePage('cross-regulation')}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-600/50 text-left transition-colors"
            >
              <div className="font-semibold text-white">Cross-Reg Matrix</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Contradiction detection</div>
            </button>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Last automated synchronization:</span>
            <span className="font-mono text-indigo-300">Just now (Autonomous Engine)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
