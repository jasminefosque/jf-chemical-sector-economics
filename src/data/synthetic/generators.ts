import type { Observation } from '../../models/schemas';
import { getActiveShock } from './shockEvents';

/**
 * Generate date array for time series
 */
export function generateDates(
  startDate: string,
  endDate: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);

    switch (frequency) {
      case 'daily':
        current.setDate(current.getDate() + 1);
        break;
      case 'weekly':
        current.setDate(current.getDate() + 7);
        break;
      case 'monthly':
        current.setMonth(current.getMonth() + 1);
        break;
      case 'quarterly':
        current.setMonth(current.getMonth() + 3);
        break;
    }
  }

  return dates;
}

/**
 * Generate realistic noise with autocorrelation
 */
function generateNoise(amplitude: number, persistence: number = 0.7): () => number {
  let previousNoise = 0;

  return () => {
    const newNoise = (Math.random() - 0.5) * 2 * amplitude;
    const noise = persistence * previousNoise + (1 - persistence) * newNoise;
    previousNoise = noise;
    return noise;
  };
}

/**
 * Generate cyclical pattern (for economic cycles)
 */
function cyclicalPattern(
  t: number,
  period: number,
  amplitude: number,
  phase: number = 0
): number {
  return amplitude * Math.sin((2 * Math.PI * t) / period + phase);
}

/**
 * Crude oil price generator (USD per barrel)
 * Baseline: ~$75, with volatility and cycles
 */
export function generateCrudeOilPrice(dates: string[]): Observation[] {
  const noise = generateNoise(5);
  const baseline = 75;

  return dates.map((date, i) => {
    let value = baseline;

    // Long-term cycle (4-year cycle)
    value += cyclicalPattern(i, 48, 15);

    // Short-term volatility cycle
    value += cyclicalPattern(i, 12, 8, Math.PI / 4);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'crude_oil_price');
    if (shock) {
      const shockImpact = (shock.severity / 5) * 25; // Up to $25 increase
      value += shockImpact;
    }

    return { date, value: Math.max(30, value) };
  });
}

/**
 * Natural gas price generator (USD per MMBtu)
 * Baseline: ~$3.5, with seasonality and volatility
 */
export function generateNaturalGasPrice(dates: string[]): Observation[] {
  const noise = generateNoise(0.3);
  const baseline = 3.5;

  return dates.map((date, i) => {
    let value = baseline;

    // Seasonal pattern (higher in winter)
    const month = new Date(date).getMonth();
    const seasonality = 0.8 * Math.cos(((month - 1) * Math.PI) / 6);
    value += seasonality;

    // Medium-term cycle
    value += cyclicalPattern(i, 24, 1.2);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'natural_gas_price');
    if (shock) {
      const shockImpact = (shock.severity / 5) * 4; // Up to $4 increase
      value += shockImpact;
    }

    return { date, value: Math.max(1.5, value) };
  });
}

/**
 * Feedstock spread index (base 100)
 * Measures the spread between refined products and crude inputs
 */
export function generateFeedstockSpreadIndex(dates: string[]): Observation[] {
  const noise = generateNoise(3);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Margin compression cycles
    value += cyclicalPattern(i, 36, 15, Math.PI);

    // Trend
    value += (i / dates.length) * -5; // Slight compression trend

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'feedstock_spread_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -20; // Spread compression
      value += shockImpact;
    }

    return { date, value: Math.max(50, value) };
  });
}

/**
 * Input cost index (base 100)
 */
export function generateInputCostIndex(dates: string[]): Observation[] {
  const noise = generateNoise(2);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Long-term inflation
    value += (i / dates.length) * 15;

    // Cyclical variation
    value += cyclicalPattern(i, 48, 10);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'input_cost_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * 15;
      value += shockImpact;
    }

    return { date, value: Math.max(80, value) };
  });
}

/**
 * Margin pressure index (0-100, higher = more pressure)
 */
export function generateMarginPressureIndex(dates: string[]): Observation[] {
  const noise = generateNoise(3);
  const baseline = 50;

  return dates.map((date, i) => {
    let value = baseline;

    // Cyclical pressure
    value += cyclicalPattern(i, 36, 20);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'margin_pressure_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * 25; // Increased pressure
      value += shockImpact;
    }

    return { date, value: Math.max(0, Math.min(100, value)) };
  });
}

/**
 * Capacity utilization percent
 */
export function generateCapacityUtilization(dates: string[]): Observation[] {
  const noise = generateNoise(1.5);
  const baseline = 78;

  return dates.map((date, i) => {
    let value = baseline;

    // Economic cycle
    value += cyclicalPattern(i, 48, 8);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'capacity_utilization_percent');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -12; // Utilization drops
      value += shockImpact;
    }

    return { date, value: Math.max(55, Math.min(95, value)) };
  });
}

/**
 * Industrial production index (base 100)
 */
export function generateIndustrialProductionIndex(dates: string[]): Observation[] {
  const noise = generateNoise(1.5);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Growth trend
    value += (i / dates.length) * 12;

    // Business cycle
    value += cyclicalPattern(i, 48, 8);

    // Noise
    value += noise();

    return { date, value: Math.max(85, value) };
  });
}

/**
 * Chemical output index (base 100)
 */
export function generateChemicalOutputIndex(dates: string[]): Observation[] {
  const noise = generateNoise(2);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Growth trend
    value += (i / dates.length) * 10;

    // Cycle
    value += cyclicalPattern(i, 48, 10);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'chemical_output_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -15;
      value += shockImpact;
    }

    return { date, value: Math.max(80, value) };
  });
}

