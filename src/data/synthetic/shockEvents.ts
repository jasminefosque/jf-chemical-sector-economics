import { ShockEvent } from '../../models/schemas';

/**
 * Predefined shock events for industrial sector simulation
 */
export const SHOCK_EVENTS: ShockEvent[] = [
  {
    event_id: 'oil_spike_2023_q1',
    label: 'Oil Price Spike',
    start_date: '2023-01-15',
    end_date: '2023-04-30',
    severity: 4,
    description: 'Geopolitical tensions led to crude oil prices surging 35% above baseline',
    affected_metrics: ['crude_oil_price', 'input_cost_index', 'margin_pressure_index'],
  },
  {
    event_id: 'feedstock_disruption_2023_q2',
    label: 'Feedstock Supply Disruption',
    start_date: '2023-05-01',
    end_date: '2023-06-30',
    severity: 3,
    description: 'Natural gas supply chain disruption affecting petrochemical inputs',
    affected_metrics: ['natural_gas_price', 'feedstock_spread_index', 'capacity_utilization_percent'],
  },
  {
    event_id: 'regulatory_tightening_2023_q3',
    label: 'Environmental Regulatory Tightening',
    start_date: '2023-07-01',
    end_date: '2024-12-31',
    severity: 3,
    description: 'New emissions standards increase compliance costs by 15-20%',
    affected_metrics: ['environmental_cost_index', 'regulatory_intensity_index', 'margin_pressure_index'],
  },
  {
    event_id: 'manufacturing_slowdown_2023_q4',
    label: 'Manufacturing Sector Slowdown',
    start_date: '2023-10-01',
    end_date: '2024-03-31',
    severity: 4,
    description: 'Global manufacturing PMI contraction reducing chemical demand',
    affected_metrics: ['manufacturing_demand_index', 'chemical_output_index', 'capacity_utilization_percent'],
  },
  {
    event_id: 'trade_restriction_2024_q1',
    label: 'Trade Policy Restrictions',
    start_date: '2024-01-01',
    end_date: '2024-06-30',
    severity: 2,
    description: 'New tariffs on chemical exports to key markets',
    affected_metrics: ['export_dependency_ratio', 'global_demand_index'],
  },
  {
    event_id: 'demand_recovery_2024_q2',
    label: 'Demand Recovery',
    start_date: '2024-04-01',
    end_date: '2024-09-30',
    severity: 2,
    description: 'Construction and automotive sectors rebound, boosting chemical demand',
    affected_metrics: ['construction_demand_index', 'auto_production_proxy', 'manufacturing_demand_index'],
  },
  {
    event_id: 'natural_gas_crisis_2024_q3',
    label: 'Natural Gas Price Crisis',
    start_date: '2024-07-01',
    end_date: '2024-10-31',
    severity: 5,
    description: 'Winter supply concerns drive natural gas prices to multi-year highs',
    affected_metrics: ['natural_gas_price', 'input_cost_index', 'margin_pressure_index', 'capacity_utilization_percent'],
  },
];

/**
 * Get shock events within a date range
 */
export function getShockEventsByDateRange(startDate: string, endDate: string): ShockEvent[] {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return SHOCK_EVENTS.filter(event => {
    const eventStart = new Date(event.start_date);
    const eventEnd = event.end_date ? new Date(event.end_date) : new Date();

    // Event overlaps with range if: event starts before range ends AND event ends after range starts
    return eventStart <= end && eventEnd >= start;
  });
}

/**
 * Check if a date falls within any shock event affecting a metric
 */
export function getActiveShock(date: string, metricId: string): ShockEvent | null {
  const checkDate = new Date(date);

  for (const event of SHOCK_EVENTS) {
    if (!event.affected_metrics?.includes(metricId)) continue;

    const eventStart = new Date(event.start_date);
    const eventEnd = event.end_date ? new Date(event.end_date) : new Date('2099-12-31');

    if (checkDate >= eventStart && checkDate <= eventEnd) {
      return event;
    }
  }

  return null;
}
