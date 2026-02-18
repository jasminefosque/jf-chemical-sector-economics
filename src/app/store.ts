import { create } from 'zustand';

interface DashboardState {
  // Date range
  startDate: string;
  endDate: string;
  setDateRange: (start: string, end: string) => void;

  // Geography
  geography: string;
  setGeography: (geography: string) => void;

  // Shock overlay toggle
  showShockOverlay: boolean;
  toggleShockOverlay: () => void;

  // Selected shock event (for modal)
  selectedShockId: string | null;
  setSelectedShock: (id: string | null) => void;

  // Methodology drawer
  methodologyOpen: boolean;
  toggleMethodology: () => void;

  // Reset filters
  resetFilters: () => void;
}

const DEFAULT_START_DATE = '2022-01-01';
const DEFAULT_END_DATE = '2025-01-01';
const DEFAULT_GEOGRAPHY = 'US';

export const useDashboardStore = create<DashboardState>((set) => ({
  startDate: DEFAULT_START_DATE,
  endDate: DEFAULT_END_DATE,
  setDateRange: (start, end) => set({ startDate: start, endDate: end }),

  geography: DEFAULT_GEOGRAPHY,
  setGeography: (geography) => set({ geography }),

  showShockOverlay: true,
  toggleShockOverlay: () => set((state) => ({ showShockOverlay: !state.showShockOverlay })),

  selectedShockId: null,
  setSelectedShock: (id) => set({ selectedShockId: id }),

  methodologyOpen: false,
  toggleMethodology: () => set((state) => ({ methodologyOpen: !state.methodologyOpen })),

  resetFilters: () =>
    set({
      startDate: DEFAULT_START_DATE,
      endDate: DEFAULT_END_DATE,
      geography: DEFAULT_GEOGRAPHY,
      showShockOverlay: true,
    }),
}));
