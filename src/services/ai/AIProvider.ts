import {
  Regulation,
  Obligation,
  Control,
  Mapping,
  Evidence,
  EvidenceStatus,
  ControlEffectiveness,
  Gap,
  Remediation,
  RiskLevel,
  RegulatoryChange,
  WhatIfSimulation
} from '../../types';

export interface CopilotResponse {
  answer: string;
  citations: { entity: string; code: string; title: string; section?: string }[];
  confidence: number;
  suggestedActions: string[];
}

export interface ImpactAnalysisResult {
  changeId: string;
  affectedObligations: Obligation[];
  affectedControls: Control[];
  affectedPolicies: string[];
  affectedEvidence: Evidence[];
  identifiedGaps: Gap[];
  summary: {
    obligationsCount: number;
    controlsCount: number;
    policiesCount: number;
    evidenceCount: number;
    gapsCount: number;
    criticalActionsCount: number;
  };
}

export interface AIProviderInterface {
  name: string;
  extractObligationsFromDocument(docName: string, text: string): Promise<{
    metadata: {
      name: string;
      regulator: string;
      jurisdiction: string;
      version: string;
      topic: string;
      effectiveDate: string;
    };
    obligations: Obligation[];
  }>;
  mapObligationToControls(obligation: Obligation, availableControls: Control[]): Promise<Mapping[]>;
  assessEvidenceSufficiency(evidence: Evidence, control: Control): Promise<{
    status: EvidenceStatus;
    sufficiencyScore: number;
    evaluatorNotes: string;
  }>;
  generateGapAnalysis(obligation: Obligation, control: Control, evidence?: Evidence): Promise<Gap | null>;
  generateRemediationPlan(gap: Gap, control?: Control): Promise<Remediation>;
  runAutonomousImpactAnalysis(change: RegulatoryChange, allObligations: Obligation[], allControls: Control[], allEvidence: Evidence[]): Promise<ImpactAnalysisResult>;
  askCopilot(question: string, context: {
    regulations: Regulation[];
    obligations: Obligation[];
    controls: Control[];
    gaps: Gap[];
    evidence: Evidence[];
    changes: RegulatoryChange[];
  }): Promise<CopilotResponse>;
}

class DeterministicBankingAIProvider implements AIProviderInterface {
  name = 'ReguLens Deterministic Banking AI Engine (Default)';

  async extractObligationsFromDocument(docName: string, text: string) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const isKYC = docName.toLowerCase().includes('kyc') || text.toLowerCase().includes('customer');
    const isCyber = docName.toLowerCase().includes('cyber') || text.toLowerCase().includes('security') || text.toLowerCase().includes('incident');

    const cleanTitle = docName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    const metadata = {
      name: `Regulation: ${cleanTitle}`,
      regulator: isCyber ? 'Reserve Bank of India (Cyber Security Cell)' : 'Reserve Bank of India (DoR)',
      jurisdiction: 'India / Scheduled Commercial Banks',
      version: 'v1.0 (Parsed 2026)',
      topic: isCyber ? 'Cyber Security & Resilience' : (isKYC ? 'Customer Identification & AML' : 'Banking Operations'),
      effectiveDate: '2026-11-01'
    };

