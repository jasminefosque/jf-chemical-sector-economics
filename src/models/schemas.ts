import { z } from 'zod';

// Frequency enum
export const FrequencyEnum = z.enum(['daily', 'weekly', 'monthly', 'quarterly']);
export type Frequency = z.infer<typeof FrequencyEnum>;

// Observation schema
export const ObservationSchema = z.object({
  date: z.string(), // ISO date string
  value: z.number(),
});
export type Observation = z.infer<typeof ObservationSchema>;

// Time series schema
export const TimeSeriesSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  unit: z.string(),
  frequency: FrequencyEnum,
  observations: z.array(ObservationSchema),
  geography: z.string().optional(),
  sector: z.string().optional(),
  notes: z.string().optional(),
});
export type TimeSeries = z.infer<typeof TimeSeriesSchema>;

// Shock event schema
export const ShockEventSchema = z.object({
  event_id: z.string(),
  label: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),
  severity: z.number().min(1).max(5),
  description: z.string(),
  affected_metrics: z.array(z.string()).optional(),
});
export type ShockEvent = z.infer<typeof ShockEventSchema>;

// Data query parameters
export interface QueryParams {
  start_date?: string;
  end_date?: string;
  geography?: string;
  sector?: string;
}

// Metadata for a metric
export interface MetricMetadata {
  metric_id: string;
  label: string;
  unit: string;
  description: string;
  category: string;
  value_range?: [number, number];
}
