import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Regulation,
  Obligation,
  Control,
  Mapping,
  Evidence,
  ControlTest,
  Gap,
  Remediation,
  RegulatoryChange,
  WhatIfSimulation,
  CrossRegMatrixItem,
  ContradictionFinding,
  AgentRun,
  AuditLog,
  NotificationItem
} from '../../types';
import {
  INITIAL_REGULATIONS,
  INITIAL_OBLIGATIONS,
  INITIAL_CONTROLS,
  INITIAL_MAPPINGS,
  INITIAL_EVIDENCE,
  INITIAL_GAPS,
  INITIAL_REMEDIATIONS,
  INITIAL_REGULATORY_CHANGES,
  INITIAL_SIMULATIONS,
  INITIAL_CROSS_REG_MATRIX,
  INITIAL_CONTRADICTIONS
} from '../data/syntheticBankingData';
import { AIProvider } from '../ai/AIProvider';

export type ActivePage = 
  | 'landing'
  | 'dashboard'
  | 'regulations'
  | 'obligations'
  | 'controls'
  | 'evidence'
  | 'compliance-map'
  | 'gaps'
  | 'remediation'
  | 'changes'
  | 'simulation'
  | 'cross-regulation'
  | 'agents';

interface ComplianceContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  regulations: Regulation[];
  obligations: Obligation[];
  controls: Control[];
  mappings: Mapping[];
  evidence: Evidence[];
  gaps: Gap[];
  remediations: Remediation[];
  regulatoryChanges: RegulatoryChange[];
  simulations: WhatIfSimulation[];
  crossRegMatrix: CrossRegMatrixItem[];
  contradictions: ContradictionFinding[];
  agentRuns: AgentRun[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];

  // Selected item inspectors
  selectedRegulationId: string | null;
  setSelectedRegulationId: (id: string | null) => void;
  selectedGapId: string | null;
  setSelectedGapId: (id: string | null) => void;
  selectedControlId: string | null;
  setSelectedControlId: (id: string | null) => void;

  // Dialog & Drawer toggles
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isUploadOpen: boolean;
  setIsUploadOpen: (open: boolean) => void;
  isAuditOpen: boolean;
  setIsAuditOpen: (open: boolean) => void;
  isAgentModalOpen: boolean;
  setIsAgentModalOpen: (open: boolean) => void;

  // Guided Hackathon Demo
  isGuidedDemoActive: boolean;
  guidedDemoStep: number;
  startGuidedDemo: () => void;
  nextGuidedDemoStep: () => void;
  previousGuidedDemoStep: () => void;
  stopGuidedDemo: () => void;

  // Business Actions
  approveRemediation: (remediationId: string) => void;
  rejectRemediation: (remediationId: string, reason: string) => void;
  generateRemediationForGap: (gapId: string) => Promise<Remediation>;
  runImpactAnalysisForChange: (changeId: string) => Promise<void>;
  uploadRegulationDocument: (file: { name: string; content?: string }) => Promise<void>;
  uploadEvidenceDocument: (file: { name: string; controlId: string; type: any }) => Promise<void>;
  addAuditLog: (entry: { action: string; entity: string; entityId: string; oldValue: string; newValue: string; agentInvolved?: string }) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetDemoData: () => void;
}

const ComplianceContext = createContext<ComplianceContextType | null>(null);

const STORAGE_KEY = 'reglens_ai_state_v1';

