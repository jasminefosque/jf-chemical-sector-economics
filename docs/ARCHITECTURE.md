# Architecture Documentation

This document explains the technical architecture of the Chemical Sector Economics Dashboard, including design patterns, data generation logic, and how to extend or modify the system.

---

## Table of Contents

1. [Overview](#overview)
2. [DataProvider Pattern](#dataprovider-pattern)
3. [Synthetic Data Generation](#synthetic-data-generation)
4. [Event Injection System](#event-injection-system)
5. [Chart System Architecture](#chart-system-architecture)
6. [Export System](#export-system)
7. [State Management](#state-management)
8. [Component Structure](#component-structure)
9. [Swapping to Real Open Data](#swapping-to-real-open-data)
10. [Performance Considerations](#performance-considerations)

---

## Overview

The dashboard is built with a **clean architecture** approach that separates concerns and enables easy swapping of data sources. The key design principles are:

- **Abstraction:** UI components are decoupled from data source implementation
- **Type Safety:** TypeScript and Zod ensure runtime and compile-time correctness
- **Modularity:** Each metric has its own generator and configuration
- **Testability:** Pure functions for data generation enable easy unit testing
- **Extensibility:** Adding new metrics requires minimal changes

### Technology Stack

- **React 19** - UI framework with modern concurrent features
- **TypeScript** - Type safety and developer experience
- **Zustand** - Lightweight state management
- **Recharts** - Declarative charting library
- **Zod** - Runtime schema validation
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first styling

---

## DataProvider Pattern

### Interface Design

The core abstraction is the `DataProvider` interface, which defines a contract for data access:

```typescript
interface DataProvider {
  getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries>;
  getLatest(metricId: string, params?: QueryParams): Promise<number | null>;
  getMetadata(metricId: string): Promise<MetricMetadata>;
  getShockEvents(): Promise<ShockEvent[]>;
  getShockEventsByDateRange(startDate: string, endDate: string): Promise<ShockEvent[]>;
}
```

**Benefits:**
- UI components call generic methods, unaware of data source
- Implementations can be swapped via configuration
- Async interface supports both sync (synthetic) and async (API) sources
- Type-safe parameters and return values

### Factory Pattern

The `dataProviderFactory.ts` creates the appropriate implementation:

```typescript
export function createDataProvider(): DataProvider {
  const dataMode = import.meta.env.VITE_DATA_MODE || 'synthetic';
  
  switch (dataMode) {
    case 'synthetic':
      return new SyntheticDataProvider();
    case 'open':
      return new OpenDataProvider();
    default:
      return new SyntheticDataProvider();
  }
}
```

**Configuration:**
- Set via `.env` file: `VITE_DATA_MODE=synthetic` or `VITE_DATA_MODE=open`
- Default: `synthetic` for portfolio demonstration
- No code changes needed to switch modes

### Current Implementations

#### SyntheticDataProvider
- **Purpose:** Generate realistic synthetic data for portfolio demonstration
- **Location:** `src/data/adapters/SyntheticDataProvider.ts`
- **Features:**
  - In-memory data generation
  - Deterministic (same inputs = same outputs)
  - Caching for performance
  - Zod validation
  - Full shock event support

#### OpenDataProvider (Stub)
- **Purpose:** Connect to real open data sources (not yet implemented)
- **Location:** `src/data/adapters/OpenDataProvider.ts`
- **Status:** Placeholder returning empty data
- **TODO:** Implement API integrations (see [Swapping to Real Open Data](#swapping-to-real-open-data))

---

## Synthetic Data Generation

### Time Series Model

The synthetic data generator uses a **multi-component additive model** that combines:

```
Value(t) = Baseline + Trend(t) + Seasonal(t) + Cycle(t) + Noise(t) + Shock(t)
```

**Components:**

1. **Baseline:** Central value for the metric
2. **Trend:** Linear or exponential drift over time
3. **Seasonal:** Annual periodicity (for seasonal metrics like natural gas)
4. **Cycle:** Business cycle component (typically 4-7 year period)
5. **Noise:** Autocorrelated random fluctuations
6. **Shock:** Event-driven deviations

### Generator Functions

Each metric has a dedicated generator function in `src/data/synthetic/generators.ts`:

```typescript
export function generateCrudeOilPrice(dates: string[]): Observation[] {
  const noise = generateNoise(5);  // $5 volatility
  const baseline = 75;             // $75/barrel baseline
  
  return dates.map((date, i) => {
    let value = baseline;
    
    // Long-term cycle (4-year cycle)
    value += cyclicalPattern(i, 48, 15);
    
    // Short-term volatility cycle
    value += cyclicalPattern(i, 12, 8, Math.PI / 4);
    
    // Autocorrelated noise
    value += noise();
    
    // Shock events
    const shock = getActiveShock(date, 'crude_oil_price');
    if (shock) {
      const shockImpact = (shock.severity / 5) * 25; // Up to $25 spike
      value += shockImpact;
    }
    
    return { date, value: Math.max(30, value) }; // Floor at $30
  });
}
```

### Noise Generation with Autocorrelation

Realistic noise exhibits **momentum** (autocorrelation):

```typescript
function generateNoise(amplitude: number, persistence: number = 0.7): () => number {
  let previousNoise = 0;
  
  return () => {
    const newNoise = (Math.random() - 0.5) * 2 * amplitude;
    const noise = persistence * previousNoise + (1 - persistence) * newNoise;
    previousNoise = noise;
    return noise;
  };
}
```

- **Persistence = 0.7:** 70% of previous noise carries forward
- **Effect:** Creates realistic momentum and mean reversion
- **Prevents:** Unrealistic jagged time series

### Cyclical Pattern Modeling

Business cycles are modeled with sinusoidal functions:

```typescript
function cyclicalPattern(
  t: number,        // Time index
  period: number,   // Cycle length (e.g., 48 months)
  amplitude: number,// Cycle magnitude
  phase: number = 0 // Phase shift
): number {
  return amplitude * Math.sin((2 * Math.PI * t) / period + phase);
}
```

**Example Cycles:**
- **4-year business cycle:** `period = 48` months
- **Seasonal (annual):** `period = 12` months
- **Long construction cycle:** `period = 60` months (5 years)

### Industrial Cycle Characteristics

Different metrics model different economic patterns:

| Metric Type | Trend | Cycle Period | Volatility | Shock Response |
|-------------|-------|--------------|------------|----------------|
| Energy Prices | Flat | 4 years | High | Very High |
| Production Indices | Growth | 4 years | Low | Medium |
| Demand Indices | Growth | 4 years | Medium | High |
| Regulatory Costs | Growth | None | Low | Step Changes |
| Trade Ratios | Slow Growth | None | Very Low | Low |

### Date Generation

Time series dates are generated with configurable frequency:

```typescript
export function generateDates(
  startDate: string,
  endDate: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    
    // Increment based on frequency
    switch (frequency) {
      case 'daily': current.setDate(current.getDate() + 1); break;
      case 'weekly': current.setDate(current.getDate() + 7); break;
      case 'monthly': current.setMonth(current.getMonth() + 1); break;
      case 'quarterly': current.setMonth(current.getMonth() + 3); break;
    }
  }
  
  return dates;
}
```

---

## Event Injection System

### Shock Event Model

Shock events represent real-world disruptions (geopolitical events, policy changes, demand shocks):

```typescript
interface ShockEvent {
  event_id: string;
  label: string;
  start_date: string;
  end_date: string;
  severity: number;  // 1-5 scale
  description: string;
  affected_metrics: string[];
}
```

### Predefined Events

Seven shock events are defined in `src/data/synthetic/shockEvents.ts`:

1. **Oil Price Spike (2023 Q1)** - Severity 4
   - Geopolitical tensions drive crude oil up 35%
   - Affects: crude oil, input costs, margin pressure

2. **Feedstock Disruption (2023 Q2)** - Severity 3
   - Natural gas supply chain disruption
   - Affects: natural gas, feedstock spread, capacity utilization

3. **Regulatory Tightening (2023 Q3-2024 Q4)** - Severity 3
   - New emissions standards
   - Affects: environmental costs, regulatory intensity, margins

4. **Manufacturing Slowdown (2023 Q4-2024 Q1)** - Severity 4
   - Global PMI contraction
   - Affects: manufacturing demand, chemical output, capacity

5. **Trade Restrictions (2024 Q1-Q2)** - Severity 2
   - New export tariffs
   - Affects: export dependency, global demand

6. **Demand Recovery (2024 Q2-Q3)** - Severity 2 (positive)
   - Construction and auto sector rebound
   - Affects: construction demand, auto production, manufacturing

7. **Natural Gas Crisis (2024 Q3-Q4)** - Severity 5
   - Winter supply concerns
   - Affects: natural gas, input costs, margin pressure, capacity

### Shock Impact Calculation

During data generation, shocks apply scaled impacts:

```typescript
const shock = getActiveShock(date, metricId);
if (shock) {
  const impact = (shock.severity / 5) * maxImpact;
  value += impact;  // Or subtract for negative shocks
}
```

**Severity scaling:**
- Severity 1: 20% of max impact
- Severity 3: 60% of max impact
- Severity 5: 100% of max impact

**Temporal behavior:**
- Impact active between `start_date` and `end_date`
- Instant onset (could be enhanced with ramp-up/down)
- Multiple shocks can overlap (cumulative effects)

### Extending Shock Events

To add new events, edit `src/data/synthetic/shockEvents.ts`:

```typescript
export const SHOCK_EVENTS: ShockEvent[] = [
  // ... existing events
  {
    event_id: 'new_event_2025',
    label: 'Your Event Name',
    start_date: '2025-01-01',
    end_date: '2025-06-30',
    severity: 3,
    description: 'Description of the event',
    affected_metrics: ['metric_id_1', 'metric_id_2'],
  },
];
```

---

## Chart System Architecture

### ChartWrapper Component

All charts are wrapped in `ChartWrapper` which provides:
- Consistent styling and layout
- Title and description
- Export functionality (PNG, JSON)
- Source attribution
- Error boundaries

```typescript
<ChartWrapper
  title="Crude Oil Price Trends"
  description="WTI spot prices with geopolitical shocks"
  data={timeSeriesData}
  sourceNote="Synthetic Data - Portfolio Mode"
>
  <LineChart data={timeSeriesData} ... />
</ChartWrapper>
```

### Chart Types

Built on **Recharts** library with custom configurations:

1. **TimeSeriesChart** - Line charts for single metric over time
2. **DualAxisChart** - Compare two metrics with different units
3. **AreaChart** - Stacked or single area visualizations
4. **BarChart** - Comparative metrics or categorical data
5. **CompositeChart** - Combined line/bar/area for complex views

### Responsive Design

Charts adapt to container width using Recharts' responsive container:

```typescript
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={data}>
    {/* Chart configuration */}
  </LineChart>
</ResponsiveContainer>
```

### Shock Event Overlays

When `showShockOverlay` is enabled (via Zustand store):
- Vertical bars or background shading indicate shock periods
- Color intensity reflects severity
- Tooltips show event descriptions
- Click to open detailed event modal

---

## Export System

### PNG Export

Uses `html-to-image` library to capture chart DOM as PNG:

```typescript
const handleExportPNG = async () => {
  if (!chartRef.current) return;
  
  try {
    const dataUrl = await toPng(chartRef.current, {
      quality: 1.0,
      pixelRatio: 2,  // 2x resolution for retina displays
    });
    
    const link = document.createElement('a');
    link.download = `${title}_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export chart as PNG:', error);
  }
};
```

**Features:**
- High quality (pixelRatio: 2)
- Timestamped filenames
- Includes title, chart, and source note
- Works in all modern browsers

### JSON Export

Exports raw data for external analysis:

```typescript
const handleDownloadJSON = () => {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = `${title}_${Date.now()}.json`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);  // Clean up
};
```

**Data format:**
```json
[
  { "date": "2022-01-01", "value": 75.3 },
  { "date": "2022-02-01", "value": 78.1 },
  ...
]
```

---

## State Management

### Zustand Store

Centralized state in `src/app/store.ts`:

```typescript
interface DashboardState {
  // Date range filtering
  startDate: string;
  endDate: string;
  setDateRange: (start: string, end: string) => void;
  
  // Geography selection
  geography: string;
  setGeography: (geography: string) => void;
  
  // UI toggles
  showShockOverlay: boolean;
  toggleShockOverlay: () => void;
  
  // Modal state
  selectedShockId: string | null;
  setSelectedShock: (id: string | null) => void;
  
  methodologyOpen: boolean;
  toggleMethodology: () => void;
  
  // Reset
  resetFilters: () => void;
}
```

**Why Zustand?**
- **Minimal boilerplate:** No providers or reducers
- **TypeScript-first:** Excellent type inference
- **Performance:** Selective subscriptions prevent unnecessary re-renders
- **DevTools:** Redux DevTools integration available
- **Lightweight:** ~1KB gzipped

### Usage in Components

```typescript
function Controls() {
  const { startDate, endDate, setDateRange } = useDashboardStore();
  
  return (
    <input
      type="date"
      value={startDate}
      onChange={(e) => setDateRange(e.target.value, endDate)}
    />
  );
}
```

### State Persistence

Currently in-memory only. To add persistence:

```typescript
import { persist } from 'zustand/middleware';

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({ /* state */ }),
    {
      name: 'dashboard-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

---

## Component Structure

### Layered Architecture

```
src/
├── app/              # Application-level setup
│   └── store.ts      # Zustand state management
├── components/       # Reusable UI components
│   ├── layout/       # Header, Sidebar, Footer
│   ├── charts/       # Chart wrappers and configurations
│   ├── Controls.tsx  # Filter controls
│   ├── KPICard.tsx   # Metric summary cards
│   └── ShockEventModal.tsx
├── pages/            # Page-level components
│   ├── DashboardPage.tsx
│   └── MethodologyPage.tsx
├── data/             # Data layer
│   ├── DataProvider.ts          # Abstract interface
│   ├── dataProviderFactory.ts   # Factory pattern
│   ├── adapters/
│   │   ├── SyntheticDataProvider.ts
│   │   └── OpenDataProvider.ts
│   └── synthetic/
│       ├── metricDefinitions.ts  # Metric metadata
│       ├── generators.ts         # Data generation logic
│       └── shockEvents.ts        # Event definitions
├── models/           # TypeScript types and Zod schemas
│   └── schemas.ts
├── hooks/            # Custom React hooks
└── lib/              # Utility functions
```

### Component Design Principles

1. **Single Responsibility:** Each component has one clear purpose
2. **Composition:** Build complex UIs from simple components
3. **Props Drilling Prevention:** Use Zustand for shared state
4. **Type Safety:** All components fully typed with TypeScript
5. **Error Boundaries:** Wrap chart components to handle failures gracefully

### Adding New Pages

1. Create component in `src/pages/`
2. Add route if using routing library
3. Import and use in `App.tsx`
4. Update navigation in `Sidebar.tsx`

---

## Swapping to Real Open Data

### Step 1: Implement OpenDataProvider

Edit `src/data/adapters/OpenDataProvider.ts`:

```typescript
export class OpenDataProvider implements DataProvider {
  private apiClient: ApiClient;  // Your HTTP client
  
  constructor() {
    this.apiClient = new ApiClient({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      apiKey: import.meta.env.VITE_API_KEY,  // If needed
    });
  }
  
  async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
    // Map internal metric IDs to external API endpoints
    const endpoint = this.getEndpoint(metricId);
    
    // Fetch from external API
    const response = await this.apiClient.get(endpoint, {
      start: params?.start_date,
      end: params?.end_date,
    });
    
    // Transform to internal TimeSeries format
    return this.transformResponse(metricId, response);
  }
  
  private getEndpoint(metricId: string): string {
    // Map metric IDs to API endpoints
    const endpointMap: Record<string, string> = {
      'crude_oil_price': '/eia/petroleum/crude-wti',
      'natural_gas_price': '/eia/natural-gas/henry-hub',
      'capacity_utilization_percent': '/fred/series/CAPUTLG327S',
      // ... more mappings
    };
    
    return endpointMap[metricId] || '';
  }
  
  private transformResponse(metricId: string, response: any): TimeSeries {
    // Transform external API format to internal TimeSeries schema
    // Apply Zod validation
    return TimeSeriesSchema.parse({
      metric_id: metricId,
      label: response.series_name,
      unit: response.unit,
      frequency: response.frequency,
      observations: response.data.map((d: any) => ({
        date: d.date,
        value: parseFloat(d.value),
      })),
      notes: `Source: ${response.source}`,
    });
  }
}
```

### Step 2: Configure API Credentials

Add to `.env`:

```bash
VITE_DATA_MODE=open
VITE_API_BASE_URL=https://api.eia.gov/v2
VITE_EIA_API_KEY=your_eia_api_key_here
VITE_FRED_API_KEY=your_fred_api_key_here
```

**Security Note:** See [docs/SECURITY.md](./SECURITY.md) for credential management best practices.

### Step 3: Update Environment Variables

Edit `.env.example` to document new variables:

```bash
# Data Mode
VITE_DATA_MODE=open

# API Configuration
VITE_API_BASE_URL=https://api.example.com
VITE_EIA_API_KEY=
VITE_FRED_API_KEY=
```

### Step 4: Handle API Rate Limits

Implement caching and request throttling:

```typescript
class OpenDataProvider implements DataProvider {
  private cache = new Map<string, { data: TimeSeries; expiry: number }>();
  private readonly cacheTTL = 3600000; // 1 hour
  
  async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
    const cacheKey = `${metricId}_${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    
    const data = await this.fetchFromAPI(metricId, params);
    this.cache.set(cacheKey, { data, expiry: Date.now() + this.cacheTTL });
    
    return data;
  }
}
```

### Step 5: Metric Mapping Strategy

Create a mapping file for metric ID → API endpoint conversions:

```typescript
// src/data/adapters/metricMapping.ts
export const METRIC_API_MAPPING = {
  // Energy Prices
  crude_oil_price: {
    source: 'EIA',
    series: 'PET.RWTC.M',
    transform: (val: number) => val,  // Direct USD/barrel
  },
  natural_gas_price: {
    source: 'EIA',
    series: 'NG.RNGWHHD.M',
    transform: (val: number) => val,  // Direct USD/MMBtu
  },
  
  // Federal Reserve Data
  capacity_utilization_percent: {
    source: 'FRED',
    series: 'CAPUTLG327S',
    transform: (val: number) => val,  // Already percentage
  },
  
  // Derived/Composite Metrics
  feedstock_spread_index: {
    source: 'COMPUTED',
    dependencies: ['crude_oil_price', 'chemical_output_index'],
    compute: (crude: number, output: number) => {
      // Custom computation logic
      return (output / crude) * 100;
    },
  },
};
```

### Recommended Open Data Sources

| Metric Category | Source | API | License |
|-----------------|--------|-----|---------|
| Energy Prices | EIA | [EIA API](https://www.eia.gov/opendata/) | Public Domain |
| Economic Indicators | FRED | [FRED API](https://fred.stlouisfed.org/docs/api/fred/) | Public Domain |
| Production Indices | Federal Reserve | [FRB API](https://www.federalreserve.gov/datadownload/) | Public Domain |
| Trade Data | Census Bureau | [Census API](https://www.census.gov/data/developers.html) | Public Domain |
| Global Data | World Bank | [World Bank API](https://datahelpdesk.worldbank.org/knowledgebase/topics/125589) | Open License |

---

## Performance Considerations

### Data Caching

Both synthetic and open data providers implement caching:

```typescript
private cache = new Map<string, TimeSeries>();

async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
  const cacheKey = `${metricId}_${JSON.stringify(params)}`;
  
  if (this.cache.has(cacheKey)) {
    return this.cache.get(cacheKey)!;
  }
  
  const data = await this.generateData(metricId, params);
  this.cache.set(cacheKey, data);
  return data;
}
```

**Benefits:**
- Avoid regenerating synthetic data
- Reduce API calls for open data mode
- Instant response for repeated queries

**Limitations:**
- Memory usage grows with unique queries
- No cache invalidation (restart to clear)
- Consider LRU cache for production

### React Optimization

- **Memoization:** Use `useMemo` for expensive computations
- **Component splitting:** Lazy load pages with `React.lazy()`
- **Virtual scrolling:** For long lists (if added)
- **Debounced filters:** Prevent excessive re-queries during typing

### Bundle Size

Current production build: ~200KB gzipped

**Optimization opportunities:**
- Code splitting by route
- Tree-shaking unused Recharts components
- CDN for heavy dependencies

---

## Testing Strategy

### Unit Tests (Recommended)

```typescript
// generators.test.ts
describe('generateCrudeOilPrice', () => {
  it('should generate values within expected range', () => {
    const dates = generateDates('2022-01-01', '2022-12-31', 'monthly');
    const series = generateCrudeOilPrice(dates);
    
    series.forEach(obs => {
      expect(obs.value).toBeGreaterThanOrEqual(30);
      expect(obs.value).toBeLessThanOrEqual(120);
    });
  });
  
  it('should respond to shock events', () => {
    const dates = ['2023-02-01']; // During oil spike shock
    const series = generateCrudeOilPrice(dates);
    const baselineSeries = generateCrudeOilPrice(['2022-01-01']);
    
    expect(series[0].value).toBeGreaterThan(baselineSeries[0].value);
  });
});
```

### Integration Tests

Test the full data flow:
1. Factory creates provider
2. Provider returns valid schema
3. Components render without errors
4. Exports work correctly

---

## Future Enhancements

### Potential Improvements

1. **Real-time updates:** WebSocket support for live data
2. **Advanced shock modeling:** Gradual onset/decay, contagion effects
3. **Scenario analysis:** User-defined "what-if" scenarios
4. **Forecasting:** Time series forecasting models (ARIMA, Prophet)
5. **Correlation analysis:** Interactive correlation matrix
6. **Custom metrics:** User-defined metric formulas
7. **Data quality indicators:** Confidence intervals, data freshness
8. **Internationalization:** Multi-language support
9. **Accessibility:** WCAG 2.1 AA compliance for charts
10. **Mobile optimization:** Touch-friendly chart interactions

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01 | Initial architecture documentation |
