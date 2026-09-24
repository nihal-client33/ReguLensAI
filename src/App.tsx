import React from 'react';
import { ComplianceProvider, useComplianceStore } from './services/store/complianceStore';
import { Banner } from './components/layout/Banner';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CopilotDrawer } from './components/copilot/CopilotDrawer';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { DocumentUploadModal } from './components/upload/DocumentUploadModal';
import { AuditTrailModal } from './components/audit/AuditTrailModal';
import { GuidedDemoModal } from './components/demo/GuidedDemoModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RegulationsPage } from './pages/RegulationsPage';
import { ObligationsPage } from './pages/ObligationsPage';
import { ControlsPage } from './pages/ControlsPage';
import { EvidencePage } from './pages/EvidencePage';
import { ComplianceMapPage } from './pages/ComplianceMapPage';
import { GapsPage } from './pages/GapsPage';
import { RemediationPage } from './pages/RemediationPage';
import { RegulatoryChangePage } from './pages/RegulatoryChangePage';
import { SimulationPage } from './pages/SimulationPage';
import { CrossRegulationPage } from './pages/CrossRegulationPage';
import { AgentsPage } from './pages/AgentsPage';

const AppContent: React.FC = () => {
  const { activePage } = useComplianceStore();

  const renderActivePage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'regulations':
        return <RegulationsPage />;
      case 'obligations':
        return <ObligationsPage />;
      case 'controls':
        return <ControlsPage />;
      case 'evidence':
        return <EvidencePage />;
      case 'compliance-map':
        return <ComplianceMapPage />;
      case 'gaps':
        return <GapsPage />;
      case 'remediation':
        return <RemediationPage />;
      case 'changes':
        return <RegulatoryChangePage />;
      case 'simulation':
        return <SimulationPage />;
      case 'cross-regulation':
        return <CrossRegulationPage />;
      case 'agents':
        return <AgentsPage />;
      default:
        return <DashboardPage />;
    }
  };

  const isLanding = activePage === 'landing';

  return (
    <div className="min-h-screen bg-[#0a0f1d] flex flex-col font-sans text-slate-100">
      {/* Banner */}
      <Banner />

      {/* Navbar */}
      <Navbar />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar (shown on all application views except landing) */}
        {!isLanding && <Sidebar />}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Modals & Drawers */}
      <CopilotDrawer />
      <GlobalSearchModal />
      <DocumentUploadModal />
      <AuditTrailModal />
      <GuidedDemoModal />
    </div>
  );
};

export function App() {
  return (
    <ComplianceProvider>
      <AppContent />
    </ComplianceProvider>
  );
}

export default App;
