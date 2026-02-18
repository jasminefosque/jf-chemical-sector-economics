# Component Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Chemical Sector Economics                   │
│                         Dashboard Application                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         LAYOUT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐       │
│  │  Header.tsx                                          │       │
│  │  - App Title  - Portfolio Badge  - Methodology Btn  │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌─────────────┬──────────────────────────────┬────────────┐   │
│  │ Sidebar.tsx │      Main Content Area       │ Methodology│   │
│  │             │                              │ Drawer.tsx │   │
│  │ - Overview  │  ┌────────────────────────┐  │            │   │
│  │ - Prices    │  │   COMMON COMPONENTS    │  │ - Data Arch│   │
│  │ - Production│  │                        │  │ - Metrics  │   │
│  │ - Energy    │  │  ┌──────────────────┐  │  │ - Shocks   │   │
│  │ - Trade     │  │  │   Controls.tsx   │  │  │ - Export   │   │
│  │ - Shocks    │  │  │  - Date Range    │  │  │            │   │
│  │             │  │  │  - Geography     │  │  │            │   │
│  │             │  │  │  - Shock Toggle  │  │  │            │   │
│  │             │  │  │  - Reset         │  │  │            │   │
│  │             │  │  └──────────────────┘  │  │            │   │
│  │             │  │                        │  │            │   │
│  │             │  │  ┌─────┬─────┬─────┐  │  │            │   │
│  │             │  │  │ KPI │ KPI │ KPI │  │  │            │   │
│  │             │  │  │Card │Card │Card │  │  │            │   │
│  │             │  │  └─────┴─────┴─────┘  │  │            │   │
│  │             │  │                        │  │            │   │
│  │             │  │  CHART COMPONENTS      │  │            │   │
│  │             │  │  ┌──────────────────┐  │  │            │   │
│  │             │  │  │ ChartWrapper     │  │  │            │   │
│  │             │  │  │  ┌────────────┐  │  │  │            │   │
│  │             │  │  │  │TimeSeries  │  │  │  │            │   │
│  │             │  │  │  │   Chart    │  │  │  │            │   │
│  │             │  │  │  └────────────┘  │  │  │            │   │
│  │             │  │  │  [PNG] [JSON]    │  │  │            │   │
│  │             │  │  └──────────────────┘  │  │            │   │
│  │             │  │  ┌──────────────────┐  │  │            │   │
│  │             │  │  │ ChartWrapper     │  │  │            │   │
│  │             │  │  │  ┌────────────┐  │  │  │            │   │
│  │             │  │  │  │ DualAxis   │  │  │  │            │   │
│  │             │  │  │  │   Chart    │  │  │  │            │   │
│  │             │  │  │  └────────────┘  │  │  │            │   │
│  │             │  │  │  [PNG] [JSON]    │  │  │            │   │
│  │             │  │  └──────────────────┘  │  │            │   │
│  │             │  │  ┌──────────────────┐  │  │            │   │
│  │             │  │  │ ChartWrapper     │  │  │            │   │
│  │             │  │  │  ┌────────────┐  │  │  │            │   │
│  │             │  │  │  │ Composite  │  │  │  │            │   │
│  │             │  │  │  │   Chart    │  │  │  │            │   │
│  │             │  │  │  └────────────┘  │  │  │            │   │
│  │             │  │  │  [PNG] [JSON]    │  │  │            │   │
│  │             │  │  └──────────────────┘  │  │            │   │
│  │             │  └────────────────────────┘  │            │   │
│  └─────────────┴──────────────────────────────┴────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        MODAL LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐      │
│  │         ShockEventModal.tsx                           │      │
│  │  ┌─────────────────────────────────────────────────┐  │      │
│  │  │  Event: Oil Price Spike         [X]            │  │      │
│  │  │  ┌──────────────────────────────────────────┐   │  │      │
│  │  │  │  Severity: Critical                      │   │  │      │
│  │  │  │  Date: 2023-01-15 to 2023-03-15         │   │  │      │
│  │  │  │  Description: Major supply disruption...│   │  │      │
│  │  │  │  Affected Metrics: [crude_oil] [gas]    │   │  │      │
│  │  │  └──────────────────────────────────────────┘   │  │      │
│  │  │                                  [Close]         │  │      │
│  │  └─────────────────────────────────────────────────┘  │      │
│  └───────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     ERROR BOUNDARY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  ErrorBoundary.tsx - Wraps all components for error handling    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                            │
├─────────────────────────────────────────────────────────────────┤
│  Zustand Store (useDashboardStore)                              │
│  - startDate, endDate                                           │
│  - geography                                                    │
│  - showShockOverlay                                             │
│  - selectedShockId                                              │
│  - methodologyOpen                                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      DATA INTEGRATION                            │
├─────────────────────────────────────────────────────────────────┤
│  createDataProvider()                                           │
│    ├─ SyntheticDataProvider (Portfolio Mode)                   │
│    └─ OpenDataProvider (Future)                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        LIBRARIES                                 │
├─────────────────────────────────────────────────────────────────┤
│  - React 19.2.0         - UI Framework                          │
│  - Recharts 3.7.0       - Charts                                │
│  - Tailwind CSS 4.1.18  - Styling                               │
│  - Zustand 5.0.11       - State                                 │
│  - html-to-image        - Export                                │
└─────────────────────────────────────────────────────────────────┘

