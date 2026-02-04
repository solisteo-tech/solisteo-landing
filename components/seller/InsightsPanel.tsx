"use client";

import { useMemo } from 'react';
import { useSalesInsights } from '@/hooks/useSalesData';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export interface Filters {
  sku?: string | null;
  selected_region?: string | null;
  selected_state?: string | null;
  selected_pincode?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  top_n?: number | null;
  min_gmv?: number | null;
}

interface InsightsPanelProps {
  filters: Filters;
}

export default function InsightsPanel({ filters }: InsightsPanelProps) {
  // Use React Query hook for data fetching
  const { data, isLoading: loading, error } = useSalesInsights(filters);
  const summary = data?.summary ?? null;

  const kpis = useMemo(() => {
    if (!summary) return [];
    const baseKpis = [
      { key: 'total_gmv', label: 'Total GMV', value: summary.total_gmv, format: 'currency', tooltip: 'Gross Merchandise Value for selected range' },
      { key: 'total_units', label: 'Units', value: summary.total_units, format: 'number', tooltip: 'Total units sold' },
      { key: 'avg_order_value', label: 'Avg Order Value', value: summary.avg_order_value, format: 'currency', tooltip: 'Average GMV per order (approx)' },
      { key: 'growth_pct', label: 'Growth %', value: summary.growth_pct, format: 'percent', tooltip: 'Growth vs previous period' },
    ];

    // Profitability metrics removed per request

    return baseKpis;
  }, [summary]);

  const formatValue = (metric: { format: string; value: number }) => {
    const { format, value } = metric;
    if (format === 'currency') {
      try {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
      } catch {
        return `₹${Math.round(Number(value) || 0)}`;
      }
    }
    if (format === 'percent') {
      return `${(value || 0).toFixed(1)}%`;
    }
    return new Intl.NumberFormat('en-IN').format(Number(value) || 0);
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-20 mb-4 -mt-2">
        <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-900/60 border border-border rounded-xl px-4 py-3 shadow-sm flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">Sales Overview</h2>
            <p className="text-xs text-muted-foreground">Key performance metrics</p>
          </div>
          {summary && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-medium hidden sm:block">
              Period GMV: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(summary.total_gmv || 0)}
            </motion.div>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-6 gap-4">
        {/* KPI Cards */}
        {loading && !summary ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4"><div className="h-16 w-full animate-pulse bg-muted rounded" /></Card>
          ))
        ) : error ? (
          <div className="text-sm text-destructive">{error instanceof Error ? error.message : String(error)}</div>
        ) : (
          kpis.map((k) => {
            const growth = k.key === 'growth_pct' ? k.value : undefined;
            const growthPositive = growth !== undefined ? growth >= 0 : false;
            const isProfit = false;
            return (
              <motion.div
                key={k.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`p-4 h-full cursor-pointer`} aria-label={k.label}>
                  <CardContent className="p-0 flex flex-col gap-1">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      {isProfit && <TrendingUp className="w-3 h-3 text-green-600" />}
                      {k.label}
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${k.key}-${k.value}`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="text-2xl font-bold"
                        data-testid={`kpi-${k.key}`}
                      >
                        {formatValue(k)}
                      </motion.div>
                    </AnimatePresence>
                    {growth !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={growthPositive ? 'text-green-600 text-sm font-medium' : 'text-red-600 text-sm font-medium'}
                      >
                        {growthPositive ? '▲' : '▼'} {Math.abs(growth).toFixed(1)}%
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
