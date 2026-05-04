import { create } from "zustand";

type UiState = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  dashboardSidebarOpen: boolean;
  setDashboardSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  dashboardSidebarOpen: true,
  setDashboardSidebarOpen: (open) => set({ dashboardSidebarOpen: open }),
}));
