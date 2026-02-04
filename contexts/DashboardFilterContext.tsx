'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface FilterValue {
  field: string;
  value: string | number;
  label?: string;
}

interface DashboardFilterContextType {
  filters: FilterValue[];
  addFilter: (filter: FilterValue) => void;
  removeFilter: (field: string) => void;
  clearAllFilters: () => void;
  hasFilters: boolean;
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

export function DashboardFilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterValue[]>([]);

  const addFilter = useCallback((filter: FilterValue) => {
    setFilters((prev) => {
      // Remove existing filter for this field
      const filtered = prev.filter((f) => f.field !== filter.field);
      // Add new filter
      return [...filtered, filter];
    });
  }, []);

  const removeFilter = useCallback((field: string) => {
    setFilters((prev) => prev.filter((f) => f.field !== field));
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters([]);
  }, []);

  const hasFilters = filters.length > 0;

  return (
    <DashboardFilterContext.Provider
      value={{ filters, addFilter, removeFilter, clearAllFilters, hasFilters }}
    >
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilters() {
  const context = useContext(DashboardFilterContext);
  if (context === undefined) {
    throw new Error('useDashboardFilters must be used within a DashboardFilterProvider');
  }
  return context;
}
