import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  BookOpen,
  FileCheck2,
  ShieldCheck,
  FileSpreadsheet,
  AlertTriangle,
  KanbanSquare,
  ArrowRight
} from 'lucide-react';
import { useComplianceStore } from '../../services/store/complianceStore';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    regulations,
    obligations,
    controls,
    evidence,
    gaps,
    remediations,
    setActivePage,
    setSelectedGapId,
    setSelectedRegulationId
  } = useComplianceStore();

  const [query, setQuery] = useState('');

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredRegs = q
    ? regulations.filter(r => r.name.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q) || r.regulator.toLowerCase().includes(q))
    : [];

  const filteredObls = q
    ? obligations.filter(o => o.requirement.toLowerCase().includes(q) || o.obligationCode.toLowerCase().includes(q) || o.section.toLowerCase().includes(q))
    : [];

  const filteredCtrls = q
    ? controls.filter(c => c.name.toLowerCase().includes(q) || c.controlCode.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q))
    : [];

  const filteredEvidence = q
    ? evidence.filter(e => e.name.toLowerCase().includes(q) || (e.controlCode && e.controlCode.toLowerCase().includes(q)))
    : [];

  const filteredGaps = q
    ? gaps.filter(g => g.title.toLowerCase().includes(q) || g.gapCode.toLowerCase().includes(q) || g.description.toLowerCase().includes(q))
    : [];

  const filteredRems = q
    ? remediations.filter(r => r.title.toLowerCase().includes(q) || r.gapCode.toLowerCase().includes(q) || r.recommendation.toLowerCase().includes(q))
    : [];

  const totalHits =
    filteredRegs.length +
    filteredObls.length +
    filteredCtrls.length +
    filteredEvidence.length +
    filteredGaps.length +
    filteredRems.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search regulations, obligations, controls, evidence, gaps... (Try 'customer risk')"
            autoFocus
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!q ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <p className="font-medium text-slate-400">Quick Searches to Try:</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['customer risk', 'cyber', 'lending', 'disaster recovery', 'GAP-1042', 'AML-C-023'].map(term => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-950/80 border border-slate-700 text-slate-300 hover:text-indigo-300 text-xs transition-colors"
                  >
                    "{term}"
                  </button>
                ))}
              </div>
            </div>
          ) : totalHits === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <div>
              {/* Connected Summary Badge Bar */}
              <div className="mb-4 p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/60 flex flex-wrap items-center justify-between text-xs text-slate-300">
                <span className="font-semibold text-white">Connected Findings ({totalHits}):</span>
                <div className="flex items-center gap-3 text-[11px]">
                  {filteredRegs.length > 0 && <span className="text-indigo-300">{filteredRegs.length} Regs</span>}
                  {filteredObls.length > 0 && <span className="text-sky-300">{filteredObls.length} Obligations</span>}
                  {filteredCtrls.length > 0 && <span className="text-emerald-300">{filteredCtrls.length} Controls</span>}
                  {filteredGaps.length > 0 && <span className="text-red-400 font-semibold">{filteredGaps.length} Gaps</span>}
                  {filteredEvidence.length > 0 && <span className="text-amber-300">{filteredEvidence.length} Evidence</span>}
                </div>
              </div>

              {/* Regulations Hits */}
              {filteredRegs.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Regulations ({filteredRegs.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredRegs.slice(0, 3).map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedRegulationId(r.id);
                          setActivePage('regulations');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-indigo-300">{r.name}</div>
                          <div className="text-[11px] text-slate-400">{r.regulator} • {r.jurisdiction}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gaps Hits */}
              {filteredGaps.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-red-400 mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>Identified Gaps ({filteredGaps.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredGaps.slice(0, 3).map(g => (
                      <div
                        key={g.id}
                        onClick={() => {
                          setSelectedGapId(g.gapCode);
                          setActivePage('gaps');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-red-200 group-hover:text-red-100 flex items-center gap-2">
                            <span className="font-mono bg-red-900/60 px-1 rounded text-[10px]">{g.gapCode}</span>
                            <span>{g.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">Risk Score: {g.riskScore}/100 • Owner: {g.owner}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-red-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Obligations Hits */}
              {filteredObls.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 mb-1.5 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Obligations ({filteredObls.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredObls.slice(0, 3).map(o => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setActivePage('obligations');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300">
                            {o.obligationCode}: {o.section}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{o.requirement}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Controls Hits */}
              {filteredCtrls.length > 0 && (
                <div className="mb-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Controls ({filteredCtrls.length})</span>
                  </div>
                  <div className="space-y-1">
                    {filteredCtrls.slice(0, 3).map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setActivePage('controls');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition-colors"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">
                            {c.controlCode} - {c.name}
                          </div>
                          <div className="text-[11px] text-slate-400">{c.domain} • Frequency: {c.frequency}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
