import { useState, useEffect } from 'react';
import { createDataProvider } from '../data/dataProviderFactory';
import { useDashboardStore } from '../app/store';
import { TimeSeriesChart } from '../components/charts';
import { KPICard } from '../components/KPICard';
import type { TimeSeries, ShockEvent } from '../models/schemas';

const dataProvider = createDataProvider();

export const RegulatoryPressurePage = () => {
  const { startDate, endDate, geography, showShockOverlay } = useDashboardStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [envCost, setEnvCost] = useState<number | null>(null);
  const [regIntensity, setRegIntensity] = useState<number | null>(null);
  const [complianceBurden, setComplianceBurden] = useState<number | null>(null);
  
  const [envCostData, setEnvCostData] = useState<TimeSeries | null>(null);
  const [regIntensityData, setRegIntensityData] = useState<TimeSeries | null>(null);
  const [complianceData, setComplianceData] = useState<TimeSeries | null>(null);
  const [shockEvents, setShockEvents] = useState<ShockEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = { start_date: startDate, end_date: endDate, geography };
        
        const [
          envLatest,
          regLatest,
          compLatest,
          envSeries,
          regSeries,
          compSeries,
          shocks,
        ] = await Promise.all([
          dataProvider.getLatest('environmental_cost_index', params),
          dataProvider.getLatest('regulatory_intensity_index', params),
          dataProvider.getLatest('compliance_burden_score', params),
          dataProvider.getSeries('environmental_cost_index', params),
          dataProvider.getSeries('regulatory_intensity_index', params),
          dataProvider.getSeries('compliance_burden_score', params),
          dataProvider.getShockEventsByDateRange(startDate, endDate),
        ]);
        
        setEnvCost(envLatest);
        setRegIntensity(regLatest);
        setComplianceBurden(compLatest);
        setEnvCostData(envSeries);
        setRegIntensityData(regSeries);
        setComplianceData(compSeries);
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
        <div className="text-slate-600">Loading regulatory pressure data...</div>
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

  const shockMarkers = showShockOverlay
    ? shockEvents.map((s) => ({
        date: s.start_date,
        label: s.label,
        id: s.event_id,
      }))
    : [];

  const regulatoryCategories = [
    {
      name: 'Environmental Compliance',
      description: 'Air quality, water discharge, hazardous waste management',
      impact: 'High',
      trend: 'Increasing',
      color: '#2563eb',
    },
    {
      name: 'Safety Regulations',
      description: 'Worker safety, process safety management, emergency response',
      impact: 'Medium',
      trend: 'Stable',
      color: '#059669',
    },
    {
      name: 'Chemical Registration',
      description: 'Product registration, safety data sheets, labeling requirements',
      impact: 'Medium',
      trend: 'Increasing',
      color: '#7c3aed',
    },
    {
      name: 'Climate Policy',
      description: 'Carbon pricing, emissions caps, renewable energy mandates',
      impact: 'High',
      trend: 'Increasing',
      color: '#dc2626',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Regulatory Pressure</h1>
        <p className="text-slate-600">
          Analysis of environmental compliance costs and regulatory intensity affecting the chemical sector
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          label="Environmental Cost"
          value={envCost?.toFixed(1) || '—'}
          unit="Index"
          description="Compliance costs for environmental regulations"
        />
        <KPICard
          label="Regulatory Intensity"
          value={regIntensity?.toFixed(1) || '—'}
          unit="Index"
          description="Overall regulatory intensity affecting sector"
        />
        <KPICard
          label="Compliance Burden"
          value={complianceBurden?.toFixed(1) || '—'}
          unit="Score"
          description="Administrative compliance burden"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {envCostData && (
          <TimeSeriesChart
            title="Environmental Cost Index"
            description="Tracking compliance costs for environmental regulations over time"
            data={envCostData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Environmental Cost Index', color: '#2563eb' }]}
            chartType="area"
            shockMarkers={shockMarkers}
          />
        )}

        {regIntensityData && (
          <TimeSeriesChart
            title="Regulatory Intensity Index"
            description="Composite measure of regulatory intensity affecting chemical sector operations"
            data={regIntensityData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Regulatory Intensity', color: '#7c3aed' }]}
            shockMarkers={shockMarkers}
          />
        )}

        {complianceData && (
          <TimeSeriesChart
            title="Compliance Burden Score"
            description="Administrative burden score for regulatory compliance activities"
            data={complianceData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Compliance Burden', color: '#dc2626' }]}
            chartType="area"
            shockMarkers={shockMarkers}
          />
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Regulatory Categories</h2>
          <p className="text-sm text-slate-600 mb-6">
            Major regulatory categories affecting chemical sector operations
          </p>
          
          <div className="space-y-4">
            {regulatoryCategories.map((category) => (
              <div
                key={category.name}
                className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1 h-12 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <div>
                      <h3 className="font-semibold text-slate-800">{category.name}</h3>
                      <p className="text-xs text-slate-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-3 ml-7">
                  <div className="flex-1">
                    <div className="text-xs text-slate-600">Impact Level</div>
                    <div
                      className={`text-sm font-semibold mt-1 ${
                        category.impact === 'High'
                          ? 'text-red-600'
                          : category.impact === 'Medium'
                          ? 'text-amber-600'
                          : 'text-green-600'
                      }`}
                    >
                      {category.impact}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-600">Trend</div>
                    <div className="text-sm font-semibold text-slate-800 mt-1">
                      {category.trend}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Cost Impact Assessment</h2>
          <p className="text-sm text-slate-600 mb-6">
            Estimated annual compliance cost breakdown
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-xs text-blue-600 font-medium mb-1">Direct Costs</div>
              <div className="text-2xl font-bold text-blue-900">$2.3B</div>
              <div className="text-xs text-blue-700 mt-1">Equipment, monitoring, reporting</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-xs text-purple-600 font-medium mb-1">Indirect Costs</div>
              <div className="text-2xl font-bold text-purple-900">$1.7B</div>
              <div className="text-xs text-purple-700 mt-1">Admin, legal, consulting</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-xs text-green-600 font-medium mb-1">Capital Investment</div>
              <div className="text-2xl font-bold text-green-900">$4.1B</div>
              <div className="text-xs text-green-700 mt-1">Pollution control, upgrades</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-xs text-red-600 font-medium mb-1">Total Annual</div>
              <div className="text-2xl font-bold text-red-900">$8.1B</div>
              <div className="text-xs text-red-700 mt-1">≈ 3.2% of sector revenue</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-red-900 mb-2">Regulatory Outlook</h3>
        <p className="text-sm text-red-800">
          The chemical sector faces increasing regulatory pressure from environmental, climate, and safety
          regulations. Compliance costs are trending upward, particularly for greenhouse gas emissions and
          chemical safety requirements. Companies must factor these rising costs into long-term planning and
          capital allocation decisions. Regulatory changes can significantly impact profitability margins.
        </p>
      </div>
    </div>
  );
};
