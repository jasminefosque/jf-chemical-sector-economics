import { MetricMetadata } from '../../models/schemas';

export const METRIC_DEFINITIONS: Record<string, MetricMetadata> = {
  // Upstream Inputs
  crude_oil_price: {
    metric_id: 'crude_oil_price',
    label: 'Crude Oil Price',
    unit: 'USD/barrel',
    description: 'West Texas Intermediate (WTI) crude oil spot price, primary feedstock cost driver',
    category: 'Upstream Inputs',
    value_range: [30, 120],
  },
  natural_gas_price: {
    metric_id: 'natural_gas_price',
    label: 'Natural Gas Price',
    unit: 'USD/MMBtu',
    description: 'Henry Hub natural gas spot price, critical for petrochemical production',
    category: 'Upstream Inputs',
    value_range: [1.5, 10],
  },
  feedstock_spread_index: {
    metric_id: 'feedstock_spread_index',
    label: 'Feedstock Spread Index',
    unit: 'Index (base 100)',
    description: 'Spread between refined chemical products and crude feedstock inputs',
    category: 'Upstream Inputs',
    value_range: [50, 150],
  },

  // Cost Structure
  input_cost_index: {
    metric_id: 'input_cost_index',
    label: 'Input Cost Index',
    unit: 'Index (base 100)',
    description: 'Composite index of raw material and energy input costs',
    category: 'Cost Structure',
    value_range: [80, 140],
  },
  margin_pressure_index: {
    metric_id: 'margin_pressure_index',
    label: 'Margin Pressure Index',
    unit: 'Score (0-100)',
    description: 'Profitability pressure from cost-price squeeze, higher indicates more pressure',
    category: 'Cost Structure',
    value_range: [0, 100],
  },

  // Capacity and Production
  capacity_utilization_percent: {
    metric_id: 'capacity_utilization_percent',
    label: 'Capacity Utilization',
    unit: 'Percent',
    description: 'Chemical manufacturing capacity utilization rate',
    category: 'Capacity and Production',
    value_range: [55, 95],
  },
  industrial_production_index: {
    metric_id: 'industrial_production_index',
    label: 'Industrial Production Index',
    unit: 'Index (base 100)',
    description: 'Overall industrial production output index',
    category: 'Capacity and Production',
    value_range: [85, 125],
  },
  chemical_output_index: {
    metric_id: 'chemical_output_index',
    label: 'Chemical Output Index',
    unit: 'Index (base 100)',
    description: 'Chemical sector production output volume index',
    category: 'Capacity and Production',
    value_range: [80, 130],
  },

  // Downstream Demand
  manufacturing_demand_index: {
    metric_id: 'manufacturing_demand_index',
    label: 'Manufacturing Demand Index',
    unit: 'Index (base 100)',
    description: 'Demand from downstream manufacturing sectors',
    category: 'Downstream Demand',
    value_range: [70, 130],
  },
  construction_demand_index: {
    metric_id: 'construction_demand_index',
    label: 'Construction Demand Index',
    unit: 'Index (base 100)',
    description: 'Construction sector chemical product demand',
    category: 'Downstream Demand',
    value_range: [65, 135],
  },
  auto_production_proxy: {
    metric_id: 'auto_production_proxy',
    label: 'Auto Production Proxy',
    unit: 'Thousands of units',
    description: 'Automotive production volume as demand proxy for chemicals',
    category: 'Downstream Demand',
    value_range: [800, 1600],
  },
  semiconductor_capex_proxy: {
    metric_id: 'semiconductor_capex_proxy',
    label: 'Semiconductor CapEx Proxy',
    unit: 'Billions USD',
    description: 'Semiconductor capital expenditure indicating specialty chemical demand',
    category: 'Downstream Demand',
    value_range: [100, 250],
  },

  // Trade Exposure
  export_dependency_ratio: {
    metric_id: 'export_dependency_ratio',
    label: 'Export Dependency Ratio',
    unit: 'Percent',
    description: 'Share of chemical production exported internationally',
    category: 'Trade Exposure',
    value_range: [20, 50],
  },
  import_dependency_ratio: {
    metric_id: 'import_dependency_ratio',
    label: 'Import Dependency Ratio',
    unit: 'Percent',
    description: 'Share of domestic chemical consumption from imports',
    category: 'Trade Exposure',
    value_range: [15, 45],
  },
  global_demand_index: {
    metric_id: 'global_demand_index',
    label: 'Global Demand Index',
    unit: 'Index (base 100)',
    description: 'Global chemical demand composite index',
    category: 'Trade Exposure',
    value_range: [75, 135],
  },

  // Regulatory Pressure
  environmental_cost_index: {
    metric_id: 'environmental_cost_index',
    label: 'Environmental Cost Index',
    unit: 'Index (base 100)',
    description: 'Compliance costs for environmental regulations',
    category: 'Regulatory Pressure',
    value_range: [100, 150],
  },
  compliance_burden_score: {
    metric_id: 'compliance_burden_score',
    label: 'Compliance Burden Score',
    unit: 'Score (0-100)',
    description: 'Regulatory compliance administrative burden',
    category: 'Regulatory Pressure',
    value_range: [40, 100],
  },
  regulatory_intensity_index: {
    metric_id: 'regulatory_intensity_index',
    label: 'Regulatory Intensity Index',
    unit: 'Index (base 100)',
    description: 'Overall regulatory intensity affecting chemical sector',
    category: 'Regulatory Pressure',
    value_range: [100, 150],
  },

  // Composite
  industrial_stress_composite: {
    metric_id: 'industrial_stress_composite',
    label: 'Industrial Stress Composite',
    unit: 'Score (0-100)',
    description: 'Composite indicator of industrial sector stress, higher indicates more stress',
    category: 'Composite Indicator',
    value_range: [0, 100],
  },
};

export function getMetricMetadata(metricId: string): MetricMetadata {
  const metadata = METRIC_DEFINITIONS[metricId];
  if (!metadata) {
    throw new Error(`Unknown metric: ${metricId}`);
  }
  return metadata;
}

export function getAllMetrics(): MetricMetadata[] {
  return Object.values(METRIC_DEFINITIONS);
}

export function getMetricsByCategory(category: string): MetricMetadata[] {
  return Object.values(METRIC_DEFINITIONS).filter(m => m.category === category);
}
