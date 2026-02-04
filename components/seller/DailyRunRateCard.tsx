"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';

interface DailyDataPoint {
  date: string;
  units: number;
}

interface DailyRunRateSKU {
  sku: string;
  avg_daily_units: number;
  total_units: number;
  total_days: number;
  trend?: 'up' | 'down' | 'stable';
  daily_data: DailyDataPoint[];
}

interface DailyRunRateData {
  start: string;
  end: string;
  total_days: number;
  top_skus: DailyRunRateSKU[];
}

interface DailyRunRateCardProps {
  filters?: {
    sku?: string | null;
    date_from?: string | null;
    date_to?: string | null;
    top_n?: number | null;
    selected_region?: string | null;
    selected_state?: string | null;
    selected_pincode?: string | null;
  };
  onSKUClick?: (sku: string) => void;
  maxHeight?: number; // max height for scrollable table
  stickyHeader?: boolean;
}

export default function DailyRunRateCard({ filters, onSKUClick, maxHeight = 420, stickyHeader = true }: DailyRunRateCardProps) {
  const [data, setData] = useState<DailyRunRateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSKU, setSelectedSKU] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api
      .get('/api/v1/seller/sales/daily-run-rate', {
        params: {
          date_from: filters?.date_from || undefined,
          date_to: filters?.date_to || undefined,
          top_n: filters?.top_n || 10, // Changed default from 20 to 10
          sku: filters?.sku || undefined,
          selected_region: filters?.selected_region || undefined,
          selected_state: filters?.selected_state || undefined,
          selected_pincode: filters?.selected_pincode || undefined,
        },
      })
      .then((res) => {
        if (!active) return;
        setData(res.data);
      })
      .catch((e) => {
        if (!active) return;
        console.error('Failed to fetch daily run rate', e);
        setError('Failed to load daily run rate');
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [filters?.date_from, filters?.date_to, filters?.top_n, filters?.sku, filters?.selected_region, filters?.selected_state, filters?.selected_pincode]);

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendBadge = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <Badge className="bg-green-100 text-green-800">Growing</Badge>;
      case 'down':
        return <Badge className="bg-red-100 text-red-800">Declining</Badge>;
      default:
        return <Badge variant="outline">Stable</Badge>;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handleSKUClick = (sku: string) => {
    const newSelected = selectedSKU === sku ? null : sku;
    setSelectedSKU(newSelected);
    if (onSKUClick && newSelected) {
      onSKUClick(newSelected);
    } else if (onSKUClick && !newSelected) {
      // Clear filter
      onSKUClick('');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Run Rate (Top 10 SKUs)</CardTitle>
          <CardDescription>Average daily sales velocity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 bg-gradient-to-r from-slate-200 to-slate-100 animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Run Rate (Top 10 SKUs)</CardTitle>
          <CardDescription>Average daily sales velocity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            {error || 'No data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Daily Run Rate (Top 10 SKUs)
            </CardTitle>
            <CardDescription>
              Daily sales units over {data.total_days} days ({data.start} to {data.end})
              {selectedSKU && <span className="ml-2 text-blue-600 font-medium">• Filtered: {selectedSKU}</span>}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-auto" style={{ maxHeight }}>
          <Table>
            <TableHeader className={stickyHeader ? 'sticky top-0 z-10 bg-white' : ''}>
              <TableRow>
                <TableHead className="sticky left-0 bg-background z-10">SKU</TableHead>
                <TableHead className="text-center">Trend</TableHead>
                {/* Generate date columns - sorted ascending */}
                {data.top_skus[0]?.daily_data
                  ?.slice()
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((d, idx) => (
                    <TableHead key={idx} className="text-right min-w-[72px]">
                      <div className="text-xs">
                        <div className="font-semibold">{formatDate(d.date)}</div>
                        <div className="text-muted-foreground font-normal">{getDayName(d.date)}</div>
                      </div>
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.top_skus.map((sku, idx) => {
                // Sort daily_data ascending by date
                const sortedDaily = [...(sku.daily_data || [])].sort((a, b) => 
                  a.date.localeCompare(b.date)
                );
                const isSelected = selectedSKU === sku.sku;
                
                return (
                  <motion.tr
                    key={sku.sku}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    onClick={() => handleSKUClick(sku.sku)}
                    className={`cursor-pointer transition-colors border-b last:border-0 ${
                      isSelected 
                        ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-l-blue-500' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <TableCell className={`font-medium sticky left-0 z-10 ${
                      isSelected ? 'bg-blue-50' : 'bg-background'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">#{idx + 1}</span>
                        <span className={`truncate text-sm ${isSelected ? 'font-bold text-blue-700' : ''}`}>
                          {sku.sku}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(sku.trend)}
                      </div>
                    </TableCell>
                    {/* Display units for each day */}
                    {sortedDaily.map((day, dayIdx) => (
                      <TableCell key={dayIdx} className="text-right font-mono tabular-nums text-sm">
                        {day.units.toLocaleString('en-IN')}
                      </TableCell>
                    ))}
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {data.top_skus.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No SKUs found for the selected period
          </div>
        )}
      </CardContent>
    </Card>
  );
}
