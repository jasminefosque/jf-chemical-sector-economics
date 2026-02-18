import { DataProvider } from '../DataProvider';
import { TimeSeries, ShockEvent, QueryParams, MetricMetadata, TimeSeriesSchema } from '../../models/schemas';
import { SHOCK_EVENTS, getShockEventsByDateRange } from './shockEvents';
import { getMetricMetadata } from './metricDefinitions';
import {
  generateDates,
  generateCrudeOilPrice,
  generateNaturalGasPrice,
  generateFeedstockSpreadIndex,
  generateInputCostIndex,
  generateMarginPressureIndex,
  generateCapacityUtilization,
  generateIndustrialProductionIndex,
  generateChemicalOutputIndex,
  generateManufacturingDemandIndex,
  generateConstructionDemandIndex,
  generateAutoProductionProxy,
  generateSemiconductorCapexProxy,
  generateExportDependencyRatio,
  generateImportDependencyRatio,
  generateGlobalDemandIndex,
  generateEnvironmentalCostIndex,
  generateComplianceBurdenScore,
  generateRegulatoryIntensityIndex,
  generateIndustrialStressComposite,
} from './generators';

/**
 * Synthetic data provider for portfolio demonstration
 * Generates realistic industrial economic time series
 */
export class SyntheticDataProvider implements DataProvider {
  private readonly defaultStartDate = '2022-01-01';
  private readonly defaultEndDate = '2025-01-01';
  private readonly cache = new Map<string, TimeSeries>();

  async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
    const cacheKey = `${metricId}_${JSON.stringify(params || {})}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const metadata = await this.getMetadata(metricId);
    const startDate = params?.start_date || this.defaultStartDate;
    const endDate = params?.end_date || this.defaultEndDate;

    // Determine frequency based on metric
    const frequency = this.getFrequency(metricId);

    // Generate dates
    const dates = generateDates(startDate, endDate, frequency);

    // Generate observations based on metric
    const observations = this.generateObservations(metricId, dates);

    const series: TimeSeries = {
      metric_id: metricId,
      label: metadata.label,
      unit: metadata.unit,
      frequency,
      observations,
      geography: params?.geography || 'US',
      sector: params?.sector || 'Chemical Manufacturing',
      notes: 'Synthetic data generated for portfolio demonstration',
    };

    // Validate with schema
    TimeSeriesSchema.parse(series);

    this.cache.set(cacheKey, series);
    return series;
  }

  async getLatest(metricId: string, params?: QueryParams): Promise<number | null> {
    const series = await this.getSeries(metricId, params);
    if (series.observations.length === 0) {
      return null;
    }
    return series.observations[series.observations.length - 1].value;
  }

  async getMetadata(metricId: string): Promise<MetricMetadata> {
    return getMetricMetadata(metricId);
  }

  async getShockEvents(): Promise<ShockEvent[]> {
    return SHOCK_EVENTS;
  }

  async getShockEventsByDateRange(startDate: string, endDate: string): Promise<ShockEvent[]> {
    return getShockEventsByDateRange(startDate, endDate);
  }

  private getFrequency(metricId: string): 'daily' | 'weekly' | 'monthly' | 'quarterly' {
    // Most metrics are monthly for this dashboard
    if (metricId.includes('daily')) return 'daily';
    if (metricId.includes('quarterly')) return 'quarterly';
    return 'monthly';
  }

  private generateObservations(metricId: string, dates: string[]) {
    const generators: Record<string, (dates: string[]) => any> = {
      crude_oil_price: generateCrudeOilPrice,
      natural_gas_price: generateNaturalGasPrice,
      feedstock_spread_index: generateFeedstockSpreadIndex,
      input_cost_index: generateInputCostIndex,
      margin_pressure_index: generateMarginPressureIndex,
      capacity_utilization_percent: generateCapacityUtilization,
      industrial_production_index: generateIndustrialProductionIndex,
      chemical_output_index: generateChemicalOutputIndex,
      manufacturing_demand_index: generateManufacturingDemandIndex,
      construction_demand_index: generateConstructionDemandIndex,
      auto_production_proxy: generateAutoProductionProxy,
      semiconductor_capex_proxy: generateSemiconductorCapexProxy,
      export_dependency_ratio: generateExportDependencyRatio,
      import_dependency_ratio: generateImportDependencyRatio,
      global_demand_index: generateGlobalDemandIndex,
      environmental_cost_index: generateEnvironmentalCostIndex,
      compliance_burden_score: generateComplianceBurdenScore,
      regulatory_intensity_index: generateRegulatoryIntensityIndex,
      industrial_stress_composite: generateIndustrialStressComposite,
    };

    const generator = generators[metricId];
    if (!generator) {
      throw new Error(`No generator found for metric: ${metricId}`);
    }

    return generator(dates);
  }

  /**
   * Clear the cache (useful for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }
}
