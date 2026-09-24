import React from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';

export const Banner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-navy-950 via-indigo-950/60 to-navy-950 border-b border-indigo-900/40 px-4 py-1.5 text-xs text-slate-300 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        <span className="font-semibold text-indigo-300 tracking-wide uppercase text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 border border-indigo-700/50">
          Synthetic Demo Data
        </span>
        <span className="text-slate-400 hidden sm:inline">
          Prototype designed for enterprise banking compliance evaluation. Not actual legal or regulatory advice.
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          Traceability Engine: 100% Active
        </span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1 text-indigo-400">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          11 Autonomous Agents Online
        </span>
      </div>
    </div>
  );
};