DATA FLOW:
──────────

User Interaction
       ↓
   Component
       ↓
  Store Update (Zustand)
       ↓
   Re-render Components
       ↓
  Data Provider Request
       ↓
  Synthetic/Open Data
       ↓
  Chart Rendering (Recharts)
       ↓
   Display to User

EXPORT FLOW:
────────────

Chart Component
       ↓
   ChartWrapper
       ↓
  [PNG] → html-to-image → Download
  [JSON] → JSON.stringify → Download
```

## Component Relationships

### Parent-Child Hierarchy

```
ErrorBoundary
└── App
    ├── Header
    ├── Sidebar
    ├── Main
    │   ├── Controls
    │   ├── KPICard (multiple)
    │   └── Charts
    │       ├── TimeSeriesChart
    │       │   └── ChartWrapper
    │       ├── DualAxisChart
    │       │   └── ChartWrapper
    │       └── CompositeChart
    │           └── ChartWrapper
    ├── MethodologyDrawer
    └── ShockEventModal
```

### State Flow

```
useDashboardStore (Zustand)
    ├── Header ← methodologyOpen, toggleMethodology
    ├── Controls ← all filters, setters
    ├── Charts ← dateRange, showShockOverlay, setSelectedShock
    ├── MethodologyDrawer ← methodologyOpen, toggleMethodology
    └── ShockEventModal ← selectedShockId, setSelectedShock
```

### Data Provider Flow

```
createDataProvider()
    │
    ├── SyntheticDataProvider
    │   ├── getSeries() → Components
    │   ├── getLatest() → KPICard
    │   ├── getMetadata() → ChartWrapper
    │   └── getShockEvents() → ShockEventModal
    │
    └── OpenDataProvider (Stub)
        └── Future implementation
```

## Color Scheme

```
Industrial Palette:
─────────────────

Background:
- slate-50  : #f8fafc (main background)
- slate-100 : #f1f5f9 (sidebar)
- white     : #ffffff (cards)

Borders:
- slate-200 : #e2e8f0 (light borders)
- slate-300 : #cbd5e1 (medium borders)

Text:
- slate-800 : #1e293b (headers)
- slate-700 : #334155 (body)
- slate-600 : #475569 (labels)
- slate-500 : #64748b (muted)

Actions:
- blue-600  : #2563eb (primary)
- blue-700  : #1d4ed8 (primary hover)

Indicators:
- green-600 : #16a34a (positive)
- red-600   : #dc2626 (negative)
- red-400   : #f87171 (alerts)

Charts:
- blue-600    : #2563eb
- violet-600  : #7c3aed
- pink-600    : #db2777
- emerald-600 : #059669
- amber-600   : #d97706
```
