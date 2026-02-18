interface KPICardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  description?: string;
}

export const KPICard = ({
  label,
  value,
  unit,
  change,
  changeLabel = 'vs previous period',
  description,
}: KPICardProps) => {
  const formatChange = (val: number) => {
    const sign = val >= 0 ? '+' : '';
    return `${sign}${val.toFixed(1)}%`;
  };

  const getChangeColor = (val: number) => {
    if (val > 0) return 'text-green-600';
    if (val < 0) return 'text-red-600';
    return 'text-slate-600';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wide">
          {label}
        </h3>
        {description && (
          <button
            className="text-slate-400 hover:text-slate-600"
            title={description}
            aria-label="More information"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-baseline space-x-2">
        <span className="text-3xl font-semibold text-slate-800">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {unit && <span className="text-lg text-slate-500">{unit}</span>}
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center space-x-2">
          <span className={`text-sm font-medium ${getChangeColor(change)}`}>
            {formatChange(change)}
          </span>
          <span className="text-xs text-slate-500">{changeLabel}</span>
        </div>
      )}
    </div>
  );
};
