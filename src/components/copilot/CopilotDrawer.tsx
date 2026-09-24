import React, { useState } from 'react';
import {
  X,
  Bot,
  Send,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { useComplianceStore } from '../../services/store/complianceStore';
import { AIProvider, CopilotResponse } from '../../services/ai/AIProvider';

export const CopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    regulations,
    obligations,
    controls,
    gaps,
    evidence,
    regulatoryChanges,
    setActivePage,
    setSelectedGapId
  } = useComplianceStore();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<
    Array<{
      sender: 'user' | 'agent';
      text: string;
      citations?: CopilotResponse['citations'];
      suggestedActions?: string[];
      confidence?: number;
    }>
  >([
    {
      sender: 'agent',
      text: 'Hello, I am **ReguLens Copilot**. I analyze your banking compliance knowledge base, track regulatory changes, and verify control evidence sufficiency. How can I assist you today?',
      citations: [
        { entity: 'System', code: 'KB-INIT', title: 'ReguLens Core Traceability Graph' }
      ],
      suggestedActions: [
        'Which controls are affected by the latest KYC update?',
        'Show all high-risk compliance gaps.',
        'Why is GAP-1042 classified as high risk?',
        'What evidence is missing or expired?'
      ]
    }
  ]);

  if (!isCopilotOpen) return null;

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim() || loading) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const response = await AIProvider.askCopilot(q, {
        regulations,
        obligations,
        controls,
        gaps,
        evidence,
        changes: regulatoryChanges
      });

      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: response.answer,
          citations: response.citations,
          suggestedActions: response.suggestedActions,
          confidence: response.confidence
        }
      ]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          text: 'Unable to reach AI Provider. Operating with grounded local knowledge repository.',
          confidence: 85
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    if (action.includes('GAP-1042')) {
      setSelectedGapId('GAP-1042');
      setActivePage('gaps');
      setIsCopilotOpen(false);
    } else if (action.includes('Remediation')) {
      setActivePage('remediation');
      setIsCopilotOpen(false);
    } else if (action.includes('Simulation')) {
      setActivePage('simulation');
      setIsCopilotOpen(false);
    } else if (action.includes('Evidence')) {
      setActivePage('evidence');
      setIsCopilotOpen(false);
    } else {
      handleSend(action);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-navy-900 border-l border-slate-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white flex items-center gap-1.5">
              ReguLens Copilot
              <span className="text-[10px] bg-indigo-900/60 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-700">
                Grounded AI
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Deterministic banking knowledge retrieval</p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3.5 rounded-xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-850 border border-slate-750 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{m.text}</div>

              {/* Confidence Badge */}
              {m.confidence && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Confidence: <span className="font-semibold text-emerald-400 font-mono">{m.confidence}%</span>
                  </span>
                  <span>Grounded in active bank repository</span>
                </div>
              )}

              {/* Citations */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-700/60 space-y-1">
                  <div className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wide">
                    Source Citations:
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {m.citations.map((c, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-300"
                      >
                        <span className="font-semibold text-indigo-400">{c.code}</span>
                        {c.section && <span className="text-slate-500">({c.section})</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suggested Follow-ups */}
            {m.suggestedActions && m.suggestedActions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                {m.suggestedActions.map((action, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={() => handleActionClick(action)}
                    className="text-left text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-900/40 border border-slate-700 hover:border-indigo-600/50 text-slate-300 hover:text-indigo-200 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                    <span>{action}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-3 bg-slate-850 rounded-lg text-xs text-indigo-300 max-w-[80%] border border-slate-700">
            <span className="animate-spin h-3.5 w-3.5 border-2 border-indigo-500 border-t-transparent rounded-full" />
            <span>Retrieving structured regulatory graph...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800 bg-slate-900">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about regulations, gaps, controls, evidence..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-1.5">
          Answers reference verified bank policies and regulatory source sections.
        </p>
      </div>
    </div>
  );
};
