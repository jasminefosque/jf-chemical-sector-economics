import { useEffect, useState } from 'react';
import { useDashboardStore } from '../app/store';
import { createDataProvider } from '../data/dataProviderFactory';
import type { ShockEvent } from '../models/schemas';

export const ShockEventModal = () => {
  const { selectedShockId, setSelectedShock } = useDashboardStore();
  const [shockEvent, setShockEvent] = useState<ShockEvent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedShockId) {
      setShockEvent(null);
      return;
    }

    const loadShockEvent = async () => {
      setLoading(true);
      try {
        const provider = createDataProvider();
        const events = await provider.getShockEvents();
        const event = events.find((e) => e.event_id === selectedShockId);
        setShockEvent(event || null);
      } catch (error) {
        console.error('Failed to load shock event:', error);
        setShockEvent(null);
      } finally {
        setLoading(false);
      }
    };

    loadShockEvent();
  }, [selectedShockId]);

  if (!selectedShockId) return null;

  const handleClose = () => {
    setSelectedShock(null);
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return 'bg-red-100 text-red-800';
    if (severity === 3) return 'bg-orange-100 text-orange-800';
    if (severity === 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 4) return 'Critical';
    if (severity === 3) return 'High';
    if (severity === 2) return 'Medium';
    return 'Low';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
        onClick={handleClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-slate-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
            <h2 className="text-xl font-semibold">Shock Event Details</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-slate-700 rounded transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : shockEvent ? (
              <div className="space-y-4">
                {/* Title and Severity */}
                <div className="flex items-start justify-between">
                  <h3 className="text-2xl font-semibold text-slate-800">
                    {shockEvent.label}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                      shockEvent.severity
                    )}`}
                  >
                    {getSeverityLabel(shockEvent.severity)} Impact
                  </span>
                </div>

                {/* Dates */}
                <div className="flex items-center space-x-6 text-sm text-slate-600">
                  <div>
                    <span className="font-medium">Start:</span>{' '}
                    {new Date(shockEvent.start_date).toLocaleDateString()}
                  </div>
                  {shockEvent.end_date && (
                    <div>
                      <span className="font-medium">End:</span>{' '}
                      {new Date(shockEvent.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    {shockEvent.description}
                  </p>
                </div>

                {/* Affected Metrics */}
                {shockEvent.affected_metrics && shockEvent.affected_metrics.length > 0 && (
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">
                      Affected Metrics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {shockEvent.affected_metrics.map((metric) => (
                        <span
                          key={metric}
                          className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                Event not found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 rounded-b-lg flex justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
