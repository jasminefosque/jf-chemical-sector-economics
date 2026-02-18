import { useState, useEffect } from 'react';
import { createDataProvider } from '../data/dataProviderFactory';
import { useDashboardStore } from '../app/store';
import { DualAxisChart, TimeSeriesChart } from '../components/charts';
import type { TimeSeries, ShockEvent } from '../models/schemas';

const dataProvider = createDataProvider();

export const CostStructurePage = () => {
  const { startDate, endDate, geography, showShockOverlay } = useDashboardStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [costMarginData, setCostMarginData] = useState<{ cost: TimeSeries; margin: TimeSeries } | null>(null);
  const [marginData, setMarginData] = useState<TimeSeries | null>(null);
  const [shockEvents, setShockEvents] = useState<ShockEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = { start_date: startDate, end_date: endDate, geography };
        
        const [costSeries, marginSeries, shocks] = await Promise.all([
          dataProvider.getSeries('input_cost_index', params),
          dataProvider.getSeries('margin_pressure_index', params),
          dataProvider.getShockEventsByDateRange(startDate, endDate),
        ]);
        
        setCostMarginData({ cost: costSeries, margin: marginSeries });
        setMarginData(marginSeries);
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
        <div className="text-slate-600">Loading cost structure data...</div>
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

  const mergedCostMarginData = costMarginData
    ? costMarginData.cost.observations.map((obs, idx) => ({
        date: obs.date,
        cost: obs.value,
        margin: costMarginData.margin.observations[idx]?.value || 0,
      }))
    : [];

  const shockMarkers = showShockOverlay
    ? shockEvents.map((s) => ({
        date: s.start_date,
        label: s.label,
        id: s.event_id,
      }))
    : [];

  const costBreakdown = marginData
    ? [
        {
          category: 'Raw Materials',
          percentage: 45,
          value: 45,
          trend: '+2.3%',
          color: '#2563eb',
        },
        {
          category: 'Energy Costs',
          percentage: 30,
          value: 30,
          trend: '+5.1%',
          color: '#7c3aed',
        },
        {
          category: 'Labor',
          percentage: 15,
          value: 15,
          trend: '+1.2%',
          color: '#db2777',
        },
        {
          category: 'Other Operating',
          percentage: 10,
          value: 10,
          trend: '+0.8%',
          color: '#059669',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Cost Structure Analysis</h1>
        <p className="text-slate-600">
          Examination of input costs, margin pressure, and cost composition in chemical manufacturing
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <DualAxisChart
          title="Input Cost Index vs Margin Pressure Index"
          description="Relationship between rising input costs and profitability margin pressure"
          data={mergedCostMarginData}
          xKey="date"
          leftAxis={{ key: 'cost', label: 'Input Cost Index', color: '#2563eb' }}
          rightAxis={{ key: 'margin', label: 'Margin Pressure Score', color: '#dc2626' }}
          shockMarkers={shockMarkers}
        />

        {marginData && (
          <TimeSeriesChart
            title="Margin Pressure Timeline"
            description="Historical profitability pressure from cost-price squeeze dynamics"
            data={marginData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Margin Pressure Score', color: '#dc2626' }]}
            chartType="area"
            shockMarkers={shockMarkers}
          />
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Cost Breakdown Analysis</h2>
          <p className="text-sm text-slate-600 mb-6">
            Typical chemical manufacturing cost composition and recent trends
          </p>
          
          <div className="space-y-4">
            {costBreakdown.map((item) => (
              <div key={item.category} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-slate-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-slate-800">
                      {item.percentage}%
                    </span>
                    <span className="ml-3 text-sm text-slate-500">{item.trend}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-amber-900 mb-2">Analytical Insight</h3>
        <p className="text-sm text-amber-800">
          Margin pressure increases when input costs rise faster than product prices. Monitor the relationship
          between the Input Cost Index and Margin Pressure Index to identify profitability stress periods.
          High margin pressure often correlates with reduced capacity utilization and production cutbacks.
        </p>
      </div>
    </div>
  );
};
