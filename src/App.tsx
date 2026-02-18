import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MethodologyDrawer } from './components/layout/MethodologyDrawer';
import { Controls } from './components/Controls';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useDashboardStore } from './app/store';

// Pages
import {
  OverviewPage,
  UpstreamInputsPage,
  CostStructurePage,
  CapacityProductionPage,
  DownstreamDemandPage,
  TradeExposurePage,
  RegulatoryPressurePage,
  MethodologyPage,
} from './pages';

export type PageView =
  | 'overview'
  | 'upstream'
  | 'cost'
  | 'capacity'
  | 'demand'
  | 'trade'
  | 'regulatory'
  | 'methodology';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('overview');
  const methodologyOpen = useDashboardStore((state) => state.methodologyOpen);

  const renderPage = () => {
    switch (currentPage) {
      case 'overview':
        return <OverviewPage />;
      case 'upstream':
        return <UpstreamInputsPage />;
      case 'cost':
        return <CostStructurePage />;
      case 'capacity':
        return <CapacityProductionPage />;
      case 'demand':
        return <DownstreamDemandPage />;
      case 'trade':
        return <TradeExposurePage />;
      case 'regulatory':
        return <RegulatoryPressurePage />;
      case 'methodology':
        return <MethodologyPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex pt-16">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
          <div className="p-6">
            <Controls />
            <ErrorBoundary>
              <div className="mt-6">{renderPage()}</div>
            </ErrorBoundary>
          </div>
        </main>
      </div>
      {methodologyOpen && <MethodologyDrawer />}
    </div>
  );
}

export default App;
