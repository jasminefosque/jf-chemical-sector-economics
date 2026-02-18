import { useRef } from 'react';
import type { ReactNode } from 'react';
import { toPng } from 'html-to-image';

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
  data?: unknown[];
  sourceNote?: string;
}

export const ChartWrapper = ({
  title,
  description,
  children,
  data = [],
  sourceNote = 'Synthetic Data - Portfolio Mode',
}: ChartWrapperProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExportPNG = async () => {
    if (!chartRef.current) return;

    try {
      const dataUrl = await toPng(chartRef.current, {
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export chart as PNG:', error);
    }
  };

  const handleDownloadJSON = () => {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.json`;
      link.href = url;
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download data as JSON:', error);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
        <div className="flex items-start space-x-2">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          {description && (
            <button
              className="text-slate-400 hover:text-slate-600 mt-1"
              title={description}
              aria-label="Chart description"
            >
              <svg
                className="w-5 h-5"
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

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPNG}
            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors flex items-center space-x-1"
            title="Export as PNG"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>PNG</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors flex items-center space-x-1"
            title="Download data as JSON"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Chart Content */}
      <div ref={chartRef} className="p-6">
        {children}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
        <p className="text-xs text-slate-500">{sourceNote}</p>
      </div>
    </div>
  );
};
