import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  FileText,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { useComplianceStore } from '../../services/store/complianceStore';

export const DocumentUploadModal: React.FC = () => {
  const {
    isUploadOpen,
    setIsUploadOpen,
    uploadRegulationDocument,
    uploadEvidenceDocument,
    controls,
    setActivePage
  } = useComplianceStore();

  const [activeTab, setActiveTab] = useState<'reg' | 'policy' | 'evidence'>('reg');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetControlId, setTargetControlId] = useState<string>(controls[0]?.id || 'AML-C-023');
  const [evidenceType, setEvidenceType] = useState<any>('Audit Report');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isUploadOpen) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile && !uploadSuccess) {
      // Mock synthetic file if user just clicks submit without choosing local file
      const syntheticName =
        activeTab === 'reg'
          ? 'RBI_Notification_Onboarding_Revisions_2026.pdf'
          : activeTab === 'policy'
          ? 'Internal_Bank_AML_KYC_Policy_v5.0.docx'
          : 'Q3_High_Risk_Customer_Batch_Audit_Sample.csv';

      setSelectedFile(new File(['Synthetic Banking Document Payload'], syntheticName));
    }

    setIsProcessing(true);

    try {
      const fileName = selectedFile ? selectedFile.name : 'RBI_Cyber_Resilience_Amendment_2026.pdf';

      if (activeTab === 'reg') {
        await uploadRegulationDocument({ name: fileName, content: 'Mandatory customer verification and threat mitigation rules.' });
      } else {
        await uploadEvidenceDocument({
          name: fileName,
          controlId: targetControlId,
          type: evidenceType
        });
      }

      setUploadSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    setIsUploadOpen(false);
    setUploadSuccess(false);
    setSelectedFile(null);
    if (activeTab === 'reg') {
      setActivePage('regulations');
    } else {
      setActivePage('evidence');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-navy-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <UploadCloud className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-white">Ingest Regulatory Document / Evidence</h3>
              <p className="text-[11px] text-slate-400">PDF, DOCX, TXT, CSV, XLSX supported</p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('reg')}
              className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'reg'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Regulatory Circular / Law</span>
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'evidence'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Evidence Artifact</span>
            </button>
            <button
              onClick={() => setActiveTab('policy')}
              className={`pb-2.5 px-4 font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'policy'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Internal Bank Policy</span>
            </button>
          </div>

          {!uploadSuccess ? (
            <>
              {/* If Evidence tab, select control */}
              {activeTab === 'evidence' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-300">Target Internal Control</label>
                  <select
                    value={targetControlId}
                    onChange={e => setTargetControlId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  >
                    {controls.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.controlCode} - {c.name} ({c.domain})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Drag and Drop Zone */}
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-6 text-center cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-all group"
              >
                <input
                  type="file"
                  id="doc-upload"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt,.csv,.xlsx"
                  className="hidden"
                />
                <label htmlFor="doc-upload" className="cursor-pointer">
                  <div className="h-12 w-12 rounded-full bg-indigo-900/30 border border-indigo-700/50 text-indigo-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {selectedFile ? (
                      <span className="text-indigo-400 font-mono">{selectedFile.name}</span>
                    ) : (
                      'Click to upload or drag and drop document'
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Regulatory Circulars, Audit Reports, Logs, Test Spreadsheets
                  </div>
                </label>
              </div>

              {/* Sample files shortcut for quick hackathon demo */}
              <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/60 text-xs">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                  Demo Quick Select (Pre-staged Banking Artifacts):
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('reg');
                      setSelectedFile(new File(['Sample'], 'RBI_Master_Direction_Amendment_Q4_2026.pdf'));
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-indigo-300 rounded border border-slate-700 text-[11px]"
                  >
                    📄 RBI KYC Amendment 2026.pdf
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('evidence');
                      setTargetControlId('AML-C-023');
                      setSelectedFile(new File(['Sample'], 'Q3_HighRisk_Batch_Run_Execution.csv'));
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-emerald-300 rounded border border-slate-700 text-[11px]"
                  >
                    📊 Q3 High-Risk Batch Run.csv
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('evidence');
                      setTargetControlId('BCP-C-019');
                      setSelectedFile(new File(['Sample'], 'DR_Immutable_Restoration_Test_Q3.pdf'));
                    }}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-amber-300 rounded border border-slate-700 text-[11px]"
                  >
                    📑 DR Restoration Attestation.pdf
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Document Analyzed by AI Agents</h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                {activeTab === 'reg'
                  ? 'Obligations successfully extracted, jurisdiction classified, and controls mapped with confidence scores.'
                  : 'Evidence artifact verified, sufficiency evaluated, and control effectiveness refreshed.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-2">
          {!uploadSuccess ? (
            <>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-md transition-all"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                    <span>AI Agents Ingesting...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Run AI Ingestion Pipeline</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all"
            >
              <span>View Ingested Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
