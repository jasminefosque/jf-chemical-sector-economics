# Metrics Documentation

This document provides comprehensive information about all metrics tracked in the Chemical Sector Economics Dashboard.

## Overview

The dashboard tracks **20 metrics** across 6 categories that model the chemical manufacturing sector's economic dynamics. All metrics are designed to represent realistic industrial economic behavior patterns.

---

## Metric Categories

1. [Upstream Inputs](#upstream-inputs) - Feedstock and energy costs
2. [Cost Structure](#cost-structure) - Operating cost pressures
3. [Capacity and Production](#capacity-and-production) - Output and utilization
4. [Downstream Demand](#downstream-demand) - Customer sector indicators
5. [Trade Exposure](#trade-exposure) - International market dynamics
6. [Regulatory Pressure](#regulatory-pressure) - Compliance and environmental costs
7. [Composite Indicators](#composite-indicators) - Multi-factor stress measures

---

## Upstream Inputs

### Crude Oil Price
- **Metric ID:** `crude_oil_price`
- **Unit:** USD/barrel
- **Expected Range:** 30 - 120
- **Description:** West Texas Intermediate (WTI) crude oil spot price, primary feedstock cost driver for petrochemical production
- **Use Cases:**
  - Input cost forecasting
  - Margin analysis
  - Procurement strategy planning
  - Hedging decisions
- **Modeling:** 4-year cycle with volatility, responds to geopolitical shocks

### Natural Gas Price
- **Metric ID:** `natural_gas_price`
- **Unit:** USD/MMBtu (Million British Thermal Units)
- **Expected Range:** 1.5 - 10
- **Description:** Henry Hub natural gas spot price, critical for energy-intensive petrochemical production and as feedstock for some processes
- **Use Cases:**
  - Energy cost modeling
  - Process economics optimization
  - Geographic cost comparison
  - Seasonal planning
- **Modeling:** Seasonal pattern (winter peaks), medium-term cycles, shock-responsive

### Feedstock Spread Index
- **Metric ID:** `feedstock_spread_index`
- **Unit:** Index (base 100)
- **Expected Range:** 50 - 150
- **Description:** Spread between refined chemical products and crude feedstock inputs, indicating profitability margins for refiners and crackers
- **Use Cases:**
  - Margin pressure identification
  - Refinery economics analysis
  - Price transmission tracking
  - Competitive position assessment
- **Modeling:** 3-year margin compression cycles, responds to supply disruptions

---

## Cost Structure

### Input Cost Index
- **Metric ID:** `input_cost_index`
- **Unit:** Index (base 100)
- **Expected Range:** 80 - 140
- **Description:** Composite index of raw material and energy input costs across the chemical value chain
- **Use Cases:**
  - Cost inflation tracking
  - Budgeting and forecasting
  - Price adjustment justification
  - Supplier negotiation benchmarks
- **Modeling:** Long-term inflation trend, 4-year cyclical variation

### Margin Pressure Index
- **Metric ID:** `margin_pressure_index`
- **Unit:** Score (0-100, higher = more pressure)
- **Expected Range:** 0 - 100
- **Description:** Profitability pressure from cost-price squeeze, measuring the gap between input cost inflation and output price realization
- **Use Cases:**
  - Financial stress monitoring
  - Strategic planning
  - Capacity investment timing
  - Product portfolio optimization
- **Modeling:** 3-year cyclical pressure, highly responsive to cost and demand shocks

---

## Capacity and Production

### Capacity Utilization
- **Metric ID:** `capacity_utilization_percent`
- **Unit:** Percent
- **Expected Range:** 55 - 95
- **Description:** Chemical manufacturing capacity utilization rate, indicating demand strength and production efficiency
- **Use Cases:**
  - Supply-demand balance assessment
  - Pricing power indication
  - Investment timing decisions
  - Market tightness measurement
- **Modeling:** Economic cycle-driven, drops sharply during demand shocks

### Industrial Production Index
- **Metric ID:** `industrial_production_index`
- **Unit:** Index (base 100)
- **Expected Range:** 85 - 125
- **Description:** Overall industrial production output index across manufacturing sectors
- **Use Cases:**
  - Macroeconomic context
  - Demand proxy for chemicals
  - Business cycle positioning
  - Economic correlation analysis
- **Modeling:** Growth trend with business cycle overlay

### Chemical Output Index
- **Metric ID:** `chemical_output_index`
- **Unit:** Index (base 100)
- **Expected Range:** 80 - 130
- **Description:** Chemical sector production output volume index, tracking physical production volumes
- **Use Cases:**
  - Sector growth tracking
  - Market size estimation
  - Production planning alignment
  - Competitive benchmarking
- **Modeling:** Growth trend with cyclical variation, responds to demand shocks

---

## Downstream Demand

### Manufacturing Demand Index
- **Metric ID:** `manufacturing_demand_index`
- **Unit:** Index (base 100)
- **Expected Range:** 70 - 130
- **Description:** Demand from downstream manufacturing sectors (automotive, electronics, consumer goods)
- **Use Cases:**
  - Customer sector health monitoring
  - Sales forecasting
  - Geographic expansion planning
  - Product mix optimization
- **Modeling:** Business cycle alignment, responds to manufacturing slowdowns

### Construction Demand Index
- **Metric ID:** `construction_demand_index`
- **Unit:** Index (base 100)
- **Expected Range:** 65 - 135
- **Description:** Construction sector chemical product demand (adhesives, coatings, plastics, insulation)
- **Use Cases:**
  - Specialty chemical demand forecasting
  - Regional market analysis
  - Product development priorities
  - Seasonal planning
- **Modeling:** 5-year building cycle, responds to construction shocks

### Auto Production Proxy
- **Metric ID:** `auto_production_proxy`
- **Unit:** Thousands of units (monthly)
- **Expected Range:** 800 - 1,600
- **Description:** Automotive production volume as demand proxy for chemicals (plastics, coatings, lubricants, specialty materials)
- **Use Cases:**
  - Major customer segment tracking
  - Product-specific forecasting
  - Geographic capacity allocation
  - Innovation pipeline alignment
- **Modeling:** 4-year cycle, highly sensitive to automotive demand shocks

### Semiconductor CapEx Proxy
- **Metric ID:** `semiconductor_capex_proxy`
- **Unit:** Billions USD (quarterly)
- **Expected Range:** 100 - 250
- **Description:** Semiconductor capital expenditure indicating specialty chemical demand (photoresists, etchants, cleaning agents, gases)
- **Use Cases:**
  - High-margin specialty chemical demand
  - Technology sector exposure
  - R&D investment prioritization
  - Geographic expansion (Asia focus)
- **Modeling:** Strong growth trend with boom-bust volatility cycles

---

## Trade Exposure

### Export Dependency Ratio
- **Metric ID:** `export_dependency_ratio`
- **Unit:** Percent
- **Expected Range:** 20 - 50
- **Description:** Share of chemical production exported internationally, measuring exposure to global markets
- **Use Cases:**
  - Trade policy risk assessment
  - Currency exposure analysis
  - Market diversification planning
  - Competitiveness benchmarking
- **Modeling:** Slow upward trend, drops during trade restrictions

### Import Dependency Ratio
- **Metric ID:** `import_dependency_ratio`
- **Unit:** Percent
- **Expected Range:** 15 - 45
- **Description:** Share of domestic chemical consumption sourced from imports
- **Use Cases:**
  - Supply chain vulnerability assessment
  - Domestic production opportunity sizing
  - Trade balance monitoring
  - Strategic sourcing decisions
- **Modeling:** Gradual upward trend reflecting globalization

### Global Demand Index
- **Metric ID:** `global_demand_index`
- **Unit:** Index (base 100)
- **Expected Range:** 75 - 135
- **Description:** Global chemical demand composite index across major markets
- **Use Cases:**
  - International market opportunity assessment
  - Export planning
  - Global capacity allocation
  - Strategic positioning
- **Modeling:** Growth trend with global business cycle, responds to trade shocks

---

## Regulatory Pressure

### Environmental Cost Index
- **Metric ID:** `environmental_cost_index`
- **Unit:** Index (base 100)
- **Expected Range:** 100 - 150
- **Description:** Compliance costs for environmental regulations (emissions, waste treatment, monitoring, reporting)
- **Use Cases:**
  - Compliance budget planning
  - Process redesign ROI analysis
  - Geographic location assessment
  - Advocacy and policy engagement
- **Modeling:** Upward trend (increasing regulation), step changes during regulatory tightening

### Compliance Burden Score
- **Metric ID:** `compliance_burden_score`
- **Unit:** Score (0-100)
- **Expected Range:** 40 - 100
- **Description:** Regulatory compliance administrative burden (reporting, audits, certifications, documentation)
- **Use Cases:**
  - Operating expense forecasting
  - Organizational capacity planning
  - System investment prioritization
  - Small-site viability assessment
- **Modeling:** Steady upward trend reflecting cumulative regulatory complexity

### Regulatory Intensity Index
- **Metric ID:** `regulatory_intensity_index`
- **Unit:** Index (base 100)
- **Expected Range:** 100 - 150
- **Description:** Overall regulatory intensity affecting chemical sector operations
- **Use Cases:**
  - Sector competitiveness analysis
  - Geographic comparison
  - Long-term strategic planning
  - Public policy engagement
- **Modeling:** Upward trend with step changes during major regulatory events

---

## Composite Indicators

### Industrial Stress Composite
- **Metric ID:** `industrial_stress_composite`
- **Unit:** Score (0-100, higher = more stress)
- **Expected Range:** 0 - 100
- **Description:** Composite indicator of industrial sector stress combining multiple stress signals (cost pressure, demand weakness, capacity constraints)
- **Use Cases:**
  - Early warning system
  - Risk monitoring dashboard
  - Strategic scenario planning
  - Executive reporting
- **Modeling:** Aggregates shock impacts from multiple metrics, 4-year cyclical stress pattern

---

## Data Characteristics

### Frequency
Most metrics are available at **monthly** frequency. Some specialty metrics may be quarterly:
- Semiconductor CapEx: Quarterly
- Trade ratios: Monthly
- Production indices: Monthly
- Price data: Monthly (can be aggregated from daily)

### Time Range
Default synthetic data generation covers:
- **Start Date:** 2022-01-01
- **End Date:** 2025-01-01
- **Duration:** 3 years (36 months)

### Data Quality Notes
- **Synthetic Mode:** All data is algorithmically generated for portfolio demonstration
- **Realistic Modeling:** Incorporates trends, cycles, seasonality, autocorrelation, and shock events
- **Shock Events:** 7 predefined shock scenarios inject realistic disruptions
- **Validation:** All metrics bounded to realistic ranges with Zod schema validation

---

## Metric Relationships

### Key Correlations
- **Crude Oil Price ↔ Input Cost Index:** Strong positive correlation
- **Capacity Utilization ↔ Margin Pressure:** Negative correlation (lower utilization = higher pressure)
- **Manufacturing Demand ↔ Chemical Output:** Strong positive correlation with lag
- **Feedstock Spread ↔ Margin Pressure:** Negative correlation (compressed spread = higher pressure)
- **Global Demand ↔ Export Dependency:** Positive correlation

### Leading Indicators
- Auto Production → Chemical demand (3-6 month lead)
- Semiconductor CapEx → Specialty chemical demand (6-12 month lead)
- Crude Oil Price → Input Cost Index (1-2 month lead)

### Lagging Indicators
- Regulatory costs (respond slowly to policy changes)
- Trade dependency ratios (structural, slow-moving)

---

## Integration with Real Data

When migrating to real open data sources, the following public APIs and datasets can provide these metrics:

- **Energy Prices:** EIA (U.S. Energy Information Administration)
- **Production Indices:** Federal Reserve Industrial Production data
- **Trade Data:** U.S. Census Bureau, UN Comtrade
- **Economic Indicators:** FRED (Federal Reserve Economic Data)
- **Sector-Specific:** American Chemistry Council (ACC), ICIS, Platts

See [docs/ARCHITECTURE.md](./ARCHITECTURE.md) for implementation guidance.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01 | Initial metrics documentation |
