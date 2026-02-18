import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ChartWrapper } from './ChartWrapper';
import { useDashboardStore } from '../../app/store';

interface TimeSeriesChartProps {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKeys: Array<{ key: string; label: string; color?: string }>;
  chartType?: 'line' | 'area';
  showGrid?: boolean;
  showLegend?: boolean;
  shockMarkers?: Array<{ date: string; label: string; id: string }>;
}

const DEFAULT_COLORS = [
  '#2563eb', // blue-600
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#059669', // emerald-600
  '#d97706', // amber-600
];

export const TimeSeriesChart = ({
  title,
  description,
  data,
  xKey,
  yKeys,
  chartType = 'line',
  showGrid = true,
  showLegend = true,
  shockMarkers = [],
}: TimeSeriesChartProps) => {
  const { showShockOverlay, setSelectedShock } = useDashboardStore();

  const ChartComponent = chartType === 'area' ? AreaChart : LineChart;
  const DataComponent = chartType === 'area' ? Area : Line;

  const handleShockClick = (shockId: string) => {
    setSelectedShock(shockId);
  };

  return (
    <ChartWrapper title={title} description={description} data={data}>
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={data}>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          )}
          <XAxis
            dataKey={xKey}
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                month: 'short',
                year: '2-digit',
              });
            }}
          />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '12px',
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              });
            }}
          />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
          )}

          {/* Shock event markers */}
          {showShockOverlay &&
            shockMarkers.map((marker) => (
              <ReferenceLine
                key={marker.id}
                x={marker.date}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: marker.label,
                  position: 'top',
                  fill: '#ef4444',
                  fontSize: 10,
                }}
                onClick={() => handleShockClick(marker.id)}
                style={{ cursor: 'pointer' }}
              />
            ))}

          {/* Data series */}
          {yKeys.map((series, index) => (
            <DataComponent
              key={series.key}
              type="monotone"
              dataKey={series.key}
              name={series.label}
              stroke={series.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              fill={
                chartType === 'area'
                  ? series.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]
                  : undefined
              }
              fillOpacity={chartType === 'area' ? 0.3 : undefined}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
