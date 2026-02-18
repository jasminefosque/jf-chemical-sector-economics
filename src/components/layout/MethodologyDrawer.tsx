import { useDashboardStore } from '../../app/store';

export const MethodologyDrawer = () => {
  const { methodologyOpen, toggleMethodology } = useDashboardStore();

  if (!methodologyOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={toggleMethodology}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Methodology</h2>
          <button
            onClick={toggleMethodology}
            className="p-1 hover:bg-slate-700 rounded transition-colors"
            aria-label="Close methodology drawer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 text-slate-700">
          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Data Architecture
            </h3>
            <p className="text-sm leading-relaxed mb-2">
              This dashboard operates in <strong>Portfolio Mode</strong>, utilizing
              synthetic data generated to demonstrate the analytical framework.
            </p>
            <p className="text-sm leading-relaxed">
              The architecture supports two operational modes:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Portfolio Mode:</strong> Synthetic data with simulated market dynamics</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Open Data Mode:</strong> Integration with public data sources (FRED, EIA, etc.)</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Metric Categories
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="font-medium text-slate-700">Price Indices</h4>
                <p className="text-slate-600 mt-1">
                  Producer price indices for key chemical products normalized to base period.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-700">Production & Capacity</h4>
                <p className="text-slate-600 mt-1">
                  Utilization rates and output volumes for chemical manufacturing facilities.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-slate-700">Energy Economics</h4>
                <p className="text-slate-600 mt-1">
                  Natural gas prices and energy cost impacts on chemical production.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Shock Events
            </h3>
            <p className="text-sm leading-relaxed">
              External shocks are annotated as vertical markers on time series charts.
              Each shock event includes severity classification (1-5), affected metrics,
              and duration. Click on markers to view detailed event information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Data Export
            </h3>
            <p className="text-sm leading-relaxed">
              All visualizations support export to PNG for presentation purposes
              and JSON for data analysis. Exported data reflects currently applied
              filters and visible time range.
            </p>
          </section>

          <section className="border-t border-slate-200 pt-4">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Technical Notes
            </h3>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Data frequency varies by metric (daily, weekly, monthly, quarterly)</li>
              <li>• All monetary values in nominal USD unless otherwise specified</li>
              <li>• Geographic scope: US market with selected international comparisons</li>
              <li>• Synthetic data generated with realistic correlations and volatility</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};
