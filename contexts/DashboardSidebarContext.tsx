"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type DashboardSidebarContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
};

const DashboardSidebarContext = createContext<DashboardSidebarContextValue | null>(null);

export function DashboardSidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <DashboardSidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </DashboardSidebarContext.Provider>
  );
}

export function useDashboardSidebar() {
  const ctx = useContext(DashboardSidebarContext);
  return ctx;
}
