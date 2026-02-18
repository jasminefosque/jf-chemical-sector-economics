import type { DataProvider } from '../DataProvider';
import type { TimeSeries, ShockEvent, QueryParams, MetricMetadata } from '../../models/schemas';

/**
 * Open data provider stub
 * TODO: Implement with real open data sources
 * Examples: FRED API, EIA API, Census Bureau, etc.
 * 
 * This is a placeholder that returns empty data.
 * In production, connect to public APIs or data sources.
 */
export class OpenDataProvider implements DataProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getSeries(_metricId: string, _params?: QueryParams): Promise<TimeSeries> {
    // TODO: Implement API calls to open data sources
    console.warn('OpenDataProvider not implemented. Please use synthetic mode or implement real data adapters.');

    return {
      metric_id: _metricId,
      label: `${_metricId} (Open Data - Not Implemented)`,
      unit: 'N/A',
      frequency: 'monthly',
      observations: [],
      notes: 'Open data mode requires implementation. See docs/ARCHITECTURE.md',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getLatest(_metricId: string, _params?: QueryParams): Promise<number | null> {
    // TODO: Implement
    console.warn('OpenDataProvider.getLatest not implemented');
    return null;
  }

  async getMetadata(metricId: string): Promise<MetricMetadata> {
    // TODO: Implement
    console.warn('OpenDataProvider.getMetadata not implemented');

    return {
      metric_id: metricId,
      label: metricId,
      unit: 'N/A',
      description: 'Open data mode requires implementation',
      category: 'Unknown',
    };
  }

  async getShockEvents(): Promise<ShockEvent[]> {
    // TODO: Implement event detection or manual curation
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getShockEventsByDateRange(_startDate: string, _endDate: string): Promise<ShockEvent[]> {
    // TODO: Implement
    return [];
  }
}
