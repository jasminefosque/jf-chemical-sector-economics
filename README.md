# Chemical Sector Economics Dashboard

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> **Portfolio Demonstration Project** — This dashboard showcases advanced data architecture, TypeScript development, and React visualization capabilities using synthetic industrial economics data. It demonstrates enterprise-level software engineering patterns without exposing proprietary data or production infrastructure.

![Dashboard Screenshot](https://github.com/user-attachments/assets/7143729c-2d1f-4bcb-a4f7-7cd4070bef57)

*Dashboard showing Industrial Stress Composite, Oil & Natural Gas Prices with shock event markers, and Capacity Utilization trends*

---

## 📋 Table of Contents

- [Overview](#overview)
- [Portfolio Statement](#portfolio-statement)
- [Architecture](#architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Modes](#data-modes)
- [Documentation](#documentation)
- [Customization](#customization)
- [License](#license)

---

## 🎯 Overview

The **Chemical Sector Economics Dashboard** is a comprehensive data visualization platform for tracking and analyzing key economic indicators in the chemical manufacturing industry. It provides:

- **20+ Economic Metrics** across upstream inputs, production capacity, demand indicators, trade exposure, and regulatory pressures
- **Interactive Visualizations** with time series charts, dual-axis comparisons, and shock event overlays
- **Synthetic Industrial Cycle Modeling** that realistically simulates business cycles, seasonality, and economic shocks
- **Clean Architecture** with abstraction patterns enabling seamless data source switching
- **Export Capabilities** for charts (PNG) and raw data (JSON)
- **Responsive Design** optimized for desktop and tablet viewing

---

## 💼 Portfolio Statement

### Purpose

This project is a **portfolio demonstration** showcasing:

✅ **Software Engineering Skills:**
- TypeScript development with advanced type safety
- React 19 with modern patterns (hooks, composition, error boundaries)
- Clean architecture and abstraction (DataProvider pattern)
- State management with Zustand
- Data modeling and synthetic generation algorithms

✅ **Data Engineering Capabilities:**
- Time series generation with realistic industrial cycles
- Multi-component additive modeling (trend + seasonality + cycles + noise)
- Event injection systems for shock scenario modeling
- Data validation with Zod schemas

✅ **Domain Knowledge:**
- Understanding of chemical sector economics
- Industrial cycle dynamics and correlations
- Supply chain and market structure modeling
- Regulatory and environmental cost factors

### What This Is NOT

❌ A production data pipeline  
❌ A real-time analytics system  
❌ Connected to any proprietary data sources  
❌ Specific to any employer or client  

### Architecture Demonstration

This project demonstrates **transferable architecture patterns** applicable across industries:
- The DataProvider abstraction works for finance, energy, healthcare, retail, etc.
- Synthetic data generation adapts to any time series domain
- Chart system extends to any visualization needs
- Component architecture scales to complex dashboards

**The skills demonstrated here apply broadly to data-intensive web applications.**

---

## 🏗️ Architecture

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              UI Layer (Components)                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐ │ │
│  │  │ Controls │  │ KPI Cards│  │ Charts (Recharts)    │ │ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↕                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         State Management (Zustand)                     │ │
│  │  • Date Range  • Geography  • Shock Overlays          │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↕                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         DataProvider Interface (Abstract)              │ │
│  │  getSeries() • getLatest() • getMetadata() • etc.     │ │
│  └────────────────────────────────────────────────────────┘ │
│         ↙                                      ↘             │
│  ┌──────────────────┐                  ┌─────────────────┐  │
│  │ Synthetic        │                  │ Open Data       │  │
│  │ DataProvider     │                  │ DataProvider    │  │
│  │                  │                  │ (stub)          │  │
│  │ • Generators     │                  │ • API clients   │  │
│  │ • Shock Events   │                  │ • Transforms    │  │
│  │ • Caching        │                  │ • Rate Limits   │  │
│  └──────────────────┘                  └─────────────────┘  │
│         ↓                                      ↓             │
│  ┌──────────────────┐                  ┌─────────────────┐  │
│  │ In-Memory        │                  │ External APIs   │  │
│  │ Generation       │                  │ (EIA, FRED,     │  │
│  │ (Algorithms)     │                  │  Census, etc.)  │  │
│  └──────────────────┘                  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Patterns

**1. DataProvider Abstraction**
- UI components depend on interface, not implementation
- Swap data sources via environment variable
- Supports sync (synthetic) and async (API) sources

**2. Factory Pattern**
- `createDataProvider()` instantiates correct implementation
- Configuration-driven, no code changes needed

**3. Synthetic Data Generation**
- Multi-component additive model: Baseline + Trend + Seasonal + Cycle + Noise + Shocks
- Autocorrelated noise for realistic momentum
- Shock events inject realistic disruptions

**4. Component Composition**
- Small, single-responsibility components
- ChartWrapper provides consistent export/styling
- Layout components separate structure from content

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed technical documentation.

---

## ✨ Features

### 📊 Comprehensive Metrics

**20 economic indicators** across 6 categories:

| Category | Metrics | Description |
|----------|---------|-------------|
| **Upstream Inputs** | 3 | Crude oil, natural gas, feedstock spreads |
| **Cost Structure** | 2 | Input costs, margin pressure |
| **Capacity & Production** | 3 | Utilization, industrial/chemical output |
| **Downstream Demand** | 4 | Manufacturing, construction, auto, semiconductor |
| **Trade Exposure** | 3 | Export/import dependency, global demand |
| **Regulatory Pressure** | 3 | Environmental costs, compliance burden |
| **Composite** | 1 | Industrial stress composite |

See [docs/METRICS.md](./docs/METRICS.md) for complete metric documentation.

### 📈 Interactive Visualizations

- **Time Series Charts** - Track metrics over 3-year period (2022-2025)
- **Dual-Axis Charts** - Compare metrics with different units
- **Shock Event Overlays** - Visualize 7 predefined economic shocks
- **Responsive Design** - Adapts to screen size
- **Export to PNG** - High-quality chart images (2x retina resolution)
- **Export to JSON** - Raw data for external analysis

### 🎭 Realistic Synthetic Data

- **Business Cycles** - 4-7 year economic cycles
- **Seasonality** - Annual patterns (e.g., winter natural gas peaks)
- **Autocorrelation** - Momentum and mean reversion
- **Shock Events** - Geopolitical, regulatory, demand disruptions
- **Bounded Ranges** - All values within realistic industry ranges
- **Validated** - Zod schema validation for data integrity

### 🔄 Data Mode Flexibility

- **Synthetic Mode (Default)** - No external dependencies, perfect for portfolio
- **Open Mode (Extensible)** - Stub for real API integration
- **Easy Switching** - Change via environment variable

### 🛡️ Security & Clean Code

- **Zero Secrets** - No API keys, tokens, or credentials in code
- **No Production Endpoints** - Completely safe for public portfolio
- **Type-Safe** - Full TypeScript coverage with strict mode
- **Validated** - Runtime schema validation with Zod
- **Clean Git History** - No sensitive data ever committed

---

## 🚀 Technology Stack

### Core Framework
- **[React 19](https://react.dev/)** - Modern UI library with concurrent features
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite 7](https://vitejs.dev/)** - Fast build tool and dev server

### State & Data
- **[Zustand 5](https://zustand-demo.pmnd.rs/)** - Lightweight state management (1KB)
- **[Zod 4](https://zod.dev/)** - Runtime schema validation
- **Custom DataProvider** - Abstraction pattern for data sources

### Visualization
- **[Recharts 3](https://recharts.org/)** - Declarative React charting
- **[html-to-image](https://github.com/bubkoo/html-to-image)** - PNG export

### Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **Custom Design System** - Consistent colors, spacing, typography

### Code Quality
- **[ESLint](https://eslint.org/)** - Linting with TypeScript rules
- **[TypeScript ESLint](https://typescript-eslint.io/)** - TypeScript-specific linting

---

## 🎬 Getting Started

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jf-chemical-sector-economics.git
   cd jf-chemical-sector-economics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   cp .env.example .env
   # Edit .env if needed (defaults work for portfolio mode)
   ```

### Running the Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Build output in `dist/` directory, ready for deployment to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📁 Project Structure

```
jf-chemical-sector-economics/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Application setup
│   │   └── store.ts         # Zustand state management
│   ├── components/          # Reusable UI components
│   │   ├── layout/          # Header, Sidebar, Footer
│   │   ├── charts/          # Chart wrappers and configs
│   │   ├── Controls.tsx     # Filter controls
│   │   ├── KPICard.tsx      # Metric summary cards
│   │   └── ShockEventModal.tsx
│   ├── pages/               # Page-level components
│   │   ├── DashboardPage.tsx
│   │   └── MethodologyPage.tsx
│   ├── data/                # Data layer (core abstraction)
│   │   ├── DataProvider.ts           # Abstract interface
│   │   ├── dataProviderFactory.ts    # Factory pattern
│   │   ├── adapters/
│   │   │   ├── SyntheticDataProvider.ts  # Synthetic mode
│   │   │   └── OpenDataProvider.ts       # Open mode (stub)
│   │   └── synthetic/
│   │       ├── metricDefinitions.ts      # Metric metadata
│   │       ├── generators.ts             # Data generation
│   │       └── shockEvents.ts            # Shock scenarios
│   ├── models/              # TypeScript types & Zod schemas
│   │   └── schemas.ts
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── styles/              # Global styles
│   ├── App.tsx              # Root component
│   └── main.tsx             # Application entry point
├── docs/                    # Documentation
│   ├── METRICS.md           # Metric documentation
│   ├── ARCHITECTURE.md      # Technical architecture
│   └── SECURITY.md          # Security approach
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── LICENSE                  # MIT License
└── README.md                # This file
```

---

## 🔧 Data Modes

### Synthetic Mode (Default)

**Configuration:**
```bash
# .env
VITE_DATA_MODE=synthetic
```

**Characteristics:**
- ✅ No external API calls
- ✅ Deterministic data generation
- ✅ 20 metrics, 3 years, monthly frequency
- ✅ 7 predefined shock events
- ✅ Realistic industrial cycle modeling
- ✅ Perfect for portfolio demonstration

**Use Cases:**
- Portfolio demonstration
- Development and testing
- Training and education
- Offline work

### Open Data Mode (Requires Implementation)

**Configuration:**
```bash
# .env
VITE_DATA_MODE=open
VITE_API_BASE_URL=https://api.example.com
VITE_API_KEY=your_key_here
```

**Status:** Currently a stub returning empty data

**To Implement:**
1. Edit `src/data/adapters/OpenDataProvider.ts`
2. Add API client for data sources (EIA, FRED, Census, etc.)
3. Map internal metric IDs to external APIs
4. Transform responses to internal `TimeSeries` schema
5. Implement caching and rate limiting
6. Test thoroughly

See [docs/ARCHITECTURE.md#swapping-to-real-open-data](./docs/ARCHITECTURE.md#swapping-to-real-open-data) for implementation guide.

### Recommended Public Data Sources

| Source | API | Metrics Available | License |
|--------|-----|-------------------|---------|
| EIA | [API Docs](https://www.eia.gov/opendata/) | Energy prices, production | Public Domain |
| FRED | [API Docs](https://fred.stlouisfed.org/docs/api/fred/) | Economic indicators, indices | Public Domain |
| Census | [API Docs](https://www.census.gov/data/developers.html) | Trade data, manufacturing | Public Domain |
| World Bank | [API Docs](https://datahelpdesk.worldbank.org/knowledgebase/topics/125589) | Global indicators | Open License |

---

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

### [METRICS.md](./docs/METRICS.md)
- Complete metric catalog (20 metrics)
- Expected value ranges
- Use cases and applications
- Modeling approaches
- Metric relationships and correlations
- Real data source recommendations

### [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- DataProvider pattern deep dive
- Synthetic data generation algorithms
- Shock event injection system
- Chart system architecture
- Export system (PNG/JSON)
- State management with Zustand
- Component structure
- Migration to real open data
- Performance optimization

### [SECURITY.md](./docs/SECURITY.md)
- Zero secrets policy
- Portfolio protection strategy
- Production deployment considerations
- Environment variable best practices
- Dependency security
- Compliance notes (GDPR, licensing)
- Incident response procedures

---

## 🎨 Customization

### Adding a New Metric

1. **Define metadata** in `src/data/synthetic/metricDefinitions.ts`:
   ```typescript
   export const METRIC_DEFINITIONS = {
     // ...existing metrics
     new_metric_id: {
       metric_id: 'new_metric_id',
       label: 'New Metric',
       unit: 'Units',
       description: 'What this metric measures',
       category: 'Category Name',
       value_range: [min, max],
     },
   };
   ```

2. **Create generator** in `src/data/synthetic/generators.ts`:
   ```typescript
   export function generateNewMetric(dates: string[]): Observation[] {
     const noise = generateNoise(amplitude);
     const baseline = 100;
     
     return dates.map((date, i) => {
       let value = baseline;
       value += cyclicalPattern(i, period, amplitude);
       value += noise();
       return { date, value };
     });
   }
   ```

3. **Register generator** in `SyntheticDataProvider.ts`:
   ```typescript
   private generateObservations(metricId: string, dates: string[]) {
     const generators = {
       // ...existing generators
       new_metric_id: generateNewMetric,
     };
     // ...
   }
   ```

4. **Add to dashboard** - Create new chart component or add to existing page

### Customizing for Another Industry

This architecture adapts to any industry domain:

**Example: Retail Economics Dashboard**

1. Replace metric definitions:
   - `crude_oil_price` → `consumer_spending_index`
   - `capacity_utilization` → `inventory_turnover`
   - etc.

2. Adjust cycle periods:
   - Retail has seasonal cycles (holiday shopping)
   - Shorter business cycles than chemicals

3. Define industry-specific shocks:
   - E-commerce disruption
   - Supply chain crisis
   - Consumer confidence shifts

4. Update branding and terminology

**The DataProvider pattern, generator functions, and chart system remain unchanged.**

### Theming

Edit `tailwind.config.js` for color scheme:
```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: { /* your colors */ },
        secondary: { /* your colors */ },
      },
    },
  },
};
```

---

## 📸 Screenshots

> **Note:** Add screenshots of your deployed dashboard here

### Main Dashboard
![Dashboard Overview](docs/screenshot-placeholder.png)

### Shock Event Visualization
![Shock Events](docs/screenshot-placeholder.png)

### Methodology Documentation
![Methodology Page](docs/screenshot-placeholder.png)

---

## 🧪 Environment Variables

Configuration via `.env` file (copy from `.env.example`):

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_DATA_MODE` | `synthetic` | Data source mode: `synthetic` or `open` |
| `VITE_API_BASE_URL` | - | Base URL for external APIs (open mode) |
| `VITE_API_KEY` | - | API key for external services (if required) |

**Security:** Never commit `.env` file. Use `.env.example` for documentation only.

---

## 🤝 Contributing

This is a portfolio project, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
MIT License

Copyright (c) 2026 Jasmine Fosque

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

**TLDR:** You can freely use, modify, and distribute this code. Just include the original copyright notice.

---

## 🙏 Acknowledgments

- **Data Sources Inspiration:** EIA, FRED, Census Bureau (for open data mode design)
- **Visualization:** Recharts team for excellent React chart library
- **Frameworks:** React, TypeScript, Vite, Zustand, Tailwind CSS teams

---

## 📬 Contact

**Project Author:** Jasmine Fosque

**Portfolio:** This project is a demonstration of software engineering capabilities

**Questions?** Review documentation in `docs/` directory or open an issue

---

## 🗺️ Roadmap

Future enhancements (if continuing development):

- [ ] Real-time data updates via WebSocket
- [ ] Advanced shock scenario builder (user-defined events)
- [ ] Time series forecasting (ARIMA, Prophet)
- [ ] Correlation matrix visualization
- [ ] Multi-geography support (EU, Asia, etc.)
- [ ] Mobile-optimized responsive design
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] Unit and integration test suite
- [ ] Performance monitoring and analytics
- [ ] Custom metric formula builder

---

**Built with TypeScript, React, and a focus on clean architecture. Demonstrates enterprise-level software engineering for data-intensive applications.**
