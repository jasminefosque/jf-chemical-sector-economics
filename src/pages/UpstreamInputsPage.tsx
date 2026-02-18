import { useState, useEffect } from 'react';
import { createDataProvider } from '../data/dataProviderFactory';
import { useDashboardStore } from '../app/store';
import { TimeSeriesChart, DualAxisChart } from '../components/charts';
import type { TimeSeries, ShockEvent } from '../models/schemas';

const dataProvider = createDataProvider();

export const UpstreamInputsPage = () => {
  const { startDate, endDate, geography, showShockOverlay } = useDashboardStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [oilGasData, setOilGasData] = useState<{ oil: TimeSeries; gas: TimeSeries } | null>(null);
  const [feedstockData, setFeedstockData] = useState<TimeSeries | null>(null);
  const [inputCostData, setInputCostData] = useState<TimeSeries | null>(null);
  const [shockEvents, setShockEvents] = useState<ShockEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = { start_date: startDate, end_date: endDate, geography };
        
        const [oilSeries, gasSeries, feedstockSeries, inputCostSeries, shocks] = await Promise.all([
          dataProvider.getSeries('crude_oil_price', params),
          dataProvider.getSeries('natural_gas_price', params),
          dataProvider.getSeries('feedstock_spread_index', params),
          dataProvider.getSeries('input_cost_index', params),
          dataProvider.getShockEventsByDateRange(startDate, endDate),
        ]);
        
        setOilGasData({ oil: oilSeries, gas: gasSeries });
        setFeedstockData(feedstockSeries);
        setInputCostData(inputCostSeries);
        setShockEvents(shocks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [startDate, endDate, geography]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-600">Loading upstream inputs data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const mergedOilGasData = oilGasData
    ? oilGasData.oil.observations.map((obs, idx) => ({
        date: obs.date,
        oil: obs.value,
        gas: oilGasData.gas.observations[idx]?.value || 0,
      }))
    : [];

  const shockMarkers = showShockOverlay
    ? shockEvents.map((s) => ({
        date: s.start_date,
        label: s.label,
        id: s.event_id,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Upstream Inputs</h1>
        <p className="text-slate-600">
          Analysis of primary feedstock costs including crude oil and natural gas pricing dynamics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DualAxisChart
          title="Oil and Natural Gas Prices"
          description="Dual-axis view of primary petrochemical feedstock costs with shock event markers"
          data={mergedOilGasData}
          xKey="date"
          leftAxis={{ key: 'oil', label: 'Crude Oil (USD/bbl)', color: '#2563eb' }}
          rightAxis={{ key: 'gas', label: 'Natural Gas (USD/MMBtu)', color: '#059669' }}
          shockMarkers={shockMarkers}
        />

        {feedstockData && (
          <TimeSeriesChart
            title="Feedstock Spread Index"
            description="Spread between refined chemical products and crude feedstock inputs, indicating profitability margins"
            data={feedstockData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Spread Index', color: '#7c3aed' }]}
            chartType="area"
            shockMarkers={shockMarkers}
          />
        )}

        {inputCostData && (
          <TimeSeriesChart
            title="Input Cost Index"
            description="Composite index of raw material and energy input costs for chemical production"
            data={inputCostData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Cost Index', color: '#db2777' }]}
            shockMarkers={shockMarkers}
          />
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Data Source Notes</h3>
        <p className="text-sm text-blue-800">
          Oil prices based on WTI crude oil spot prices. Natural gas prices based on Henry Hub spot prices.
          Feedstock spread calculated as the differential between output product prices and input costs.
          This portfolio demonstration uses synthetic data modeling real market dynamics.
        </p>
      </div>
    </div>
  );
};
