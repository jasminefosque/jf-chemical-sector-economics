import { describe, it, expect } from 'vitest';
import { TimeSeriesSchema, ShockEventSchema, ObservationSchema } from '../models/schemas';

describe('Schema Validation', () => {
  describe('ObservationSchema', () => {
    it('should validate correct observation', () => {
      const observation = {
        date: '2022-01-01',
        value: 75.5,
      };

      const result = ObservationSchema.safeParse(observation);
      expect(result.success).toBe(true);
    });

    it('should reject invalid observation', () => {
      const observation = {
        date: '2022-01-01',
        // missing value
      };

      const result = ObservationSchema.safeParse(observation);
      expect(result.success).toBe(false);
    });
  });

  describe('TimeSeriesSchema', () => {
    it('should validate correct time series', () => {
      const series = {
        metric_id: 'crude_oil_price',
        label: 'Crude Oil Price',
        unit: 'USD/barrel',
        frequency: 'monthly',
        observations: [
          { date: '2022-01-01', value: 75.5 },
          { date: '2022-02-01', value: 78.2 },
        ],
      };

      const result = TimeSeriesSchema.safeParse(series);
      expect(result.success).toBe(true);
    });

    it('should reject invalid frequency', () => {
      const series = {
        metric_id: 'crude_oil_price',
        label: 'Crude Oil Price',
        unit: 'USD/barrel',
        frequency: 'invalid',
        observations: [],
      };

      const result = TimeSeriesSchema.safeParse(series);
      expect(result.success).toBe(false);
    });
  });

  describe('ShockEventSchema', () => {
    it('should validate correct shock event', () => {
      const event = {
        event_id: 'oil_spike_2023',
        label: 'Oil Price Spike',
        start_date: '2023-01-15',
        end_date: '2023-04-30',
        severity: 4,
        description: 'Geopolitical tensions',
      };

      const result = ShockEventSchema.safeParse(event);
      expect(result.success).toBe(true);
    });

    it('should reject severity out of range', () => {
      const event = {
        event_id: 'oil_spike_2023',
        label: 'Oil Price Spike',
        start_date: '2023-01-15',
        severity: 10, // Out of 1-5 range
        description: 'Test',
      };

      const result = ShockEventSchema.safeParse(event);
      expect(result.success).toBe(false);
    });

    it('should allow optional end_date', () => {
      const event = {
        event_id: 'ongoing_event',
        label: 'Ongoing Event',
        start_date: '2023-01-15',
        severity: 3,
        description: 'Ongoing situation',
        // No end_date
      };

      const result = ShockEventSchema.safeParse(event);
      expect(result.success).toBe(true);
    });
  });
});
