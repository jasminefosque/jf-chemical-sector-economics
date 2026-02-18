import { useDashboardStore } from '../../app/store';

export const Header = () => {
  const toggleMethodology = useDashboardStore((state) => state.toggleMethodology);

  return (
    <header className="bg-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Chemical Sector Economics
          </h1>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded text-slate-300">
            Portfolio Mode
          </span>
        </div>
        
        <button
          onClick={toggleMethodology}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
          aria-label="Toggle methodology drawer"
        >
          <svg
            className="w-5 h-5"
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
          <span className="text-sm">Methodology</span>
        </button>
      </div>
    </header>
  );
};
