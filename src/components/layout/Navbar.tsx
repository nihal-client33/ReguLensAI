import React from 'react';
import {
  Shield,
  Search,
  UploadCloud,
  Bell,
  History,
  Bot,
  Play,
  RotateCcw,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { useComplianceStore } from '../../services/store/complianceStore';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const {
    role,
    setRole,
    notifications,
    setIsSearchOpen,
    setIsUploadOpen,
    setIsAuditOpen,
    setIsCopilotOpen,
    startGuidedDemo,
    isGuidedDemoActive,
    resetDemoData,
    setActivePage
  } = useComplianceStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const roles: UserRole[] = [
    'Chief Compliance Officer',
    'Compliance Officer',
    'Risk Manager',
    'Internal Auditor',
    'Control Owner'
  ];

  return (
    <header className="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 py-2.5">
      <div className="flex items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActivePage('landing')} 
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-sans group-hover:text-indigo-300 transition-colors">
                  ReguLens<span className="text-indigo-400">.AI</span>
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Enterprise GRC
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight hidden sm:block">
                Turn regulations into actionable controls.
              </p>
            </div>
          </button>
        </div>

        {/* Center / Guided Demo CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={startGuidedDemo}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all ${
              isGuidedDemoActive
                ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400 animate-pulse'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/25 hover:shadow-indigo-600/40'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isGuidedDemoActive ? 'Guided Demo in Progress...' : 'Launch Hackathon Demo'}</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors"
            title="Global Search (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search entity...</span>
            <kbd className="hidden md:inline text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Role Switcher */}
          <div className="relative group hidden lg:block">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-slate-800/60 border border-slate-700/80 text-slate-300 cursor-pointer">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium max-w-[130px] truncate">{role}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <div className="absolute right-0 mt-1 w-52 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                Switch Active Persona
              </div>
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${
                    role === r ? 'bg-indigo-600/20 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{r}</span>
                  {role === r && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Audit Trail Button */}
          <button
            onClick={() => setIsAuditOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors"
            title="Audit Trail"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setActivePage('gaps')}
            className="relative p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors"
            title="Alerts & Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* AI Copilot Side Drawer Trigger */}
          <button
            onClick={() => setIsCopilotOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800/80 hover:to-purple-800/80 border border-indigo-700/50 text-indigo-200 shadow-sm transition-all"
            title="Open AI Compliance Copilot"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={resetDemoData}
            className="p-1.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
            title="Reset Synthetic Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