export const ComplianceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('Chief Compliance Officer');
  const [activePage, setActivePage] = useState<ActivePage>('landing');

  const [regulations, setRegulations] = useState<Regulation[]>(INITIAL_REGULATIONS);
  const [obligations, setObligations] = useState<Obligation[]>(INITIAL_OBLIGATIONS);
  const [controls, setControls] = useState<Control[]>(INITIAL_CONTROLS);
  const [mappings, setMappings] = useState<Mapping[]>(INITIAL_MAPPINGS);
  const [evidence, setEvidence] = useState<Evidence[]>(INITIAL_EVIDENCE);
  const [gaps, setGaps] = useState<Gap[]>(INITIAL_GAPS);
  const [remediations, setRemediations] = useState<Remediation[]>(INITIAL_REMEDIATIONS);
  const [regulatoryChanges, setRegulatoryChanges] = useState<RegulatoryChange[]>(INITIAL_REGULATORY_CHANGES);
  const [simulations] = useState<WhatIfSimulation[]>(INITIAL_SIMULATIONS);
  const [crossRegMatrix] = useState<CrossRegMatrixItem[]>(INITIAL_CROSS_REG_MATRIX);
  const [contradictions] = useState<ContradictionFinding[]>(INITIAL_CONTRADICTIONS);

  const [selectedRegulationId, setSelectedRegulationId] = useState<string | null>(null);
  const [selectedGapId, setSelectedGapId] = useState<string | null>(null);
  const [selectedControlId, setSelectedControlId] = useState<string | null>(null);

  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  // Guided demo
  const [isGuidedDemoActive, setIsGuidedDemoActive] = useState(false);
  const [guidedDemoStep, setGuidedDemoStep] = useState(1);

  // Agent activity logs
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([
    {
      id: 'RUN-001',
      agentName: 'Regulatory Intelligence Agent',
      step: 'Document Classification & Metadata Tagging',
      status: 'completed',
      timestamp: 'Today at 09:15 AM',
      details: 'Identified RBI KYC Master Direction v4.2 amendment published Aug 15, effective Oct 1.',
      confidence: 99
    },
    {
      id: 'RUN-002',
      agentName: 'Obligation Extraction Agent',
      step: 'Clause Decomposition & Taxonomy Mapping',
      status: 'completed',
      timestamp: 'Today at 09:16 AM',
      details: 'Extracted 43 structured compliance obligations across 11 regulations.',
      confidence: 96
    },
    {
      id: 'RUN-003',
      agentName: 'Control Mapping Agent',
      step: 'Semantic Framework Alignment',
      status: 'completed',
      timestamp: 'Today at 09:18 AM',
      details: 'Mapped OBL-001 to AML-C-023. Identified frequency disparity (Quarterly vs Annual).',
      confidence: 94
    },
    {
      id: 'RUN-004',
      agentName: 'Evidence Assessment Agent',
      step: 'Sufficiency & Expiry Audit',
      status: 'completed',
      timestamp: 'Today at 09:20 AM',
      details: 'Evaluated 13 primary evidence artifacts. Flagged 1 expired DR certificate & 2 missing items.',
      confidence: 95
    },
    {
      id: 'RUN-005',
      agentName: 'Gap Analysis & Risk Prioritization Agent',
      step: 'GRC Risk Scoring Computation',
      status: 'completed',
      timestamp: 'Today at 09:22 AM',
      details: 'Formulated 7 active gaps. Computed GAP-1042 risk priority as 92/100 (Critical).',
      confidence: 97
    }
  ]);

  // Audit trail
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'LOG-001',
      timestamp: '2026-09-20 13:10:44',
      user: 'Priya Sharma',
      role: 'Chief Compliance Officer',
      action: 'Approved remediation plan',
      entity: 'Remediation',
      entityId: 'REM-001 (GAP-1042)',
      oldValue: 'Pending Approval',
      newValue: 'Approved',
      agentInvolved: 'Remediation Agent',
      status: 'Approved'
    },
    {
      id: 'LOG-002',
      timestamp: '2026-09-18 10:45:12',
      user: 'Anand Rao',
      role: 'Head of Retail Operations',
      action: 'Approved remediation plan',
      entity: 'Remediation',
      entityId: 'REM-003 (GAP-1015)',
      oldValue: 'Pending Approval',
      newValue: 'Approved',
      agentInvolved: 'Remediation Agent',
      status: 'Approved'
    },
    {
      id: 'LOG-003',
      timestamp: '2026-09-15 16:30:00',
      user: 'System Agent',
      role: 'Autonomous Agent Engine',
      action: 'Detected regulatory amendment',
      entity: 'Regulation',
      entityId: 'REG-RBI-KYC-2026',
      oldValue: 'v4.1',
      newValue: 'v4.2',
      agentInvolved: 'Regulatory Intelligence Agent',
      status: 'Executed'
    }
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'NOTIF-01',
      title: 'Regulatory Change Detected',
      message: 'RBI released KYC Direction Amendment v4.2 mandating quarterly customer risk reviews for High-Risk accounts.',
      type: 'critical',
      timestamp: '15 mins ago',
      read: false,
      actionLink: 'changes'
    },
    {
      id: 'NOTIF-02',
      title: 'Critical Gap Action Required',
      message: 'GAP-1042 (Customer Risk Review Cadence Mismatch) reaches enforcement deadline on 15 Oct 2026.',
      type: 'critical',
      timestamp: '1 hour ago',
      read: false,
      actionLink: 'gaps'
    },
    {
      id: 'NOTIF-03',
      title: 'Evidence Expiration Alert',
      message: 'EVD-0112 (Core Banking DR Restoration Certificate) has expired and requires updated test submission.',
      type: 'warning',
      timestamp: '3 hours ago',
      read: false,
      actionLink: 'evidence'
    },
    {
      id: 'NOTIF-04',
      title: 'Autonomous Impact Analysis Complete',
      message: 'Analysis of RBI Cyber Security Framework amendment finished. 5 controls and 2 policies affected.',
      type: 'info',
      timestamp: 'Yesterday',
      read: true,
      actionLink: 'changes'
    }
  ]);

  const addAuditLog = (entry: {
    action: string;
    entity: string;
    entityId: string;
    oldValue: string;
    newValue: string;
    agentInvolved?: string;
  }) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: role === 'Chief Compliance Officer' ? 'Priya Sharma (You)' : `${role} User`,
      role,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      agentInvolved: entry.agentInvolved || 'Human-in-the-Loop',
      status: 'Approved'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const approveRemediation = (remediationId: string) => {
    setRemediations(prev =>
      prev.map(rem => {
        if (rem.id === remediationId) {
          const updated: Remediation = {
            ...rem,
            approvalStatus: 'Approved',
            status: 'In Progress',
            approvedBy: role,
            approvedAt: new Date().toISOString().split('T')[0],
            progress: Math.max(rem.progress, 50)
          };

          // Also update the associated Gap status to 'Under Remediation'
          setGaps(prevGaps =>
            prevGaps.map(gap =>
              gap.id === rem.gapId || gap.gapCode === rem.gapCode
                ? { ...gap, status: 'Under Remediation' }
                : gap
            )
          );

          addAuditLog({
            action: 'Approved remediation plan and action items',
            entity: 'Remediation',
            entityId: `${rem.id} (${rem.gapCode})`,
            oldValue: rem.approvalStatus,
            newValue: 'Approved',
            agentInvolved: 'Human-in-the-Loop Approval'
          });

          setNotifications(prevNotifs => [
            {
              id: `NOTIF-${Date.now()}`,
              title: 'Remediation Approved',
              message: `Remediation for ${rem.gapCode} approved by ${role}. Workstream initiated.`,
              type: 'success',
              timestamp: 'Just now',
              read: false,
              actionLink: 'remediation'
            },
            ...prevNotifs
          ]);

          return updated;
        }
        return rem;
      })
    );
  };

  const rejectRemediation = (remediationId: string, reason: string) => {
    setRemediations(prev =>
      prev.map(rem => {
        if (rem.id === remediationId) {
          addAuditLog({
            action: `Rejected remediation plan: ${reason}`,
            entity: 'Remediation',
            entityId: `${rem.id} (${rem.gapCode})`,
            oldValue: rem.approvalStatus,
            newValue: 'Rejected',
            agentInvolved: 'Human-in-the-Loop Rejection'
          });
          return {
            ...rem,
            approvalStatus: 'Rejected'
          };
        }
        return rem;
      })
    );
  };

  const generateRemediationForGap = async (gapId: string): Promise<Remediation> => {
    const gap = gaps.find(g => g.id === gapId || g.gapCode === gapId);
    if (!gap) throw new Error('Gap not found');

    const control = controls.find(c => c.id === gap.controlId);
    const newRem = await AIProvider.generateRemediationPlan(gap, control);

    setRemediations(prev => [newRem, ...prev]);

    addAuditLog({
      action: 'Generated AI Remediation Plan',
      entity: 'Gap',
      entityId: gap.gapCode,
      oldValue: 'No Remediation Plan',
      newValue: newRem.id,
      agentInvolved: 'Remediation Agent'
    });

    setAgentRuns(prev => [
      {
        id: `RUN-${Date.now()}`,
        agentName: 'Remediation Agent',
        step: `Remediation Synthesis for ${gap.gapCode}`,
        status: 'completed',
        timestamp: 'Just now',
        details: `Generated actionable 3-phase remediation plan for ${gap.title}.`,
        confidence: 96
      },
      ...prev
    ]);

    return newRem;
  };

  const runImpactAnalysisForChange = async (changeId: string) => {
    const change = regulatoryChanges.find(c => c.id === changeId);
    if (!change) return;

    setAgentRuns(prev => [
      {
        id: `RUN-${Date.now()}-1`,
        agentName: 'Regulatory Intelligence Agent',
        step: `Diff Analysis for ${change.regulationName}`,
        status: 'running',
        timestamp: 'Just now',
        details: `Evaluating textual diffs between ${change.previousVersion} and ${change.newVersion}...`
      },
      ...prev
    ]);

    const result = await AIProvider.runAutonomousImpactAnalysis(change, obligations, controls, evidence);

    setAgentRuns(prev => [
      {
        id: `RUN-${Date.now()}-2`,
        agentName: 'Regulatory Impact Agent',
        step: 'Autonomous Impact Synthesis Complete',
        status: 'completed',
        timestamp: 'Just now',
        details: `Impact: ${result.summary.obligationsCount} obligations, ${result.summary.controlsCount} controls, ${result.summary.gapsCount} gaps identified.`,
        confidence: 98
      },
      ...prev
    ]);

    addAuditLog({
      action: 'Executed Autonomous Regulatory Impact Analysis',
      entity: 'Regulatory Change',
      entityId: change.id,
      oldValue: 'Unanalyzed',
      newValue: 'Impact Assessed (Critical)',
      agentInvolved: 'Regulatory Impact Agent'
    });
  };

  const uploadRegulationDocument = async (file: { name: string; content?: string }) => {
    setIsAgentModalOpen(true);
    setAgentRuns(prev => [
      {
        id: `RUN-${Date.now()}-INGEST`,
        agentName: 'Regulatory Intelligence Agent',
        step: `Ingesting Document: ${file.name}`,
        status: 'running',
        timestamp: 'Just now',
        details: 'Reading document structure, identifying regulator, jurisdiction, and effective date...'
      },
      ...prev
    ]);

    const { metadata, obligations: extractedObls } = await AIProvider.extractObligationsFromDocument(
      file.name,
      file.content || ''
    );

    const newReg: Regulation = {
      id: `REG-UPLOAD-${Date.now()}`,
      name: metadata.name,
      regulator: metadata.regulator,
      jurisdiction: metadata.jurisdiction,
      version: metadata.version,
      publishedDate: new Date().toISOString().split('T')[0],
      effectiveDate: metadata.effectiveDate,
      status: 'Active',
      description: `Uploaded and parsed by Regulatory Intelligence Agent from ${file.name}.`,
      topic: metadata.topic,
      affectedProducts: ['Retail Banking', 'Core Banking'],
      totalObligations: extractedObls.length,
      sourceTextSnippet: `Extracted from uploaded document ${file.name}`
    };

    setRegulations(prev => [newReg, ...prev]);
    setObligations(prev => [...extractedObls, ...prev]);

    setAgentRuns(prev => [
      {
        id: `RUN-${Date.now()}-MAPPING`,
        agentName: 'Control Mapping Agent',
        step: 'Mapping Extracted Obligations to Internal Controls',
        status: 'completed',
        timestamp: 'Just now',
        details: `Extracted ${extractedObls.length} obligations; automatically aligned with 2 internal controls.`,
        confidence: 93
      },
      ...prev
    ]);

    addAuditLog({
      action: 'Uploaded and Ingested Regulatory Document',
      entity: 'Regulation',
      entityId: newReg.id,
      oldValue: 'N/A',
      newValue: newReg.name,
      agentInvolved: 'Regulatory Intelligence Agent'
    });

    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Document Ingestion Complete',
        message: `${file.name} successfully parsed. ${extractedObls.length} new obligations extracted.`,
        type: 'success',
        timestamp: 'Just now',
        read: false,
        actionLink: 'regulations'
      },
      ...prev
    ]);
  };

  const uploadEvidenceDocument = async (file: { name: string; controlId: string; type: any }) => {
    const ctrl = controls.find(c => c.id === file.controlId);
    if (!ctrl) return;

    const newEvidence: Evidence = {
      id: `EVD-${Date.now()}`,
      controlId: ctrl.id,
      controlCode: ctrl.controlCode,
      name: file.name,
      type: file.type || 'Audit Report',
      uploadedAt: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Found',
      sourceUrl: `/evidence/user_uploads/${file.name}`,
      fileSize: '2.4 MB',
      evaluatorNotes: 'Uploaded evidence artifact. Autonomous agent verification completed successfully.',
      sufficiencyScore: 92
    };

    setEvidence(prev => [newEvidence, ...prev]);

    // Update control evidence status
    setControls(prev =>
      prev.map(c =>
        c.id === ctrl.id
          ? { ...c, evidenceStatus: 'Evidence Available', effectiveness: 'Effective' }
          : c
      )
    );

    addAuditLog({
      action: 'Uploaded and Verified Compliance Evidence',
      entity: 'Evidence',
      entityId: newEvidence.id,
      oldValue: 'Missing / Insufficient',
      newValue: 'Evidence Available',
      agentInvolved: 'Evidence Assessment Agent'
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const startGuidedDemo = () => {
    setIsGuidedDemoActive(true);
    setGuidedDemoStep(1);
    setActivePage('changes'); // Start at regulatory changes
  };

  const nextGuidedDemoStep = () => {
    setGuidedDemoStep(prev => {
      const next = prev + 1;
      // Step routing
      if (next === 2) setActivePage('changes'); // Step 2: Show Before vs After & Run Impact
      if (next === 3) setActivePage('obligations'); // Step 3: Show new obligations
      if (next === 4) setActivePage('controls'); // Step 4: Show affected controls
      if (next === 5) setActivePage('evidence'); // Step 5: Show evidence assessment
      if (next === 6) {
        setActivePage('gaps');
        setSelectedGapId('GAP-1042'); // Step 6: Open GAP-1042 detail
      }
      if (next === 7) setActivePage('remediation'); // Step 7: Show remediation & approve
      if (next === 8) setActivePage('simulation'); // Step 8: What-If simulation Annual -> Quarterly
      if (next === 9) setActivePage('compliance-map'); // Step 9: Traceability Chain
      if (next === 10) {
        setActivePage('dashboard'); // Final step: Updated dashboard metrics!
      }
      return next;
    });
  };

  const previousGuidedDemoStep = () => {
    setGuidedDemoStep(prev => Math.max(1, prev - 1));
  };

  const stopGuidedDemo = () => {
    setIsGuidedDemoActive(false);
    setGuidedDemoStep(1);
  };

  const resetDemoData = () => {
    setRegulations(INITIAL_REGULATIONS);
    setObligations(INITIAL_OBLIGATIONS);
    setControls(INITIAL_CONTROLS);
    setMappings(INITIAL_MAPPINGS);
    setEvidence(INITIAL_EVIDENCE);
    setGaps(INITIAL_GAPS);
    setRemediations(INITIAL_REMEDIATIONS);
    setRegulatoryChanges(INITIAL_REGULATORY_CHANGES);
    setSelectedRegulationId(null);
    setSelectedGapId(null);
    setSelectedControlId(null);
    setIsGuidedDemoActive(false);
    setGuidedDemoStep(1);
  };

  return (
    <ComplianceContext.Provider
      value={{
        role,
        setRole,
        activePage,
        setActivePage,
        regulations,
        obligations,
        controls,
        mappings,
        evidence,
        gaps,
        remediations,
        regulatoryChanges,
        simulations,
        crossRegMatrix,
        contradictions,
        agentRuns,
        auditLogs,
        notifications,
        selectedRegulationId,
        setSelectedRegulationId,
        selectedGapId,
        setSelectedGapId,
        selectedControlId,
        setSelectedControlId,
        isCopilotOpen,
        setIsCopilotOpen,
        isSearchOpen,
        setIsSearchOpen,
        isUploadOpen,
        setIsUploadOpen,
        isAuditOpen,
        setIsAuditOpen,
        isAgentModalOpen,
        setIsAgentModalOpen,
        isGuidedDemoActive,
        guidedDemoStep,
        startGuidedDemo,
        nextGuidedDemoStep,
        previousGuidedDemoStep,
        stopGuidedDemo,
        approveRemediation,
        rejectRemediation,
        generateRemediationForGap,
        runImpactAnalysisForChange,
        uploadRegulationDocument,
        uploadEvidenceDocument,
        addAuditLog,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
};

export const useComplianceStore = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useComplianceStore must be used within ComplianceProvider');
  }
  return context;
};
