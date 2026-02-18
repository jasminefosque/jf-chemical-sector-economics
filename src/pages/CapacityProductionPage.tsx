import { useState, useEffect } from 'react';
import { createDataProvider } from '../data/dataProviderFactory';
import { useDashboardStore } from '../app/store';
import { TimeSeriesChart, DualAxisChart } from '../components/charts';
import { KPICard } from '../components/KPICard';
import type { TimeSeries, ShockEvent } from '../models/schemas';

const dataProvider = createDataProvider();

export const CapacityProductionPage = () => {
  const { startDate, endDate, geography, showShockOverlay } = useDashboardStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [capacityUtil, setCapacityUtil] = useState<number | null>(null);
  const [chemicalOutput, setChemicalOutput] = useState<number | null>(null);
  const [industrialOutput, setIndustrialOutput] = useState<number | null>(null);
  
  const [capacityData, setCapacityData] = useState<TimeSeries | null>(null);
  const [outputData, setOutputData] = useState<{ chemical: TimeSeries; industrial: TimeSeries } | null>(null);
  const [shockEvents, setShockEvents] = useState<ShockEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = { start_date: startDate, end_date: endDate, geography };
        
        const [
          capUtilLatest,
          chemOutLatest,
          indOutLatest,
          capacitySeries,
          chemicalSeries,
          industrialSeries,
          shocks,
        ] = await Promise.all([
          dataProvider.getLatest('capacity_utilization_percent', params),
          dataProvider.getLatest('chemical_output_index', params),
          dataProvider.getLatest('industrial_production_index', params),
          dataProvider.getSeries('capacity_utilization_percent', params),
          dataProvider.getSeries('chemical_output_index', params),
          dataProvider.getSeries('industrial_production_index', params),
          dataProvider.getShockEventsByDateRange(startDate, endDate),
        ]);
        
        setCapacityUtil(capUtilLatest);
        setChemicalOutput(chemOutLatest);
        setIndustrialOutput(indOutLatest);
        setCapacityData(capacitySeries);
        setOutputData({ chemical: chemicalSeries, industrial: industrialSeries });
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
        <div className="text-slate-600">Loading capacity and production data...</div>
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

  const mergedOutputData = outputData
    ? outputData.chemical.observations.map((obs, idx) => ({
        date: obs.date,
        chemical: obs.value,
        industrial: outputData.industrial.observations[idx]?.value || 0,
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
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Capacity & Production</h1>
        <p className="text-slate-600">
          Chemical sector capacity utilization and production output metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          label="Capacity Utilization"
          value={capacityUtil?.toFixed(1) || '—'}
          unit="%"
          description="Chemical manufacturing capacity utilization rate"
        />
        <KPICard
          label="Chemical Output"
          value={chemicalOutput?.toFixed(1) || '—'}
          unit="Index"
          description="Chemical sector production output volume"
        />
        <KPICard
          label="Industrial Production"
          value={industrialOutput?.toFixed(1) || '—'}
          unit="Index"
          description="Overall industrial production index"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {capacityData && (
          <TimeSeriesChart
            title="Capacity Utilization Trend"
            description="Chemical manufacturing capacity utilization rate over time - a key indicator of sector health"
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

        <DualAxisChart
          title="Chemical Output vs Industrial Production"
          description="Comparison of chemical sector output against broader industrial production trends"
          data={mergedOutputData}
          xKey="date"
          leftAxis={{ key: 'chemical', label: 'Chemical Output Index', color: '#2563eb' }}
          rightAxis={{ key: 'industrial', label: 'Industrial Production Index', color: '#059669' }}
          shockMarkers={shockMarkers}
        />

        {capacityData && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Production Volume Analysis</h2>
            <p className="text-sm text-slate-600 mb-4">
              Historical capacity utilization by quarter
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Period</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-700">Utilization</th>
                    <th className="text-right py-2 px-3 font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {capacityData.observations
                    .filter((_, idx) => idx % 3 === 0)
                    .slice(-8)
                    .map((obs) => {
                      const status =
                        obs.value >= 85
                          ? { label: 'High', color: 'text-green-600' }
                          : obs.value >= 75
                          ? { label: 'Normal', color: 'text-blue-600' }
                          : { label: 'Low', color: 'text-red-600' };
                      return (
                        <tr key={obs.date} className="border-b border-slate-100">
                          <td className="py-2 px-3 text-slate-600">
                            {new Date(obs.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                            })}
                          </td>
                          <td className="text-right py-2 px-3 font-medium text-slate-800">
                            {obs.value.toFixed(1)}%
                          </td>
                          <td className={`text-right py-2 px-3 font-medium ${status.color}`}>
                            {status.label}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Capacity Insights</h3>
        <p className="text-sm text-blue-800">
          Capacity utilization above 85% typically indicates strong demand and potential pricing power.
          Below 70% suggests excess capacity and pricing pressure. Chemical output tends to track overall
          industrial production with a lag due to inventory management and production scheduling.
        </p>
      </div>
    </div>
  );
};
