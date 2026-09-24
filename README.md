# ReguLens AI

> **"Turn regulations into actionable controls."**  
> *Agentic Regulatory Intelligence & Control Assurance Platform*

---

### Synthetic Demo Data Disclaimer
> **Prototype using synthetic data. Not legal or regulatory advice.**  
> Designed for enterprise banking compliance evaluation and hackathon demonstration.

---

## 1. Product Vision & Architecture

**ReguLens AI** is an agentic, AI-powered banking regulatory compliance and control assessment platform. It autonomously monitors changing regulations, decomposes them into atomic obligations, maps obligations against internal bank policies and controls, audits evidence records, prioritizes compliance gaps using multi-factor explainable risk scoring, and synthesizes actionable remediation plans with human-in-the-loop approvals.

### The Unbroken Traceability Chain
The core differentiator of ReguLens AI is its end-to-end, tamper-evident traceability chain:
$$\text{Regulations} \longrightarrow \text{Obligations} \longrightarrow \text{Applicability} \longrightarrow \text{Controls} \longrightarrow \text{Evidence} \longrightarrow \text{Testing} \longrightarrow \text{Gaps} \longrightarrow \text{Risk} \longrightarrow \text{Remediation} \longrightarrow \text{Audit Log}$$

Every AI conclusion is traceable to exact source gazette sections, internal control identifiers, and timestamped reviewer actions.

---

## 2. Multi-Agent Cognitive Architecture

ReguLens AI features **11 specialized autonomous agents**:

| Agent | Name | Role & Output |
|---|---|---|
| **Agent 1** | **Regulatory Intelligence Agent** | Scrapes official gazettes, identifies regulator, jurisdiction, publication date, version changes, and detects textual diffs. |
| **Agent 2** | **Obligation Extraction Agent** | Converts legal circular text into structured, atomic obligations with cadence, risk rating, and required evidence. |
| **Agent 3** | **Applicability Agent** | Assesses applicability across banking legal entities, retail vs wholesale products, and cross-border operations. |
| **Agent 4** | **Control Framework Agent** | Understands internal bank policies, SOPs, control owners, frequencies, and maintains the active control inventory. |
| **Agent 5** | **Control Mapping Agent** | Binds obligations to internal controls using confidence scoring (0-100%) and coverage analysis. |
| **Agent 6** | **Evidence Assessment Agent** | Audits evidence files (audit reports, CSV samples, system logs) for sufficiency, expiration, and contradictions. |
| **Agent 7** | **Control Effectiveness Agent** | Evaluates design and operating effectiveness using historical test runs and exception logs. |
| **Agent 8** | **Gap Analysis Agent** | Detects discrepancies (Missing Control, Weak Control, Cadence Mismatch, Expired Evidence) and assigns unique `GAP-` IDs. |
| **Agent 9** | **Risk Prioritization Agent** | Calculates multi-factor GRC risk scores based on regulatory severity, business impact, legal exposure, and control weakness. |
| **Agent 10** | **Remediation Agent** | Formulates step-by-step remediation plans with control adjustments, policy updates, and owner deadlines. |
| **Agent 11** | **Regulatory Impact Agent** | Simulates the downstream blast radius of regulatory updates across obligations, controls, and existing gaps. |

---

## 3. Implemented Capabilities (14/14)

1. **Regulatory Intelligence & Knowledge Ingestion**: Version-tracked gazette directory with source text viewers and multi-jurisdictional tagging (RBI, Basel III, FATF, DPDP, DORA).
2. **Regulatory Change Intelligence**: Timeline with before/after diffs highlighting added, removed, and modified clauses.
3. **Regulatory Obligation Extraction**: 43 structured obligations extracted with frequency, owner, and required evidence.
4. **Bank Control-Framework Understanding**: 32 internal bank controls across AML, Cybersecurity, Credit Operations, Treasury, and Privacy.
5. **Regulatory-to-Control Mapping**: Semantic coverage scoring with explainability factors and confidence percentages.
6. **Control Effectiveness Assessment**: Design and operating evaluation (Effective, Partially Effective, Ineffective, Not Tested).
7. **Evidence-Based Compliance Assessment**: Status audit (Found, Missing, Expired, Insufficient, Contradictory) with evaluator notes.
8. **Gap Identification**: Unique GAP IDs (e.g. `GAP-1042`, `GAP-1024`, `GAP-1015`) with root-cause diagnosis.
9. **Risk-Based Gap Prioritization**: Multi-factor breakdown (Regulatory severity, Business impact, Customer harm, Financial penalty, Legal liability, Control weakness).
10. **Remediation Recommendation Engine**: Action plans, milestones, verification criteria, and GRC Kanban workflow.
11. **Autonomous Regulatory Impact Analysis**: 1-click agent cascade runner with live step-by-step telemetry.
12. **What-If Simulation Engine**: Interactive hypothesis modeling (e.g. Annual to Quarterly frequency shift) with cascade dependency graph.
13. **Cross-Regulation Intelligence**: Matrix harmonizing RBI KYC, FATF Rec 16, DPDP, Basel III, and DORA with 100% control reuse discovery.
14. **Regulatory Contradiction Detection**: Classifier distinguishing Direct Conflicts from Conditional, Frequency, and Scope Differences with citations.

---

## 4. Key Hackathon Demo Scenario: "Quarterly Customer Risk Review Change"

The pre-configured 3–5 minute demonstration illustrates a real-world compliance crisis and autonomous resolution:

1. **Baseline**: Existing control `AML-C-023` performs Customer Risk Categorization **Annually**.
2. **Regulatory Update**: RBI issues Master Direction KYC v4.2 Section 12.4 shortening the review cadence from Annual to **Quarterly for High-Risk customers**.
3. **Change Detection**: Regulatory Intelligence Agent flags textual amendment with highlighted diffs.
4. **Autonomous Impact Analysis**: Multi-agent swarm detects affected obligations (`OBL-001`) and control (`AML-C-023`).
5. **Cadence Discrepancy**: Annual control fails the quarterly mandate; evidence `EVD-0092` evaluated as **Insufficient**.
6. **Gap Prioritization**: Gap Analysis Agent creates **`GAP-1042`** with Risk Score **92/100 (Critical)**.
7. **Remediation Synthesis**: Remediation Agent generates **`REM-001`** to reconfigure batch scheduler and update AML Policy Section 4.2.
8. **Human-in-the-Loop Approval**: Chief Compliance Officer approves recommendation, recording the decision in the immutable audit log.
9. **Simulation & Traceability**: Verification of the unbroken chain and updated executive dashboard metrics.

---

## 5. Technology Stack

- **Frontend**: React 18, TypeScript (Strict Mode), Vite, Tailwind CSS, Lucide Icons, Recharts
- **Design System**: Enterprise Dark Navy / Charcoal palette (`#0a0f1d`, `#0f172a`, `#1e293b`), crisp typography (`Inter`, `JetBrains Mono`), glassmorphic cards
- **AI Abstraction Layer**: `AIProvider` extensible interface with deterministic banking intelligence engine
- **State & Store**: React Context store with live event streaming, persona switcher, notifications, and immutable audit logging

---

## 6. How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

The application will be live at `http://127.0.0.1:5173/`.