/**
 * Manufacturing demand index (base 100)
 */
export function generateManufacturingDemandIndex(dates: string[]): Observation[] {
  const noise = generateNoise(2.5);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Trend
    value += (i / dates.length) * 8;

    // Business cycle
    value += cyclicalPattern(i, 48, 12);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'manufacturing_demand_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -18;
      value += shockImpact;
    }

    return { date, value: Math.max(70, value) };
  });
}

/**
 * Construction demand index (base 100)
 */
export function generateConstructionDemandIndex(dates: string[]): Observation[] {
  const noise = generateNoise(3);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Trend
    value += (i / dates.length) * 5;

    // Cycle
    value += cyclicalPattern(i, 60, 15);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'construction_demand_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -20;
      value += shockImpact;
    }

    return { date, value: Math.max(65, value) };
  });
}

/**
 * Auto production proxy (units, thousands)
 */
export function generateAutoProductionProxy(dates: string[]): Observation[] {
  const noise = generateNoise(50);
  const baseline = 1200;

  return dates.map((date, i) => {
    let value = baseline;

    // Cycle
    value += cyclicalPattern(i, 48, 150);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'auto_production_proxy');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -200;
      value += shockImpact;
    }

    return { date, value: Math.max(800, value) };
  });
}

/**
 * Semiconductor capex proxy (billions USD)
 */
export function generateSemiconductorCapexProxy(dates: string[]): Observation[] {
  const noise = generateNoise(5);
  const baseline = 150;

  return dates.map((date, i) => {
    let value = baseline;

    // Strong growth trend
    value += (i / dates.length) * 50;

    // Volatility
    value += cyclicalPattern(i, 36, 25);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'semiconductor_capex_proxy');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -30;
      value += shockImpact;
    }

    return { date, value: Math.max(100, value) };
  });
}

/**
 * Export dependency ratio (percent)
 */
export function generateExportDependencyRatio(dates: string[]): Observation[] {
  const noise = generateNoise(1);
  const baseline = 35;

  return dates.map((date, i) => {
    let value = baseline;

    // Slow trend
    value += (i / dates.length) * 3;

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'export_dependency_ratio');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -8;
      value += shockImpact;
    }

    return { date, value: Math.max(20, Math.min(50, value)) };
  });
}

/**
 * Import dependency ratio (percent)
 */
export function generateImportDependencyRatio(dates: string[]): Observation[] {
  const noise = generateNoise(0.8);
  const baseline = 28;

  return dates.map((date, i) => {
    let value = baseline;

    // Slight upward trend
    value += (i / dates.length) * 4;

    // Noise
    value += noise();

    return { date, value: Math.max(15, Math.min(45, value)) };
  });
}

/**
 * Global demand index (base 100)
 */
export function generateGlobalDemandIndex(dates: string[]): Observation[] {
  const noise = generateNoise(2);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Growth
    value += (i / dates.length) * 15;

    // Cycle
    value += cyclicalPattern(i, 48, 12);

    // Noise
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'global_demand_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * -15;
      value += shockImpact;
    }

    return { date, value: Math.max(75, value) };
  });
}

/**
 * Environmental cost index (base 100)
 */
export function generateEnvironmentalCostIndex(dates: string[]): Observation[] {
  const noise = generateNoise(2);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Upward trend (increasing costs)
    value += (i / dates.length) * 25;

    // Noise
    value += noise();

    // Shock events (regulatory tightening)
    const shock = getActiveShock(date, 'environmental_cost_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * 20;
      value += shockImpact;
    }

    return { date, value: Math.max(100, value) };
  });
}

/**
 * Compliance burden score (0-100)
 */
export function generateComplianceBurdenScore(dates: string[]): Observation[] {
  const noise = generateNoise(2);
  const baseline = 55;

  return dates.map((date, i) => {
    let value = baseline;

    // Increasing trend
    value += (i / dates.length) * 15;

    // Noise
    value += noise();

    return { date, value: Math.max(40, Math.min(100, value)) };
  });
}

/**
 * Regulatory intensity index (base 100)
 */
export function generateRegulatoryIntensityIndex(dates: string[]): Observation[] {
  const noise = generateNoise(3);
  const baseline = 100;

  return dates.map((date, i) => {
    let value = baseline;

    // Upward trend
    value += (i / dates.length) * 20;

    // Step changes
    value += noise();

    // Shock events
    const shock = getActiveShock(date, 'regulatory_intensity_index');
    if (shock) {
      const shockImpact = (shock.severity / 5) * 15;
      value += shockImpact;
    }

    return { date, value: Math.max(100, value) };
  });
}

/**
 * Industrial stress composite (0-100, higher = more stress)
 * Composite of various stress indicators
 */
export function generateIndustrialStressComposite(dates: string[]): Observation[] {
  const noise = generateNoise(2);
  const baseline = 45;

  return dates.map((date, i) => {
    let value = baseline;

    // Cyclical stress
    value += cyclicalPattern(i, 48, 18);

    // Noise
    value += noise();

    // Aggregate shock impact
    const shocks = ['crude_oil_price', 'natural_gas_price', 'margin_pressure_index', 'capacity_utilization_percent']
      .map(metric => getActiveShock(date, metric))
      .filter(s => s !== null);

    if (shocks.length > 0) {
      const avgSeverity = shocks.reduce((sum, s) => sum + s!.severity, 0) / shocks.length;
      value += (avgSeverity / 5) * 20;
    }

    return { date, value: Math.max(0, Math.min(100, value)) };
  });
}
