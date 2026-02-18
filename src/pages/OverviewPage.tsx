import { useState, useEffect } from 'react';
import { createDataProvider } from '../data/dataProviderFactory';
import { useDashboardStore } from '../app/store';
import { KPICard } from '../components/KPICard';
import { TimeSeriesChart, CompositeChart } from '../components/charts';
import type { TimeSeries, ShockEvent } from '../models/schemas';

const dataProvider = createDataProvider();

export const OverviewPage = () => {
  const { startDate, endDate, geography, showShockOverlay } = useDashboardStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [oilPrice, setOilPrice] = useState<number | null>(null);
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [capacityUtil, setCapacityUtil] = useState<number | null>(null);
  const [marginPressure, setMarginPressure] = useState<number | null>(null);
  const [stressComposite, setStressComposite] = useState<number | null>(null);
  
  const [stressData, setStressData] = useState<TimeSeries | null>(null);
  const [oilGasData, setOilGasData] = useState<{ oil: TimeSeries; gas: TimeSeries } | null>(null);
  const [capacityData, setCapacityData] = useState<TimeSeries | null>(null);
  const [shockEvents, setShockEvents] = useState<ShockEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = { start_date: startDate, end_date: endDate, geography };
        
        const [
          oilLatest,
          gasLatest,
          capLatest,
          marginLatest,
          stressLatest,
          stressSeries,
          oilSeries,
          gasSeries,
          capacitySeries,
          shocks,
        ] = await Promise.all([
          dataProvider.getLatest('crude_oil_price', params),
          dataProvider.getLatest('natural_gas_price', params),
          dataProvider.getLatest('capacity_utilization_percent', params),
          dataProvider.getLatest('margin_pressure_index', params),
          dataProvider.getLatest('industrial_stress_composite', params),
          dataProvider.getSeries('industrial_stress_composite', params),
          dataProvider.getSeries('crude_oil_price', params),
          dataProvider.getSeries('natural_gas_price', params),
          dataProvider.getSeries('capacity_utilization_percent', params),
          dataProvider.getShockEventsByDateRange(startDate, endDate),
        ]);
        
        setOilPrice(oilLatest);
        setGasPrice(gasLatest);
        setCapacityUtil(capLatest);
        setMarginPressure(marginLatest);
        setStressComposite(stressLatest);
        setStressData(stressSeries);
        setOilGasData({ oil: oilSeries, gas: gasSeries });
        setCapacityData(capacitySeries);
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
        <div className="text-slate-600">Loading dashboard data...</div>
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
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h1>
        <p className="text-slate-600">
          Comprehensive view of chemical sector economics and industrial stress indicators
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          label="Oil Price"
          value={oilPrice?.toFixed(2) || '—'}
          unit="USD/bbl"
          description="West Texas Intermediate crude oil spot price"
        />
        <KPICard
          label="Natural Gas Price"
          value={gasPrice?.toFixed(2) || '—'}
          unit="USD/MMBtu"
          description="Henry Hub natural gas spot price"
        />
        <KPICard
          label="Capacity Utilization"
          value={capacityUtil?.toFixed(1) || '—'}
          unit="%"
          description="Chemical manufacturing capacity utilization rate"
        />
        <KPICard
          label="Margin Pressure"
          value={marginPressure?.toFixed(1) || '—'}
          unit="Score"
          description="Profitability pressure from cost-price squeeze"
        />
        <KPICard
          label="Industrial Stress"
          value={stressComposite?.toFixed(1) || '—'}
          unit="Score"
          description="Composite indicator of industrial sector stress"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {stressData && (
          <CompositeChart
            title="Industrial Stress Composite"
            description="Composite indicator combining margin pressure, capacity constraints, and demand volatility"
            data={stressData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            series={[{ key: 'value', label: 'Stress Score', type: 'line', color: '#dc2626' }]}
            shockMarkers={shockMarkers}
          />
        )}

        <TimeSeriesChart
          title="Oil and Natural Gas Prices"
          description="Primary feedstock cost drivers with shock event overlays"
          data={mergedOilGasData}
          xKey="date"
          yKeys={[
            { key: 'oil', label: 'Crude Oil (USD/bbl)', color: '#2563eb' },
            { key: 'gas', label: 'Natural Gas (USD/MMBtu)', color: '#059669' },
          ]}
          shockMarkers={shockMarkers}
        />

        {capacityData && (
          <TimeSeriesChart
            title="Capacity Utilization Trend"
            description="Chemical manufacturing capacity utilization over time"
            data={capacityData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Utilization (%)', color: '#7c3aed' }]}
            chartType="area"
            shockMarkers={shockMarkers}
          />
        )}
      </div>
    </div>
  );
};
