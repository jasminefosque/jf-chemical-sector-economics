import { describe, it, expect } from 'vitest';
import { SHOCK_EVENTS, getShockEventsByDateRange } from '../data/synthetic/shockEvents';

describe('Shock Events', () => {
  describe('SHOCK_EVENTS', () => {
    it('should have defined shock events', () => {
      expect(SHOCK_EVENTS).toBeDefined();
      expect(SHOCK_EVENTS.length).toBeGreaterThan(0);
    });

    it('should have valid severity ratings', () => {
      SHOCK_EVENTS.forEach((event) => {
        expect(event.severity).toBeGreaterThanOrEqual(1);
        expect(event.severity).toBeLessThanOrEqual(5);
      });
    });

    it('should have required fields', () => {
      SHOCK_EVENTS.forEach((event) => {
        expect(event.event_id).toBeDefined();
        expect(event.label).toBeDefined();
        expect(event.start_date).toBeDefined();
        expect(event.severity).toBeDefined();
        expect(event.description).toBeDefined();
      });
    });
  });

  describe('getShockEventsByDateRange', () => {
    it('should return events within range', () => {
      const events = getShockEventsByDateRange('2023-01-01', '2023-12-31');
      expect(events.length).toBeGreaterThan(0);
    });

    it('should return empty array for range with no events', () => {
      const events = getShockEventsByDateRange('2030-01-01', '2030-12-31');
      expect(events.length).toBe(0);
    });

    it('should include events that overlap range', () => {
      // Oil spike starts 2023-01-15, ends 2023-04-30
      const events = getShockEventsByDateRange('2023-02-01', '2023-03-01');
      const oilSpike = events.find((e) => e.event_id === 'oil_spike_2023_q1');
      expect(oilSpike).toBeDefined();
    });
  });
});
