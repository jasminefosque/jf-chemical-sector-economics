import { describe, it, expect } from 'vitest';
import { SyntheticDataProvider } from '../data/adapters/SyntheticDataProvider';

describe('SyntheticDataProvider', () => {
  const provider = new SyntheticDataProvider();

  describe('getSeries', () => {
    it('should return valid time series for crude oil', async () => {
      const series = await provider.getSeries('crude_oil_price', {
        start_date: '2022-01-01',
        end_date: '2022-06-01',
      });

      expect(series.metric_id).toBe('crude_oil_price');
      expect(series.label).toBe('Crude Oil Price');
      expect(series.unit).toBe('USD/barrel');
      expect(series.observations.length).toBeGreaterThan(0);
    });

    it('should return valid time series for natural gas', async () => {
      const series = await provider.getSeries('natural_gas_price');

      expect(series.metric_id).toBe('natural_gas_price');
      expect(series.label).toBe('Natural Gas Price');
      expect(series.observations.length).toBeGreaterThan(0);
    });
  });

  describe('getLatest', () => {
    it('should return latest value', async () => {
      const latest = await provider.getLatest('crude_oil_price');

      expect(latest).toBeDefined();
      expect(typeof latest).toBe('number');
      expect(latest).toBeGreaterThan(0);
    });
  });

  describe('getMetadata', () => {
    it('should return metadata for metric', async () => {
      const metadata = await provider.getMetadata('crude_oil_price');

      expect(metadata.metric_id).toBe('crude_oil_price');
      expect(metadata.label).toBe('Crude Oil Price');
      expect(metadata.unit).toBe('USD/barrel');
      expect(metadata.category).toBe('Upstream Inputs');
    });
  });

  describe('getShockEvents', () => {
    it('should return shock events', async () => {
      const events = await provider.getShockEvents();

      expect(events.length).toBeGreaterThan(0);
      events.forEach((event) => {
        expect(event.event_id).toBeDefined();
        expect(event.severity).toBeGreaterThanOrEqual(1);
        expect(event.severity).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('getShockEventsByDateRange', () => {
    it('should filter events by date range', async () => {
      const events = await provider.getShockEventsByDateRange('2023-01-01', '2023-12-31');

      expect(events.length).toBeGreaterThan(0);
      events.forEach((event) => {
        const startDate = new Date(event.start_date);
        expect(startDate.getFullYear()).toBeGreaterThanOrEqual(2022);
        expect(startDate.getFullYear()).toBeLessThanOrEqual(2024);
      });
    });
  });
});
