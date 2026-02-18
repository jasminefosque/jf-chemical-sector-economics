import type { TimeSeries, ShockEvent, QueryParams, MetricMetadata } from '../models/schemas';

/**
 * Abstract data provider interface
 * Allows swapping between synthetic, open data, and production sources
 * without changing UI code
 */
export interface DataProvider {
  /**
   * Get a time series for a specific metric
   */
  getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries>;

  /**
   * Get the latest value for a metric
   */
  getLatest(metricId: string, params?: QueryParams): Promise<number | null>;

  /**
   * Get metadata about a metric
   */
  getMetadata(metricId: string): Promise<MetricMetadata>;

  /**
   * Get all available shock events
   */
  getShockEvents(): Promise<ShockEvent[]>;

  /**
   * Get shock events within a date range
   */
  getShockEventsByDateRange(startDate: string, endDate: string): Promise<ShockEvent[]>;
}
