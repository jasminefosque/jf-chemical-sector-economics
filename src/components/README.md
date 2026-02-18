# React Component Layer - Chemical Sector Economics Dashboard

This directory contains the complete React component library for the Chemical Sector Economics dashboard.

## Component Structure

```
src/components/
├── layout/              # Layout components
│   ├── Header.tsx       # Top navigation header
│   ├── Sidebar.tsx      # Left navigation sidebar
│   └── MethodologyDrawer.tsx  # Right methodology panel
├── charts/              # Chart components
│   ├── ChartWrapper.tsx     # Reusable chart container
│   ├── TimeSeriesChart.tsx  # Line/area charts
│   ├── DualAxisChart.tsx    # Two Y-axis charts
│   └── CompositeChart.tsx   # Combined line/bar charts
├── KPICard.tsx          # KPI display card
├── Controls.tsx         # Filter controls panel
├── ShockEventModal.tsx  # Shock event detail modal
└── ErrorBoundary.tsx    # Error boundary component
```

## Component Documentation

### Layout Components

#### Header
Top header bar with application title and methodology toggle.

```tsx
import { Header } from './components/layout';

<Header />
```

**Features:**
- Application title "Chemical Sector Economics"
- Portfolio mode badge
- Methodology drawer toggle button

#### Sidebar
Left navigation panel for different dashboard sections.

```tsx
import { Sidebar } from './components/layout';

<Sidebar />
```

**Features:**
- Navigation items: Overview, Price Indices, Production & Capacity, Energy Economics, Trade Flows, Shock Events
- Active item highlighting
- Responsive hover states

#### MethodologyDrawer
Right-side drawer explaining data architecture and methodology.

```tsx
import { MethodologyDrawer } from './components/layout';

<MethodologyDrawer />
```

**Features:**
- Data architecture explanation
- Metric category descriptions
- Shock event documentation
- Data export information
- Closes on backdrop click

### Common Components

#### KPICard
Display component for key performance indicators.

```tsx
import { KPICard } from './components';

<KPICard
  label="Capacity Utilization"
  value={87.3}
  unit="%"
  change={2.5}
  changeLabel="vs previous period"
  description="Chemical sector capacity utilization rate"
/>
```

**Props:**
- `label: string` - KPI label
- `value: string | number` - Current value
- `unit?: string` - Unit of measurement
- `change?: number` - Percentage change
- `changeLabel?: string` - Change period description
- `description?: string` - Tooltip description

**Features:**
- Color-coded change indicators (green/red)
- Optional info tooltip
- Formatted large numbers

#### Controls
Filter controls panel for date range, geography, and shock overlay.

```tsx
import { Controls } from './components';

<Controls />
```

**Features:**
- Date range picker (start/end dates)
- Geography selector (US, EU, CN, Global)
- Shock events toggle switch
- Reset filters button
- Uses `useDashboardStore` for state management

#### ShockEventModal
Modal dialog displaying detailed shock event information.

```tsx
import { ShockEventModal } from './components';

<ShockEventModal />
```

**Features:**
- Triggered by clicking shock markers on charts
- Displays event title, severity, dates, description
- Shows affected metrics
- Auto-loads event data from data provider
- Closes on backdrop or close button click

#### ErrorBoundary
React error boundary for graceful error handling.

```tsx
import { ErrorBoundary } from './components';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Features:**
- Catches React component errors
- Displays user-friendly error message
- Shows error details in collapsible section
- Refresh page button
- Custom fallback support

### Chart Components

#### ChartWrapper
Reusable wrapper providing export and metadata for all charts.

```tsx
import { ChartWrapper } from './components/charts';

<ChartWrapper
  title="Production Index"
  description="Monthly chemical production index"
  data={chartData}
  sourceNote="Synthetic Data - Portfolio Mode"
>
  {/* Chart content */}
</ChartWrapper>
```

**Props:**
- `title: string` - Chart title
- `description?: string` - Tooltip description
- `children: ReactNode` - Chart content
- `data?: unknown[]` - Data for JSON export
- `sourceNote?: string` - Source attribution

**Features:**
- Export as PNG button
- Download data as JSON button
- Info tooltip for chart description
- Source note footer
- Professional styling

#### TimeSeriesChart
Line or area chart for time series data.

```tsx
import { TimeSeriesChart } from './components/charts';

<TimeSeriesChart
  title="Natural Gas Price"
  description="Monthly natural gas spot price"
  data={seriesData}
  xKey="date"
  yKeys={[
    { key: 'price', label: 'Price', color: '#2563eb' }
  ]}
  chartType="line"
  showGrid={true}
  showLegend={true}
  shockMarkers={shockEvents}
/>
```

**Props:**
- `title: string` - Chart title
- `description?: string` - Chart description
- `data: Array<Record<string, unknown>>` - Chart data
- `xKey: string` - X-axis data key
- `yKeys: Array<{ key: string; label: string; color?: string }>` - Y-axis series
- `chartType?: 'line' | 'area'` - Chart type (default: 'line')
- `showGrid?: boolean` - Show grid lines (default: true)
- `showLegend?: boolean` - Show legend (default: true)
- `shockMarkers?: Array<{ date: string; label: string; id: string }>` - Shock events

**Features:**
- Multiple series support
- Responsive container
- Formatted date tooltips
- Clickable shock event markers
- Default color palette

#### DualAxisChart
Chart with two Y-axes for comparing metrics with different scales.

```tsx
import { DualAxisChart } from './components/charts';