    const newObligations: Obligation[] = [
      {
        id: `OBL-EXT-${Date.now()}-1`,
        regulationId: `REG-EXT-${Date.now()}`,
        regulationName: metadata.name,
        obligationCode: `OBL-${Math.floor(100 + Math.random() * 900)}`,
        requirement: isCyber 
          ? 'Mandatory implementation of zero-trust network segmentation and continuous endpoint posture telemetry.'
          : 'Customer due diligence procedures must be verified against independent digital identity repositories prior to onboarding.',
        section: 'Section 4.2',
        obligationType: 'Mandatory',
        applicability: 'Applicable',
        applicabilityReasoning: 'Applies to all scheduled banking entities conducting commercial operations in jurisdiction.',
        frequency: 'Continuous',
        owner: isCyber ? 'Chief Information Security Officer' : 'AML Compliance',
        risk: 'High',
        requiredEvidence: isCyber ? 'Zero-Trust Architecture Attestation & Firewall Configuration Logs' : 'Identity Verification API Payload Logs',
        sourceReference: `${metadata.name} / Section 4.2`,
        mappedControlIds: isCyber ? ['CYB-C-112', 'CYB-C-115'] : ['AML-C-001'],
        confidenceScore: 94
      },
      {
        id: `OBL-EXT-${Date.now()}-2`,
        regulationId: `REG-EXT-${Date.now()}`,
        regulationName: metadata.name,
        obligationCode: `OBL-${Math.floor(100 + Math.random() * 900)}`,
        requirement: isCyber
          ? 'Quarterly threat-hunting exercises covering all outward-facing API gateways and correspondent channels.'
          : 'Periodic re-assessment of risk categorization for active accounts with automated alert upon transaction spike.',
        section: 'Section 7.1',
        obligationType: 'Mandatory',
        applicability: 'Applicable',
        applicabilityReasoning: 'Critical operational mandate for risk prevention.',
        frequency: 'Quarterly',
        owner: isCyber ? 'SOC Operations Manager' : 'Transaction Monitoring Unit',
        risk: 'High',
        requiredEvidence: isCyber ? 'Quarterly Threat Hunting Log & Findings Report' : 'Risk Scoring Batch Output & Exceptions List',
        sourceReference: `${metadata.name} / Section 7.1`,
        mappedControlIds: isCyber ? ['CYB-C-108'] : ['AML-C-023'],
        confidenceScore: 91
      }
    ];

