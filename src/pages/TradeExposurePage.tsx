import { useState, useEffect } from 'react';
import { createDataProvider } from '../data/dataProviderFactory';
import { useDashboardStore } from '../app/store';
import { TimeSeriesChart } from '../components/charts';
import { KPICard } from '../components/KPICard';
import type { TimeSeries, ShockEvent } from '../models/schemas';

const dataProvider = createDataProvider();

export const TradeExposurePage = () => {
  const { startDate, endDate, geography, showShockOverlay } = useDashboardStore();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [exportRatio, setExportRatio] = useState<number | null>(null);
  const [importRatio, setImportRatio] = useState<number | null>(null);
  const [globalDemand, setGlobalDemand] = useState<number | null>(null);
  
  const [exportData, setExportData] = useState<TimeSeries | null>(null);
  const [importData, setImportData] = useState<TimeSeries | null>(null);
  const [globalDemandData, setGlobalDemandData] = useState<TimeSeries | null>(null);
  const [shockEvents, setShockEvents] = useState<ShockEvent[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = { start_date: startDate, end_date: endDate, geography };
        
        const [
          exportLatest,
          importLatest,
          globalLatest,
          exportSeries,
          importSeries,
          globalSeries,
          shocks,
        ] = await Promise.all([
          dataProvider.getLatest('export_dependency_ratio', params),
          dataProvider.getLatest('import_dependency_ratio', params),
          dataProvider.getLatest('global_demand_index', params),
          dataProvider.getSeries('export_dependency_ratio', params),
          dataProvider.getSeries('import_dependency_ratio', params),
          dataProvider.getSeries('global_demand_index', params),
          dataProvider.getShockEventsByDateRange(startDate, endDate),
        ]);
        
        setExportRatio(exportLatest);
        setImportRatio(importLatest);
        setGlobalDemand(globalLatest);
        setExportData(exportSeries);
        setImportData(importSeries);
        setGlobalDemandData(globalSeries);
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
        <div className="text-slate-600">Loading trade exposure data...</div>
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

  const tradeBalance = exportRatio && importRatio ? exportRatio - importRatio : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Trade Exposure</h1>
        <p className="text-slate-600">
          Analysis of chemical sector international trade dependencies and global market exposure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Export Dependency"
          value={exportRatio?.toFixed(1) || '—'}
          unit="%"
          description="Share of chemical production exported internationally"
        />
        <KPICard
          label="Import Dependency"
          value={importRatio?.toFixed(1) || '—'}
          unit="%"
          description="Share of domestic consumption from imports"
        />
        <KPICard
          label="Trade Balance"
          value={tradeBalance?.toFixed(1) || '—'}
          unit="%"
          description="Net trade exposure (export - import dependency)"
        />
        <KPICard
          label="Global Demand"
          value={globalDemand?.toFixed(1) || '—'}
          unit="Index"
          description="Global chemical demand composite index"
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {exportData && (
          <TimeSeriesChart
            title="Export Dependency Ratio"
            description="Share of chemical production exported internationally - indicates exposure to global demand"
            data={exportData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Export Dependency (%)', color: '#2563eb' }]}
            chartType="area"
            shockMarkers={shockMarkers}
          />
        )}

        {importData && (
          <TimeSeriesChart
            title="Import Dependency Ratio"
            description="Share of domestic chemical consumption from imports - indicates supply chain vulnerability"
            data={importData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Import Dependency (%)', color: '#7c3aed' }]}
            chartType="area"
            shockMarkers={shockMarkers}
          />
        )}

        {globalDemandData && (
          <TimeSeriesChart
            title="Global Demand Index"
            description="Composite index of global chemical demand across major markets"
            data={globalDemandData.observations.map((obs) => ({
              date: obs.date,
              value: obs.value,
            }))}
            xKey="date"
            yKeys={[{ key: 'value', label: 'Global Demand Index', color: '#059669' }]}
            shockMarkers={shockMarkers}
          />
        )}

        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Trade Exposure Analysis</h2>
          <p className="text-sm text-slate-600 mb-6">
            Assessment of trade dependency risks and opportunities
          </p>
          
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-700 mb-2">Export Markets</h3>
              <p className="text-sm text-slate-600 mb-3">
                High export dependency indicates exposure to global demand cycles and trade policies
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded p-3">
                  <div className="text-xs text-slate-600 mb-1">Current Level</div>
                  <div className="text-lg font-semibold text-slate-800">
                    {exportRatio?.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-50 rounded p-3">
                  <div className="text-xs text-slate-600 mb-1">Risk Level</div>
                  <div className={`text-lg font-semibold ${
                    (exportRatio || 0) > 40 ? 'text-red-600' : (exportRatio || 0) > 30 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {(exportRatio || 0) > 40 ? 'High' : (exportRatio || 0) > 30 ? 'Medium' : 'Low'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100 pb-4">
              <h3 className="font-semibold text-slate-700 mb-2">Import Dependency</h3>
              <p className="text-sm text-slate-600 mb-3">
                High import dependency indicates supply chain vulnerability to trade disruptions
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded p-3">
                  <div className="text-xs text-slate-600 mb-1">Current Level</div>
                  <div className="text-lg font-semibold text-slate-800">
                    {importRatio?.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-50 rounded p-3">
                  <div className="text-xs text-slate-600 mb-1">Risk Level</div>
                  <div className={`text-lg font-semibold ${
                    (importRatio || 0) > 35 ? 'text-red-600' : (importRatio || 0) > 25 ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {(importRatio || 0) > 35 ? 'High' : (importRatio || 0) > 25 ? 'Medium' : 'Low'}
                  </div>
                </div>
              </div>
            </div>

            <div className="pb-2">
              <h3 className="font-semibold text-slate-700 mb-2">Net Trade Position</h3>
              <p className="text-sm text-slate-600 mb-3">
                Positive balance indicates net exporter status; negative indicates net importer
              </p>
              <div className="bg-slate-50 rounded p-4 text-center">
                <div className="text-xs text-slate-600 mb-1">Trade Balance</div>
                <div className={`text-2xl font-bold ${
                  (tradeBalance || 0) > 0 ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {(tradeBalance || 0) > 0 ? '+' : ''}{tradeBalance?.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {(tradeBalance || 0) > 0 ? 'Net Exporter' : 'Net Importer'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-purple-900 mb-2">Trade Insights</h3>
        <p className="text-sm text-purple-800">
          The chemical sector is highly globalized with significant cross-border trade flows. Export
          dependency makes the sector vulnerable to global demand shocks and trade policy changes.
          Import dependency creates supply chain risks during geopolitical tensions or logistics disruptions.
          Monitor the Global Demand Index for early warnings of international market shifts.
        </p>
      </div>
    </div>
  );
};
