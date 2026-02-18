import { useState, useEffect } from 'react';
import { createDataProvider } from '../data/dataProviderFactory';
import { useDashboardStore } from '../app/store';
import { TimeSeriesChart } from '../components/charts';
import { KPICard } from '../components/KPICard';
import type { TimeSeries, ShockEvent } from '../models/schemas';

const dataProvider = createDataProvider();

export const DownstreamDemandPage = () => {
  const { startDate, endDate, geography, showShockOverlay } = useDashboardStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [mfgDemand, setMfgDemand] = useState<number | null>(null);
  const [constructionDemand, setConstructionDemand] = useState<number | null>(null);
  const [autoProduction, setAutoProduction] = useState<number | null>(null);
  const [semiCapex, setSemiCapex] = useState<number | null>(null);
  
  const [demandData, setDemandData] = useState<{ mfg: TimeSeries; construction: TimeSeries } | null>(null);
  const [autoData, setAutoData] = useState<TimeSeries | null>(null);
  const [semiData, setSemiData] = useState<TimeSeries | null>(null);
  const [shockEvents, setShockEvents] = useState<ShockEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = { start_date: startDate, end_date: endDate, geography };
        
        const [
          mfgLatest,
          constLatest,
          autoLatest,
          semiLatest,
          mfgSeries,
          constructionSeries,
          autoSeries,
          semiSeries,
          shocks,
        ] = await Promise.all([
          dataProvider.getLatest('manufacturing_demand_index', params),
          dataProvider.getLatest('construction_demand_index', params),
          dataProvider.getLatest('auto_production_proxy', params),
          dataProvider.getLatest('semiconductor_capex_proxy', params),
          dataProvider.getSeries('manufacturing_demand_index', params),
          dataProvider.getSeries('construction_demand_index', params),
          dataProvider.getSeries('auto_production_proxy', params),
          dataProvider.getSeries('semiconductor_capex_proxy', params),
          dataProvider.getShockEventsByDateRange(startDate, endDate),
        ]);
        
        setMfgDemand(mfgLatest);
        setConstructionDemand(constLatest);
        setAutoProduction(autoLatest);
        setSemiCapex(semiLatest);
        setDemandData({ mfg: mfgSeries, construction: constructionSeries });
        setAutoData(autoSeries);
        setSemiData(semiSeries);
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
        <div className="text-slate-600">Loading downstream demand data...</div>
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

  const mergedDemandData = demandData
    ? demandData.mfg.observations.map((obs, idx) => ({
        date: obs.date,
        manufacturing: obs.value,
        construction: demandData.construction.observations[idx]?.value || 0,
      }))
    : [];

  const shockMarkers = showShockOverlay
    ? shockEvents.map((s) => ({
        date: s.start_date,
        label: s.label,
        id: s.event_id,
      }))
    : [];

  const demandHeatmap = demandData
    ? [
        {
          sector: 'Manufacturing',
          q1: demandData.mfg.observations[Math.floor(demandData.mfg.observations.length * 0.25)]?.value || 0,
          q2: demandData.mfg.observations[Math.floor(demandData.mfg.observations.length * 0.5)]?.value || 0,
          q3: demandData.mfg.observations[Math.floor(demandData.mfg.observations.length * 0.75)]?.value || 0,
          q4: demandData.mfg.observations[demandData.mfg.observations.length - 1]?.value || 0,
        },
        {
          sector: 'Construction',
          q1: demandData.construction.observations[Math.floor(demandData.construction.observations.length * 0.25)]?.value || 0,
          q2: demandData.construction.observations[Math.floor(demandData.construction.observations.length * 0.5)]?.value || 0,
          q3: demandData.construction.observations[Math.floor(demandData.construction.observations.length * 0.75)]?.value || 0,
          q4: demandData.construction.observations[demandData.construction.observations.length - 1]?.value || 0,
        },
        {
          sector: 'Automotive',
          q1: autoData?.observations[Math.floor(autoData.observations.length * 0.25)]?.value || 0,
          q2: autoData?.observations[Math.floor(autoData.observations.length * 0.5)]?.value || 0,
          q3: autoData?.observations[Math.floor(autoData.observations.length * 0.75)]?.value || 0,
          q4: autoData?.observations[autoData.observations.length - 1]?.value || 0,
        },
        {
          sector: 'Semiconductors',
          q1: semiData?.observations[Math.floor(semiData.observations.length * 0.25)]?.value || 0,
          q2: semiData?.observations[Math.floor(semiData.observations.length * 0.5)]?.value || 0,
          q3: semiData?.observations[Math.floor(semiData.observations.length * 0.75)]?.value || 0,
          q4: semiData?.observations[semiData.observations.length - 1]?.value || 0,
        },
      ]
    : [];

  const getHeatmapColor = (value: number, max: number) => {
    const intensity = Math.min(value / max, 1);
    const hue = 240 - intensity * 60;
    return `hsl(${hue}, 70%, ${90 - intensity * 40}%)`;
  };

  const maxValue = Math.max(...demandHeatmap.flatMap((row) => [row.q1, row.q2, row.q3, row.q4]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Downstream Demand</h1>
        <p className="text-slate-600">
          Analysis of chemical product demand across key downstream sectors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Manufacturing Demand"
          value={mfgDemand?.toFixed(1) || '—'}
          unit="Index"
          description="Demand from downstream manufacturing sectors"
        />
        <KPICard
          label="Construction Demand"
          value={constructionDemand?.toFixed(1) || '—'}
          unit="Index"
          description="Construction sector chemical product demand"
        />
        <KPICard
          label="Auto Production"
          value={autoProduction?.toFixed(0) || '—'}
          unit="K units"
          description="Automotive production volume proxy"
        />
        <KPICard
          label="Semiconductor CapEx"
          value={semiCapex?.toFixed(1) || '—'}
          unit="B USD"
          description="Semiconductor capital expenditure proxy"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TimeSeriesChart
          title="Manufacturing and Construction Demand"
          description="Demand indices from two major downstream chemical consumption sectors"
          data={mergedDemandData}
          xKey="date"
          yKeys={[
            { key: 'manufacturing', label: 'Manufacturing Demand', color: '#2563eb' },
            { key: 'construction', label: 'Construction Demand', color: '#059669' },
          ]}
          shockMarkers={shockMarkers}
        />

        {autoData && (
          <TimeSeriesChart
            title="Auto Production Proxy"
            description="Automotive production volume as a proxy for specialty chemical demand"
            data={autoData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Production (K units)', color: '#7c3aed' }]}
            chartType="area"
            shockMarkers={shockMarkers}
          />
        )}

        {semiData && (
          <TimeSeriesChart
            title="Semiconductor CapEx Proxy"
            description="Semiconductor capital expenditure indicating specialty chemical demand for advanced materials"
            data={semiData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'CapEx (B USD)', color: '#db2777' }]}
            shockMarkers={shockMarkers}
          />
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Demand Heatmap by Sector</h2>
          <p className="text-sm text-slate-600 mb-4">
            Normalized demand intensity across downstream sectors by quarter
          </p>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 font-semibold text-slate-700">Sector</th>
                  <th className="text-center py-2 px-3 font-semibold text-slate-700">Q1</th>
                  <th className="text-center py-2 px-3 font-semibold text-slate-700">Q2</th>
                  <th className="text-center py-2 px-3 font-semibold text-slate-700">Q3</th>
                  <th className="text-center py-2 px-3 font-semibold text-slate-700">Q4</th>
                </tr>
              </thead>
              <tbody>
                {demandHeatmap.map((row) => (
                  <tr key={row.sector} className="border-b border-slate-100">
                    <td className="py-3 px-3 font-medium text-slate-700">{row.sector}</td>
                    <td
                      className="text-center py-3 px-3 font-medium"
                      style={{ backgroundColor: getHeatmapColor(row.q1, maxValue) }}
                    >
                      {row.q1.toFixed(0)}
                    </td>
                    <td
                      className="text-center py-3 px-3 font-medium"
                      style={{ backgroundColor: getHeatmapColor(row.q2, maxValue) }}
                    >
                      {row.q2.toFixed(0)}
                    </td>
                    <td
                      className="text-center py-3 px-3 font-medium"
                      style={{ backgroundColor: getHeatmapColor(row.q3, maxValue) }}
                    >
                      {row.q3.toFixed(0)}
                    </td>
                    <td
                      className="text-center py-3 px-3 font-medium"
                      style={{ backgroundColor: getHeatmapColor(row.q4, maxValue) }}
                    >
                      {row.q4.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-green-900 mb-2">Demand Drivers</h3>
        <p className="text-sm text-green-800">
          Chemical demand is highly cyclical and tied to downstream manufacturing activity. Automotive
          production drives demand for specialty polymers, coatings, and adhesives. Construction activity
          affects demand for building materials, insulation, and paints. Semiconductor manufacturing requires
          ultra-pure chemicals and advanced materials.
        </p>
      </div>
    </div>
  );
};
