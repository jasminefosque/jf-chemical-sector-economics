import { useDashboardStore } from '../../app/store';

export const Header = () => {
  const toggleMethodology = useDashboardStore((state) => state.toggleMethodology);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-industrial-900 text-white shadow-lg h-16">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold tracking-tight">
            Chemical Sector Economics
          </h1>
          <span className="text-xs bg-industrial-800 px-2 py-1 rounded text-industrial-300">
            Portfolio Mode
          </span>
        </div>
        
        <button
          onClick={toggleMethodology}
          className="flex items-center space-x-2 px-4 py-2 bg-industrial-800 hover:bg-industrial-700 rounded transition-colors text-sm"
          aria-label="Toggle methodology drawer"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Methodology</span>
        </button>
      </div>
    </header>
  );
};

