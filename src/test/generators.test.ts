import { describe, it, expect } from 'vitest';
import {
  generateDates,
  generateCrudeOilPrice,
  generateNaturalGasPrice,
  generateIndustrialStressComposite,
} from '../data/synthetic/generators';

describe('Synthetic Data Generators', () => {
  describe('generateDates', () => {
    it('should generate correct number of monthly dates', () => {
      const dates = generateDates('2022-01-01', '2022-12-01', 'monthly');
      expect(dates).toHaveLength(12);
    });

    it('should generate daily dates', () => {
      const dates = generateDates('2022-01-01', '2022-01-07', 'daily');
      expect(dates).toHaveLength(7);
    });

    it('should generate quarterly dates', () => {
      const dates = generateDates('2022-01-01', '2023-01-01', 'quarterly');
      expect(dates).toHaveLength(5);
    });
  });

  describe('generateCrudeOilPrice', () => {
    it('should generate observations with valid prices', () => {
      const dates = generateDates('2022-01-01', '2022-03-01', 'monthly');
      const observations = generateCrudeOilPrice(dates);

      expect(observations).toHaveLength(dates.length);
      observations.forEach((obs) => {
        expect(obs.value).toBeGreaterThan(0);
        expect(obs.value).toBeLessThan(200); // Reasonable upper bound
        expect(obs.date).toBeDefined();
      });
    });

    it('should respect minimum price floor', () => {
      const dates = generateDates('2022-01-01', '2022-03-01', 'monthly');
      const observations = generateCrudeOilPrice(dates);

      observations.forEach((obs) => {
        expect(obs.value).toBeGreaterThanOrEqual(30); // Min price from generator
      });
    });
  });

  describe('generateNaturalGasPrice', () => {
    it('should generate observations with valid gas prices', () => {
      const dates = generateDates('2022-01-01', '2022-03-01', 'monthly');
      const observations = generateNaturalGasPrice(dates);

      expect(observations).toHaveLength(dates.length);
      observations.forEach((obs) => {
        expect(obs.value).toBeGreaterThan(0);
        expect(obs.value).toBeLessThan(50); // Reasonable upper bound
      });
    });
  });

  describe('generateIndustrialStressComposite', () => {
    it('should generate stress values within 0-100 range', () => {
      const dates = generateDates('2022-01-01', '2022-03-01', 'monthly');
      const observations = generateIndustrialStressComposite(dates);

      observations.forEach((obs) => {
        expect(obs.value).toBeGreaterThanOrEqual(0);
        expect(obs.value).toBeLessThanOrEqual(100);
      });
    });
  });
});
