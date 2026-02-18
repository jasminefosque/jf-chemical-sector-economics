export const MethodologyPage = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Methodology</h1>
        <p className="text-slate-600">
          Technical documentation of data architecture, synthetic modeling, and implementation approach
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">Portfolio Demonstration Notice</h2>
        <p className="text-blue-800 mb-2">
          This dashboard is a <strong>portfolio demonstration project</strong> showcasing data engineering,
          TypeScript development, and React-based visualization capabilities. It uses synthetic data that
          models realistic chemical sector economic dynamics.
        </p>
        <p className="text-blue-800">
          The architecture is designed to easily swap to real open data sources when deployed in production.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. DataProvider Abstraction Pattern</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Architecture Overview</h3>
            <p className="text-slate-600 mb-3">
              The application uses an abstract <code className="bg-slate-100 px-2 py-1 rounded text-sm">DataProvider</code> interface
              that decouples UI components from data sources. This enables seamless switching between synthetic and real data.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-slate-700">
{`interface DataProvider {
  getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries>;
  getLatest(metricId: string, params?: QueryParams): Promise<number | null>;
  getMetadata(metricId: string): Promise<MetricMetadata>;
  getShockEvents(): Promise<ShockEvent[]>;
  getShockEventsByDateRange(start: string, end: string): Promise<ShockEvent[]>;
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Implementation Pattern</h3>
            <p className="text-slate-600 mb-3">
              The factory function <code className="bg-slate-100 px-2 py-1 rounded text-sm">createDataProvider()</code> selects
              the appropriate implementation based on environment configuration:
            </p>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-slate-700">
{`export function createDataProvider(): DataProvider {
  const dataMode = import.meta.env.VITE_DATA_MODE || 'synthetic';
  
  switch (dataMode) {
    case 'synthetic':
      return new SyntheticDataProvider();
    case 'open':
      return new OpenDataProvider();
    default:
      return new SyntheticDataProvider();
  }
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Benefits</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600">
              <li>UI components remain unchanged when switching data sources</li>
              <li>Easy testing with synthetic data during development</li>
              <li>Graceful migration path to production data sources</li>
              <li>Type safety enforced across all implementations</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Synthetic Industrial Cycle Modeling</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Time Series Generation</h3>
            <p className="text-slate-600 mb-3">
              Synthetic data is generated using a multi-component model that combines trend, seasonality,
              cyclical patterns, and stochastic noise to simulate realistic industrial economic behavior:
            </p>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="space-y-2 text-sm text-slate-700">
                <div><strong>Trend Component:</strong> Linear or exponential drift over time</div>
                <div><strong>Seasonal Component:</strong> Annual periodicity for cyclical industries</div>
                <div><strong>Cyclical Component:</strong> Multi-year business cycle (4-7 years)</div>
                <div><strong>Autocorrelation:</strong> Momentum and mean reversion effects</div>
                <div><strong>Volatility:</strong> Realistic random fluctuations</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Model Parameters</h3>
            <p className="text-slate-600 mb-3">
              Each metric is configured with realistic parameters based on chemical sector economics:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Parameter</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Example</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Base Value</td>
                    <td className="py-2 px-3 font-mono">70.0</td>
                    <td className="py-2 px-3">Starting point for time series</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Trend Rate</td>
                    <td className="py-2 px-3 font-mono">0.02</td>
                    <td className="py-2 px-3">Annual growth/decline rate</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Volatility</td>
                    <td className="py-2 px-3 font-mono">0.15</td>
                    <td className="py-2 px-3">Amplitude of random fluctuations</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Cycle Period</td>
                    <td className="py-2 px-3 font-mono">60 months</td>
                    <td className="py-2 px-3">Business cycle wavelength</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Value Range</td>
                    <td className="py-2 px-3 font-mono">[30, 120]</td>
                    <td className="py-2 px-3">Realistic bounds enforcement</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Cross-Metric Correlations</h3>
            <p className="text-slate-600">
              The model incorporates realistic relationships between metrics. For example:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 mt-2">
              <li>Oil and gas prices are positively correlated with input costs</li>
              <li>Rising input costs increase margin pressure</li>
              <li>High margin pressure leads to reduced capacity utilization</li>
              <li>Capacity utilization correlates with chemical output volume</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Event Injection System</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Shock Event Modeling</h3>
            <p className="text-slate-600 mb-3">
              The system supports injection of discrete shock events that create realistic disruptions
              in time series data. Events have configurable parameters:
            </p>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-slate-700">
{`interface ShockEvent {
  event_id: string;
  label: string;
  start_date: string;
  end_date?: string;
  severity: number;          // 1-5 scale
  description: string;
  affected_metrics: string[]; // Which metrics are impacted
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Event Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="border border-slate-200 rounded p-3">
                <div className="font-semibold text-slate-700 mb-1">Supply Shocks</div>
                <div className="text-sm text-slate-600">
                  Oil price spikes, natural gas disruptions, feedstock shortages
                </div>
              </div>
              <div className="border border-slate-200 rounded p-3">
                <div className="font-semibold text-slate-700 mb-1">Demand Shocks</div>
                <div className="text-sm text-slate-600">
                  Economic recessions, construction slowdowns, manufacturing declines
                </div>
              </div>
              <div className="border border-slate-200 rounded p-3">
                <div className="font-semibold text-slate-700 mb-1">Regulatory Shocks</div>
                <div className="text-sm text-slate-600">
                  New environmental regulations, compliance cost increases
                </div>
              </div>
              <div className="border border-slate-200 rounded p-3">
                <div className="font-semibold text-slate-700 mb-1">Trade Shocks</div>
                <div className="text-sm text-slate-600">
                  Tariff implementations, export restrictions, trade disputes
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Implementation</h3>
            <p className="text-slate-600">
              Shock events are applied to affected metrics during time series generation, creating
              realistic discontinuities and recovery patterns. The severity parameter scales the magnitude
              of impact, and the temporal bounds control duration.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. Schema Validation with Zod</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Type-Safe Data Contracts</h3>
            <p className="text-slate-600 mb-3">
              All data structures use Zod schemas for runtime validation and TypeScript type inference:
            </p>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-slate-700">
{`export const TimeSeriesSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  unit: z.string(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly']),
  observations: z.array(ObservationSchema),
  geography: z.string().optional(),
  sector: z.string().optional(),
  notes: z.string().optional(),
});

export type TimeSeries = z.infer<typeof TimeSeriesSchema>;`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Validation Benefits</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-600">
              <li>Runtime type checking catches data integrity issues early</li>
              <li>Automatic TypeScript type inference from schemas</li>
              <li>Self-documenting data contracts</li>
              <li>Easy schema evolution and migration</li>
              <li>Parser errors provide actionable feedback for debugging</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Swapping to Real Open Data</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Migration Strategy</h3>
            <p className="text-slate-600 mb-3">
              To transition from synthetic to real data, implement the <code className="bg-slate-100 px-2 py-1 rounded text-sm">OpenDataProvider</code> class:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600">
              <li>Identify open data sources (FRED, EIA, Census Bureau, etc.)</li>
              <li>Implement API clients for each data source</li>
              <li>Map source data to standardized <code className="bg-slate-100 px-1 rounded text-sm">TimeSeries</code> format</li>
              <li>Implement the <code className="bg-slate-100 px-1 rounded text-sm">DataProvider</code> interface methods</li>
              <li>Set environment variable: <code className="bg-slate-100 px-1 rounded text-sm">VITE_DATA_MODE=open</code></li>
              <li>UI components automatically use real data—no code changes needed</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Recommended Open Data Sources</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Metric Category</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Data Source</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">API</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Oil & Gas Prices</td>
                    <td className="py-2 px-3">U.S. Energy Information Admin</td>
                    <td className="py-2 px-3 font-mono text-xs">EIA API</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Capacity Utilization</td>
                    <td className="py-2 px-3">Federal Reserve (FRED)</td>
                    <td className="py-2 px-3 font-mono text-xs">FRED API</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Industrial Production</td>
                    <td className="py-2 px-3">Federal Reserve (FRED)</td>
                    <td className="py-2 px-3 font-mono text-xs">FRED API</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Trade Data</td>
                    <td className="py-2 px-3">U.S. Census Bureau</td>
                    <td className="py-2 px-3 font-mono text-xs">Census API</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-2 px-3">Manufacturing Data</td>
                    <td className="py-2 px-3">Bureau of Economic Analysis</td>
                    <td className="py-2 px-3 font-mono text-xs">BEA API</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Example Implementation Stub</h3>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-slate-700">
{`export class OpenDataProvider implements DataProvider {
  async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
    // Map metric ID to data source
    const source = this.getSourceForMetric(metricId);
    
    // Fetch from API (FRED, EIA, etc.)
    const rawData = await source.fetch(metricId, params);
    
    // Transform to TimeSeries schema
    return this.transformToTimeSeries(rawData, metricId);
  }
  
  // Implement other interface methods...
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Technology Stack</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">Frontend</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><strong>React 19.2.0</strong> — UI framework</li>
              <li><strong>TypeScript 5.7.3</strong> — Type safety</li>
              <li><strong>Vite 6.0.11</strong> — Build tool</li>
              <li><strong>Tailwind CSS 4.1.18</strong> — Styling</li>
              <li><strong>Recharts 3.7.0</strong> — Charting library</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3">State & Data</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><strong>Zustand 5.0.11</strong> — State management</li>
              <li><strong>Zod 3.24.1</strong> — Schema validation</li>
              <li><strong>html-to-image 1.11.11</strong> — Chart export</li>
              <li><strong>date-fns 4.1.0</strong> — Date utilities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-green-900 mb-2">Developer Notes</h3>
        <p className="text-sm text-green-800">
          This architecture demonstrates best practices for building data-driven dashboards with TypeScript.
          The abstraction layers enable rapid prototyping with synthetic data while maintaining a clear path
          to production deployment with real data sources. All components are type-safe, tested, and follow
          modern React patterns.
        </p>
      </div>
    </div>
  );
};