<DualAxisChart
  title="Price vs Volume"
  description="Price and production volume comparison"
  data={chartData}
  xKey="date"
  leftAxis={{ key: 'price', label: 'Price ($)', color: '#2563eb' }}
  rightAxis={{ key: 'volume', label: 'Volume (units)', color: '#7c3aed' }}
  showGrid={true}
  shockMarkers={shockEvents}
/>
```

**Props:**
- `title: string` - Chart title
- `description?: string` - Chart description
- `data: Array<Record<string, unknown>>` - Chart data
- `xKey: string` - X-axis data key
- `leftAxis: { key: string; label: string; color?: string }` - Left Y-axis config
- `rightAxis: { key: string; label: string; color?: string }` - Right Y-axis config
- `showGrid?: boolean` - Show grid lines
- `shockMarkers?: Array<{ date: string; label: string; id: string }>` - Shock events

**Features:**
- Two independent Y-axes
- Color-coded axes and series
- Axis labels with rotation
- Responsive layout

#### CompositeChart
Combined line and bar chart for multi-type visualizations.

```tsx
import { CompositeChart } from './components/charts';

<CompositeChart
  title="Production & Utilization"
  description="Production volume (bars) and utilization rate (line)"
  data={chartData}
  xKey="date"
  series={[
    { key: 'production', label: 'Production', type: 'bar', color: '#2563eb' },
    { key: 'utilization', label: 'Utilization %', type: 'line', color: '#7c3aed', yAxisId: 'right' }
  ]}
  showGrid={true}
  shockMarkers={shockEvents}
/>
```

**Props:**
- `title: string` - Chart title
- `description?: string` - Chart description
- `data: Array<Record<string, unknown>>` - Chart data
- `xKey: string` - X-axis data key
- `series: DataSeries[]` - Array of series configurations
  - `key: string` - Data key
  - `label: string` - Series label
  - `type: 'line' | 'bar'` - Chart type
  - `color?: string` - Series color
  - `yAxisId?: 'left' | 'right'` - Y-axis assignment
- `showGrid?: boolean` - Show grid lines
- `shockMarkers?: Array<{ date: string; label: string; id: string }>` - Shock events

**Features:**
- Mix line and bar charts
- Dual Y-axes support
- Flexible series configuration
- Bar opacity for readability

## State Management

Components use Zustand store via `useDashboardStore` hook:

```tsx
import { useDashboardStore } from '../app/store';

const Component = () => {
  const { startDate, endDate, setDateRange } = useDashboardStore();
  // ...
};
```

**Available State:**
- `startDate`, `endDate` - Date range
- `geography` - Selected geography
- `showShockOverlay` - Shock events visibility
- `selectedShockId` - Active shock event
- `methodologyOpen` - Methodology drawer state

## Data Integration

Components use the data provider factory pattern:

```tsx
import { createDataProvider } from '../data/dataProviderFactory';

const provider = createDataProvider();
const series = await provider.getSeries('crude_oil_price');
```

The factory automatically selects the data provider based on `VITE_DATA_MODE`:
- `synthetic` - SyntheticDataProvider (default)
- `open` - OpenDataProvider (not implemented)

## Styling

All components use Tailwind CSS with an industrial color scheme:

**Primary Colors:**
- Slate (`slate-*`) - Backgrounds, borders, text
- Blue (`blue-*`) - Primary actions, highlights
- Red (`red-*`) - Alerts, negative changes
- Green (`green-*`) - Positive changes

**Design Principles:**
- Clean, professional appearance
- Consistent spacing and typography
- Subtle shadows and borders
- Responsive hover states
- Accessible color contrast

## Dependencies

- **React 19.2.0** - UI framework
- **Recharts 3.7.0** - Charting library
- **Tailwind CSS 4.1.18** - Styling
- **Zustand 5.0.11** - State management
- **html-to-image** - PNG export functionality

## Usage Examples

### Complete Dashboard Layout

```tsx
import {
  Header,
  Sidebar,
  MethodologyDrawer,
  Controls,
  KPICard,
  TimeSeriesChart,
  ShockEventModal,
  ErrorBoundary,
} from './components';

function Dashboard() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <KPICard label="Current Price" value={75.3} unit="$/bbl" change={2.1} />
              {/* More KPI cards */}
            </div>
            <Controls />
            <TimeSeriesChart
              title="Price Trends"
              data={data}
              xKey="date"
              yKeys={[{ key: 'price', label: 'Price' }]}
            />
          </main>
        </div>
        <MethodologyDrawer />
        <ShockEventModal />
      </div>
    </ErrorBoundary>
  );
}
```

## Testing

Components are designed with testability in mind:

- Pure functional components where possible
- Props-based configuration
- Separated state management
- Error boundaries for fault isolation

## Performance Considerations

- Chart data memoization recommended for large datasets
- Lazy loading for modal components
- Virtual scrolling for large lists (future enhancement)
- PNG export uses high-quality settings (2x pixel ratio)

## Accessibility

Components follow accessibility best practices:

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## Future Enhancements

Potential improvements:

- [ ] Dark mode support
- [ ] Chart zoom and pan interactions
- [ ] Data table view toggle
- [ ] Advanced filtering options
- [ ] Real-time data updates
- [ ] Export to PDF
- [ ] Print-optimized layouts
- [ ] Customizable color themes
