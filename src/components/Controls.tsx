import { useDashboardStore } from '../app/store';

const GEOGRAPHIES = [
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'European Union' },
  { value: 'CN', label: 'China' },
  { value: 'GLOBAL', label: 'Global' },
];

export const Controls = () => {
  const {
    startDate,
    endDate,
    setDateRange,
    geography,
    setGeography,
    showShockOverlay,
    toggleShockOverlay,
    resetFilters,
  } = useDashboardStore();

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
        Filters & Controls
      </h3>

      <div className="space-y-4">
        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="start-date"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setDateRange(e.target.value, endDate)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="end-date"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              End Date
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setDateRange(startDate, e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Geography Selector */}
        <div>
          <label
            htmlFor="geography"
            className="block text-xs font-medium text-slate-600 mb-1"
          >
            Geography
          </label>
          <select
            id="geography"
            value={geography}
            onChange={(e) => setGeography(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {GEOGRAPHIES.map((geo) => (
              <option key={geo.value} value={geo.value}>
                {geo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Shock Overlay Toggle */}
        <div className="flex items-center justify-between pt-2">
          <label htmlFor="shock-overlay" className="text-sm text-slate-700">
            Show Shock Events
          </label>
          <button
            id="shock-overlay"
            onClick={toggleShockOverlay}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showShockOverlay ? 'bg-blue-600' : 'bg-slate-300'
            }`}
            role="switch"
            aria-checked={showShockOverlay}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showShockOverlay ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Reset Button */}
        <div className="pt-2">
          <button
            onClick={resetFilters}
            className="w-full px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