    return { metadata, obligations: newObligations };
  }

  async mapObligationToControls(obligation: Obligation, availableControls: Control[]): Promise<Mapping[]> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Find closest controls based on domain and keywords
    const matches: Mapping[] = [];
    const textToMatch = (obligation.requirement + ' ' + obligation.owner).toLowerCase();

    for (const ctrl of availableControls) {
      let score = 50;
      const ctrlText = (ctrl.name + ' ' + ctrl.description + ' ' + ctrl.domain).toLowerCase();

      if (ctrl.domain.toLowerCase().includes('aml') && textToMatch.includes('risk') || textToMatch.includes('kyc')) score += 30;
      if (ctrl.domain.toLowerCase().includes('cyber') && (textToMatch.includes('cyber') || textToMatch.includes('incident'))) score += 35;
      if (ctrl.frequency === obligation.frequency) score += 15;

      if (score >= 70) {
        matches.push({
          id: `MAP-AUTO-${Date.now()}-${ctrl.id}`,
          obligationId: obligation.id,
          controlId: ctrl.id,
          confidence: Math.min(score, 98),
          coverage: score > 85 ? 'Strong' : 'Moderate',
          rationale: `AI identified strong semantic correlation between obligation requirement and control capability in ${ctrl.domain}.`,
          factors: [
            `Domain alignment: ${ctrl.domain}`,
            `Frequency comparison: ${ctrl.frequency} vs ${obligation.frequency}`,
            `Assessed capability match: ${score}%`
          ]
        });
      }
    }

    return matches.slice(0, 3);
  }

  async assessEvidenceSufficiency(evidence: Evidence, control: Control) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const isExpired = new Date(evidence.expiryDate) < new Date();
    if (isExpired) {
      return {
        status: 'Expired' as EvidenceStatus,
        sufficiencyScore: 35,
        evaluatorNotes: `Evidence expired on ${evidence.expiryDate}. Current operating period is unverified.`
      };
    }

    if (evidence.name.toLowerCase().includes('annual') && control.frequency === 'Quarterly') {
      return {
        status: 'Insufficient' as EvidenceStatus,
        sufficiencyScore: 45,
        evaluatorNotes: 'Frequency Mismatch: Evidence provided covers annual review cadence, failing the quarterly requirement.'
      };
    }

    return {
      status: 'Found' as EvidenceStatus,
      sufficiencyScore: 92,
      evaluatorNotes: 'Evidence satisfies audit criteria, demonstrates operational execution, and contains verified reviewer sign-offs.'
    };
  }

  async generateGapAnalysis(obligation: Obligation, control: Control, evidence?: Evidence): Promise<Gap | null> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (obligation.frequency !== control.frequency) {
      return {
        id: `GAP-${Date.now()}`,
        gapCode: `GAP-${Math.floor(1000 + Math.random() * 9000)}`,
        obligationId: obligation.id,
        controlId: control.id,
        regulationId: obligation.regulationId,
        gapType: 'Regulatory Change Not Implemented',
        title: `Cadence Mismatch in ${control.name} (${control.frequency} vs ${obligation.frequency})`,
        description: `Regulatory obligation mandates ${obligation.frequency} cadence, whereas bank control ${control.controlCode} is executed on ${control.frequency} basis.`,
        riskLevel: obligation.risk,
        riskScore: obligation.risk === 'Critical' ? 92 : (obligation.risk === 'High' ? 78 : 55),
        riskFactors: {
          regulatorySeverity: obligation.risk === 'Critical' ? 95 : 80,
          businessImpact: 82,
          customerImpact: 70,
          financialImpact: 75,
          legalImpact: 88,
          controlWeakness: 85
        },
        owner: control.owner,
        dueDate: '2026-11-01',
        status: 'Open',
        rootCause: 'Control definition in policy and batch scheduler has not been refreshed following recent regulatory circular update.',
        assessmentNotes: 'Significant compliance vulnerability. Regulatory examination will identify cadence discrepancy immediately.',
        recommendedAction: `Update control ${control.controlCode} frequency to ${obligation.frequency} and adjust automated scheduler.`
      };
    }

    return null;
  }

  async generateRemediationPlan(gap: Gap, control?: Control): Promise<Remediation> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    return {
      id: `REM-${Date.now()}`,
      gapId: gap.id,
      gapCode: gap.gapCode,
      title: `Remediate ${gap.title}`,
      recommendation: gap.recommendedAction || 'Update control procedures, refresh evidence documentation, and gain compliance sign-off.',
      rootCause: gap.rootCause || 'Control operational definition misaligned with current regulatory mandate.',
      controlChange: `Amend control operational procedures for ${gap.controlId || 'assigned control'} to enforce mandatory compliance check.`,
      policyChange: 'Update relevant policy chapter to incorporate newly mandated regulatory thresholds.',
      evidenceRequirement: 'Updated system batch execution logs, signed test report, and quarterly compliance exception dashboard.',
      owner: gap.owner || 'Compliance Officer',
      suggestedDeadline: gap.dueDate,
      priority: gap.riskLevel,
      dependencies: ['IT Development Sprint', 'Compliance Policy Review Board'],
      verificationCriteria: 'Successful validation of updated control across 100% of test sample transactions without failure.',
      status: 'Backlog',
      progress: 0,
      approvalStatus: 'Pending Approval',
      actionItems: [
        { id: `ACT-${Date.now()}-1`, task: 'Review gap root cause with control owner and IT leads', owner: gap.owner, deadline: gap.dueDate, completed: false },
        { id: `ACT-${Date.now()}-2`, task: 'Implement technical configuration changes in test environment', owner: 'Engineering Team', deadline: gap.dueDate, completed: false },
        { id: `ACT-${Date.now()}-3`, task: 'Submit verified evidence and request CCO formal closure sign-off', owner: 'Compliance Officer', deadline: gap.dueDate, completed: false }
      ]
    };
  }

  async runAutonomousImpactAnalysis(
    change: RegulatoryChange,
    allObligations: Obligation[],
    allControls: Control[],
    allEvidence: Evidence[]
  ): Promise<ImpactAnalysisResult> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const affectedObls = allObligations.filter(o => o.regulationId === change.regulationId);
    const affectedCtrlIds = new Set<string>();
    affectedObls.forEach(o => o.mappedControlIds.forEach(cid => affectedCtrlIds.add(cid)));
    const affectedCtrls = allControls.filter(c => affectedCtrlIds.has(c.id));

    const affectedEvd = allEvidence.filter(e => affectedCtrlIds.has(e.controlId));

    const simulatedGaps: Gap[] = [
      {
        id: `GAP-IMPACT-${Date.now()}`,
        gapCode: 'GAP-1042',
        obligationId: affectedObls[0]?.id || 'OBL-KYC-001',
        controlId: 'AML-C-023',
        regulationId: change.regulationId,
        gapType: 'Regulatory Change Not Implemented',
        title: 'Customer Risk Categorization Frequency Mismatch (Annual vs Quarterly)',
        description: 'New regulatory mandate requires quarterly review for High-Risk accounts. Internal control AML-C-023 currently performs review annually.',
        riskLevel: 'Critical',
        riskScore: 92,
        riskFactors: {
          regulatorySeverity: 95,
          businessImpact: 88,
          customerImpact: 72,
          financialImpact: 85,
          legalImpact: 94,
          controlWeakness: 90
        },
        owner: 'Head of AML Operations',
        dueDate: '2026-10-15',
        status: 'Open',
        rootCause: 'Control frequency hardcoded to annual cycle; high-risk cohort isolation not yet operationalized.',
        assessmentNotes: 'High regulatory exposure. Immediate action required prior to effective date 01 Oct 2026.',
        recommendedAction: 'Reconfigure AML batch scoring rule engine to isolate High-Risk customer cohort and execute re-categorization quarterly.'
      }
    ];

    return {
      changeId: change.id,
      affectedObligations: affectedObls,
      affectedControls: affectedCtrls,
      affectedPolicies: ['AML & KYC Operational Policy Section 4', 'V-CIP Technical Standard Operating Procedure'],
      affectedEvidence: affectedEvd,
      identifiedGaps: simulatedGaps,
      summary: {
        obligationsCount: change.affectedObligationCount,
        controlsCount: change.affectedControlCount,
        policiesCount: change.affectedPolicyCount,
        evidenceCount: change.affectedEvidenceCount,
        gapsCount: change.potentialGapsCount,
        criticalActionsCount: 2
      }
    };
  }

  async askCopilot(question: string, context: {
    regulations: Regulation[];
    obligations: Obligation[];
    controls: Control[];
    gaps: Gap[];
    evidence: Evidence[];
    changes: RegulatoryChange[];
  }): Promise<CopilotResponse> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const q = question.toLowerCase();

    if (q.includes('kyc') || q.includes('quarterly') || q.includes('gap-1042')) {
      return {
        answer: `Under the updated **RBI KYC Master Direction (v4.2, Section 12.4)**, banks are mandated to review customer risk categorization at least **quarterly for High-Risk customers**, while Medium and Low-Risk customers remain on an annual cycle. \n\nOur current control **AML-C-023** operates on an **Annual** schedule, creating a critical compliance gap (**GAP-1042** with risk score 92/100). Remediation plan **REM-001** is currently in progress to update the batch scheduler and AML policy before the 01 Oct 2026 deadline.`,
        citations: [
          { entity: 'Regulation', code: 'REG-RBI-KYC-2026', title: 'RBI Master Direction - KYC', section: 'Section 12.4' },
          { entity: 'Obligation', code: 'OBL-001', title: 'Quarterly High-Risk Categorization Review' },
          { entity: 'Control', code: 'AML-C-023', title: 'Customer Risk Categorization Review (Periodic)' },
          { entity: 'Gap', code: 'GAP-1042', title: 'Customer Risk Categorization Frequency Mismatch' }
        ],
        confidence: 96,
        suggestedActions: [
          'View GAP-1042 Risk Factor Breakdown',
          'Inspect Remediation Plan REM-001',
          'Run What-If Simulation on Quarterly Frequency'
        ]
      };
    }

    if (q.includes('high risk') || q.includes('critical gaps') || q.includes('open gaps')) {
      const critGaps = context.gaps.filter(g => g.riskLevel === 'Critical');
      return {
        answer: `There are currently **${critGaps.length} Critical Gaps** requiring immediate executive attention:\n\n1. **GAP-1042**: Customer Risk Categorization Frequency Mismatch (RBI KYC Sec 12.4 vs Control AML-C-023) — Score: 92\n2. **GAP-1024**: Disaster Recovery Restoration Drill Evidence Expired (RBI Cyber Sec Sec 11.1 vs Control BCP-C-019) — Score: 88\n\nBoth gaps have active remediation workstreams with target resolution dates before mid-October 2026.`,
        citations: [
          { entity: 'Gap', code: 'GAP-1042', title: 'Customer Risk Categorization Cadence' },
          { entity: 'Gap', code: 'GAP-1024', title: 'Disaster Recovery Restoration Evidence' }
        ],
        confidence: 98,
        suggestedActions: [
          'Navigate to Gap Management',
          'Approve Remediation for GAP-1024',
          'Export Board GRC Report'
        ]
      };
    }

    if (q.includes('evidence') || q.includes('missing evidence') || q.includes('expired')) {
      const expiredOrMissing = context.evidence.filter(e => e.status === 'Missing' || e.status === 'Expired');
      return {
        answer: `The evidence assessment agent identified **${expiredOrMissing.length} evidence items** with deficiency:\n\n• **EVD-0112**: Core Banking DR Restoration Drill Certificate (Status: **Expired** on 25 June 2026) for control BCP-C-019.\n• **EVD-0145**: DPDP Right of Erasure Automated Purge Execution Logs (Status: **Missing**) for control DAT-C-014.\n• **EVD-0092**: Customer Risk Annual Batch Run Log (Status: **Insufficient** — only shows annual runs).`,
        citations: [
          { entity: 'Evidence', code: 'EVD-0112', title: 'DR Restoration Certificate' },
          { entity: 'Evidence', code: 'EVD-0145', title: 'Right of Erasure Purge Logs' },
          { entity: 'Evidence', code: 'EVD-0092', title: 'Customer Risk Batch Log' }
        ],
        confidence: 94,
        suggestedActions: [
          'Open Evidence Repository',
          'Upload New DR Restoration Attestation',
          'Notify Control Owners'
        ]
      };
    }

    if (q.includes('traceability') || q.includes('trace') || q.includes('chain')) {
      return {
        answer: `ReguLens AI maintains an unbroken, tamper-evident traceability chain for every compliance artifact:\n\n**Regulation** (RBI-KYC-2026 Sec 12.4)\n  ↳ **Obligation** (OBL-001: Quarterly review)\n  ↳ **Control** (AML-C-023: Periodic risk categorization)\n  ↳ **Evidence** (EVD-0092: Batch execution logs)\n  ↳ **Testing** (Annual execution detected)\n  ↳ **Gap** (GAP-1042: Cadence mismatch)\n  ↳ **Remediation** (REM-001: Reconfigure to quarterly)\n  ↳ **Audit Approval** (CCO sign-off on 20 Sep 2026)`,
        citations: [
          { entity: 'Compliance Map', code: 'CHAIN-01', title: 'KYC Risk Review Traceability Graph' }
        ],
        confidence: 99,
        suggestedActions: [
          'Open Traceability Visualizer',
          'Export Traceability Audit Certificate'
        ]
      };
    }

    // Generic answer grounded in context
    return {
      answer: `Based on your bank's current compliance repository: We track **${context.regulations.length} regulations**, **${context.obligations.length} structured obligations**, **${context.controls.length} internal controls**, and **${context.gaps.length} gaps** across Indian and international jurisdictions.\n\nYour overall regulatory coverage is currently at **87%**, with **${context.gaps.filter(g => g.riskLevel === 'Critical').length} Critical Gaps** and **${context.changes.length} upcoming regulatory amendments** queued for impact analysis.`,
      citations: [
        { entity: 'System', code: 'SYS-OVERVIEW', title: 'ReguLens Enterprise GRC Knowledge Base' }
      ],
      confidence: 91,
      suggestedActions: [
        'Run Autonomous Impact Analysis',
        'Explore What-If Scenarios',
        'Review Cross-Regulation Matrix'
      ]
    };
  }
}

// Export singleton instance conforming to AIProviderInterface
export const AIProvider: AIProviderInterface = new DeterministicBankingAIProvider();
