import {
  ComposedChart,
  Line,
  Bar,
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

interface DataSeries {
  key: string;
  label: string;
  type: 'line' | 'bar';
  color?: string;
  yAxisId?: 'left' | 'right';
}

interface CompositeChartProps {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: DataSeries[];
  showGrid?: boolean;
  shockMarkers?: Array<{ date: string; label: string; id: string }>;
}

const DEFAULT_COLORS = [
  '#2563eb', // blue-600
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#059669', // emerald-600
  '#d97706', // amber-600
];

export const CompositeChart = ({
  title,
  description,
  data,
  xKey,
  series,
  showGrid = true,
  shockMarkers = [],
}: CompositeChartProps) => {
  const { showShockOverlay, setSelectedShock } = useDashboardStore();

  const hasRightAxis = series.some((s) => s.yAxisId === 'right');

  const handleShockClick = (shockId: string) => {
    setSelectedShock(shockId);
  };

  return (
    <ChartWrapper title={title} description={description} data={data}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
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
          <YAxis
            yAxisId="left"
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          {hasRightAxis && (
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
          )}
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
          <Legend wrapperStyle={{ fontSize: '12px' }} />

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
          {series.map((s, index) => {
            const color = s.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            const yAxisId = s.yAxisId || 'left';

            if (s.type === 'bar') {
              return (
                <Bar
                  key={s.key}
                  yAxisId={yAxisId}
                  dataKey={s.key}
                  name={s.label}
                  fill={color}
                  opacity={0.8}
                />
              );
            } else {
              return (
                <Line
                  key={s.key}
                  yAxisId={yAxisId}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              );
            }
          })}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
