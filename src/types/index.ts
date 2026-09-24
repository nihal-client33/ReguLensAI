export type UserRole = 
  | 'Chief Compliance Officer' 
  | 'Compliance Officer' 
  | 'Risk Manager' 
  | 'Internal Auditor' 
  | 'Control Owner';

export type RegulationStatus = 'Active' | 'Under Review' | 'Draft' | 'Superseded';

export interface Regulation {
  id: string;
  name: string;
  regulator: string;
  jurisdiction: string;
  version: string;
  publishedDate: string;
  effectiveDate: string;
  status: RegulationStatus;
  documentUrl?: string;
  description: string;
  topic: string;
  affectedProducts: string[];
  totalObligations?: number;
  sourceTextSnippet?: string;
}

export type ObligationType = 'Mandatory' | 'Recommended' | 'Conditional';
export type ApplicabilityStatus = 'Applicable' | 'Partially Applicable' | 'Not Applicable' | 'Requires Review';
export type Frequency = 'Continuous' | 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Semi-Annual' | 'Annual' | 'Ad-hoc';
export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Obligation {
  id: string;
  regulationId: string;
  regulationName?: string;
  obligationCode: string;
  requirement: string;
  section: string;
  obligationType: ObligationType;
  applicability: ApplicabilityStatus;
  applicabilityReasoning: string;
  frequency: Frequency;
  owner: string;
  risk: RiskLevel;
  requiredEvidence: string;
  sourceReference: string;
  mappedControlIds: string[];
  confidenceScore: number;
}

export type ControlEffectiveness = 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Tested';
export type ControlStatus = 'Active' | 'Under Review' | 'Deprecated' | 'Draft';

export interface Control {
  id: string;
  controlCode: string;
  name: string;
  description: string;
  domain: string;
  owner: string;
  frequency: Frequency;
  effectiveness: ControlEffectiveness;
  status: ControlStatus;
  evidenceStatus: 'Evidence Available' | 'Missing Evidence' | 'Evidence Expired' | 'Insufficient';
  mappedObligationIds: string[];
  riskLevel: RiskLevel;
  testingProcedure: string;
  lastTestedDate: string;
}

export interface Mapping {
  id: string;
  obligationId: string;
  controlId: string;
  confidence: number; // 0 - 100
  coverage: 'Strong' | 'Moderate' | 'Partial' | 'Weak';
  rationale: string;
  factors: string[];
}

export type EvidenceStatus = 'Found' | 'Missing' | 'Expired' | 'Insufficient' | 'Contradictory';

export interface Evidence {
  id: string;
  controlId: string;
  controlCode?: string;
  name: string;
  type: 'Audit Report' | 'Test Result' | 'CSV Sample' | 'Policy Doc' | 'Screenshot' | 'System Log' | 'Attestation';
  uploadedAt: string;
  expiryDate: string;
  status: EvidenceStatus;
  sourceUrl?: string;
  fileSize?: string;
  evaluatorNotes: string;
  sufficiencyScore: number; // 0 - 100
}

export interface ControlTest {
  id: string;
  controlId: string;
  evidenceId: string;
  testType: 'Automated' | 'Manual Inspection' | 'Sample Audit' | 'Penetration Test';
  result: 'Test Passed' | 'Test Failed' | 'Exceptions Noted' | 'Inconclusive';
  tester: string;
  testedAt: string;
  findings: string;
}

export type GapType = 
  | 'Missing Control' 
  | 'Weak Control' 
  | 'Missing Evidence' 
  | 'Outdated Policy' 
  | 'Incorrect Applicability' 
  | 'Failed Control Test' 
  | 'Regulatory Change Not Implemented';

export interface Gap {
  id: string;
  gapCode: string; // e.g. GAP-1042
  obligationId: string;
  controlId?: string;
  regulationId: string;
  gapType: GapType;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 - 100
  riskFactors: {
    regulatorySeverity: number;
    businessImpact: number;
    customerImpact: number;
    financialImpact: number;
    legalImpact: number;
    controlWeakness: number;
  };
  owner: string;
  dueDate: string;
  status: 'Open' | 'Under Remediation' | 'In Validation' | 'Resolved' | 'Accepted Risk';
  rootCause: string;
  assessmentNotes: string;
  recommendedAction: string;
}

export interface Remediation {
  id: string;
  gapId: string;
  gapCode: string;
  title: string;
  recommendation: string;
  rootCause: string;
  controlChange: string;
  policyChange: string;
  evidenceRequirement: string;
  owner: string;
  suggestedDeadline: string;
  priority: RiskLevel;
  dependencies: string[];
  verificationCriteria: string;
  status: 'Backlog' | 'In Progress' | 'Validation' | 'Completed';
  progress: number; // 0 - 100
  approvalStatus: 'Pending Approval' | 'Approved' | 'Rejected' | 'Needs Revision';
  approvedBy?: string;
  approvedAt?: string;
  actionItems: {
    id: string;
    task: string;
    owner: string;
    deadline: string;
    completed: boolean;
  }[];
}

export interface RegulatoryChange {
  id: string;
  regulationId: string;
  regulationName: string;
  title: string;
  changeDate: string;
  effectiveDate: string;
  previousVersion: string;
  newVersion: string;
  changeSummary: string;
  impactLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  affectedObligationCount: number;
  affectedControlCount: number;
  affectedPolicyCount: number;
  affectedEvidenceCount: number;
  potentialGapsCount: number;
  diffDetails: {
    section: string;
    beforeText: string;
    afterText: string;
    diffType: 'modified' | 'added' | 'removed';
  }[];
}

export interface AgentRun {
  id: string;
  agentName: string;
  step: string;
  status: 'pending' | 'running' | 'completed' | 'warning' | 'error';
  timestamp: string;
  details: string;
  confidence?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue: string;
  newValue: string;
  agentInvolved?: string;
  status: 'Approved' | 'Executed' | 'Logged';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  actionLink?: string;
}

export interface WhatIfSimulation {
  scenarioId: string;
  scenarioTitle: string;
  description: string;
  parameterChanges: {
    parameter: string;
    oldValue: string;
    newValue: string;
  }[];
  impactResults: {
    affectedRegulations: number;
    affectedObligations: number;
    affectedControls: number;
    affectedBusinessUnits: number;
    additionalEvidenceRequired: number;
    potentialGaps: number;
    riskIncrease: 'Critical' | 'High' | 'Medium' | 'Low';
    estimatedRemediationDays: number;
  };
  nodeChain: {
    regulations: string[];
    obligations: string[];
    controls: string[];
    businessUnits: string[];
    evidenceTypes: string[];
    gaps: string[];
  };
}

export interface CrossRegMatrixItem {
  domain: string;
  regulationA: string;
  regulationB: string;
  topic: string;
  status: 'Harmonized' | 'Overlapping' | 'Divergent' | 'Contradictory';
  commonObligations: string[];
  overlappingControls: string[];
  reusableControls: string[];
  divergenceNotes: string;
}

export interface ContradictionFinding {
  id: string;
  title: string;
  regulationA: { name: string; section: string; quote: string; frequency?: string };
  regulationB: { name: string; section: string; quote: string; frequency?: string };
  classification: 
    | 'Direct Conflict' 
    | 'Conditional Difference' 
    | 'Scope Difference' 
    | 'Frequency Difference' 
    | 'Definition Difference' 
    | 'No Conflict';
  explanation: string;
  reconciliationStrategy: string;
  confidence: number;
}
