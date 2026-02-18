import {
  LineChart,
  Line,
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

interface DualAxisChartProps {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xKey: string;
  leftAxis: { key: string; label: string; color?: string };
  rightAxis: { key: string; label: string; color?: string };
  showGrid?: boolean;
  shockMarkers?: Array<{ date: string; label: string; id: string }>;
}

export const DualAxisChart = ({
  title,
  description,
  data,
  xKey,
  leftAxis,
  rightAxis,
  showGrid = true,
  shockMarkers = [],
}: DualAxisChartProps) => {
  const { showShockOverlay, setSelectedShock } = useDashboardStore();

  const leftColor = leftAxis.color || '#2563eb';
  const rightColor = rightAxis.color || '#7c3aed';

  const handleShockClick = (shockId: string) => {
    setSelectedShock(shockId);
  };

  return (
    <ChartWrapper title={title} description={description} data={data}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
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
            stroke={leftColor}
            style={{ fontSize: '12px' }}
            label={{
              value: leftAxis.label,
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '12px', fill: leftColor },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={rightColor}
            style={{ fontSize: '12px' }}
            label={{
              value: rightAxis.label,
              angle: 90,
              position: 'insideRight',
              style: { fontSize: '12px', fill: rightColor },
            }}
          />
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
          <Legend wrapperStyle={{ fontSize: '12px' }} iconType="line" />

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

          <Line
            yAxisId="left"
            type="monotone"
            dataKey={leftAxis.key}
            name={leftAxis.label}
            stroke={leftColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={rightAxis.key}
            name={rightAxis.label}
            stroke={rightColor}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
