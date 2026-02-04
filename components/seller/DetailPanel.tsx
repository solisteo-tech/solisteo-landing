"use client";

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DetailRowSparkline from './DetailRowSparkline';
import DonutSummaryChart from './DonutSummaryChart';
import HorizontalBarChart from './HorizontalBarChart';
import MiniColumnChart from './MiniColumnChart';
import { Eye, MapIcon, Building2, MapPin, TrendingUp, Download } from 'lucide-react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export type Level = 'region' | 'state' | 'pincode';

export interface Filters {
  sku?: string;
  selected_region?: string | null;
  selected_state?: string | null;
  selected_pincode?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  top_n?: number | null;
  min_gmv?: number | null;
}

interface DetailPanelProps {
  level: Level;
  filters: Filters;
  onRowClick?: (level: Level, value: string) => void;
  chartHeight?: number; // height in px for top chart
  tableMaxHeight?: number; // max height in px for table scroll
  stickyHeader?: boolean; // sticky table header
  showTable?: boolean; // whether to show the table
}

export default function DetailPanel({ level, filters, onRowClick, chartHeight = 240, tableMaxHeight = 360, stickyHeader = true, showTable = true }: DetailPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Array<{ label: string; sum_gmv: number }>>([]);
  // const [summary, setSummary] = useState<any | null>(null);
  const [selectedRow, setSelectedRow] = useState<{ label: string; sum_gmv: number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  type DetailRow = { date: string; gmv: number; units: number; aov: number };
  const [detailData, setDetailData] = useState<DetailRow[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>(undefined);
  const itemsPerPage = 10;

  const title = useMemo(() => {
    if (level === 'region') return 'Region';
    if (level === 'state') return 'State';
    return 'Pincode';
  }, [level]);

  const icon = useMemo(() => {
    if (level === 'region') return <MapIcon className="w-5 h-5" />;
    if (level === 'state') return <Building2 className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  }, [level]);



  const formatINR = (value: number) => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value) || 0);
    } catch (e) {
      return `₹${Math.round(Number(value) || 0)}`;
    }
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api.get(`/api/v1/seller/sales/aggregates/${level}`, {
      params: {
        include_summary: true,
        sku: filters.sku || undefined,
        selected_region: filters.selected_region || undefined,
        selected_state: filters.selected_state || undefined,
        selected_pincode: filters.selected_pincode || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        top_n: filters.top_n || undefined,
        min_gmv: filters.min_gmv || undefined,
      },
    })
      .then((res) => {
        if (!active) return;
        const payload = res.data;
        setData(Array.isArray(payload) ? payload : payload.data || []);
        // setSummary(Array.isArray(payload) ? null : payload.summary || null);
      })
      .catch((e) => {
        if (!active) return;
        console.error(`Failed to fetch ${level} aggregates`, e);
        setError('Failed to load');
      })
      .finally(() => active && setLoading(false));

    return () => { active = false; };
  }, [level, JSON.stringify(filters)]);

  const total = useMemo(() => data.reduce((s, r) => s + (r.sum_gmv || 0), 0), [data]);
  // Animated counter for total using springs
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 120, damping: 20 });
  const [displayTotal, setDisplayTotal] = useState(0);
  useEffect(() => {
    const unsub = spring.on('change', (v) => setDisplayTotal(v));
    mv.set(total || 0);
    return () => unsub();
  }, [total]);

  const exportCSV = () => {
    try {
      const rows = [
        ['Label', 'GMV'],
        ...data.map((d) => [d.label, String(d.sum_gmv ?? 0)]),
      ];
      const csv = rows
        .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase()}-details.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('CSV export failed', e);
    }
  };

  const handleViewDetails = async (row: { label: string; sum_gmv: number }) => {
    setSelectedRow(row);
    setIsModalOpen(true);
    setDetailLoading(true);

    try {
      const response = await api.get('/api/v1/seller/sales/details', {
        params: {
          level,
          value: row.label,
          sku: filters.sku || undefined,
          date_from: filters.date_from || undefined,
          date_to: filters.date_to || undefined
        }
      });
      setDetailData(response.data);
    } catch (e) {
      console.error('Failed to fetch detail data', e);
      // Fallback empty if fail
      setDetailData([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const paginatedData = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return detailData.slice(startIdx, startIdx + itemsPerPage);
  }, [detailData, currentPage]);

  const totalPages = Math.ceil(detailData.length / itemsPerPage);

  // Prepare summary chart data
  const regionColorMap: Record<string, string> = useMemo(() => ({
    North: '#3b82f6', // blue
    South: '#10b981', // green
    East: '#f59e0b',  // amber
    West: '#8b5cf6',  // violet
    Central: '#ef4444', // red
  }), []);

  const summaryChartData = useMemo(() => {
    if (level === 'region') {
      return data.map((row) => ({
        name: row.label,
        value: row.sum_gmv,
        fill: regionColorMap[row.label] || '#64748b',
      }));
    }
    if (level === 'state') {
      return data.slice(0, 5).map(row => ({
        name: row.label,
        value: row.sum_gmv,
      }));
    }
    return data.slice(0, 10).map(row => ({
      name: row.label,
      value: row.sum_gmv,
    }));
  }, [data, level, regionColorMap]);


  return (
    <div className="h-full flex flex-col">
      <Card className="border shadow-sm bg-white h-full flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50 text-gray-700 border border-gray-200">
                {icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  {title} Details
                </h3>
                <p className="text-xs text-gray-500">
                  {data.length} {title.toLowerCase()}s
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                key={total}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-right"
              >
                <div className="text-lg font-bold text-gray-900">
                  {formatINR(displayTotal)}
                </div>
                <div className="text-xs text-gray-500">Total GMV</div>
              </motion.div>
              {showTable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportCSV}
                  data-export={level}
                  className="gap-1.5 h-8 px-3 bg-white hover:bg-gray-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              )}
              {!showTable && (
                <button
                  onClick={exportCSV}
                  data-export={level}
                  className="hidden"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        </div>

        <CardContent className="pt-4 flex-1 flex flex-col">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : data.length === 0 ? (
            <div className="text-sm text-muted-foreground">No data for selected filters — try widening date range.</div>
          ) : (
            <>
              {/* Summary Chart */}
              <motion.div className="mb-6" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>
                {level === 'region' && (
                  <DonutSummaryChart
                    data={summaryChartData}
                    height={chartHeight}
                    onSliceClick={(payload: any) => {
                      const clickedRow = summaryChartData.find(d => d.name === payload?.name);
                      if (clickedRow) {
                        const fullRow = data.find((r: any) => r.label === clickedRow.name);
                        if (fullRow && onRowClick) {
                          onRowClick(level, fullRow.label);
                        }
                      }
                    }}
                  />
                )}
                {level === 'state' && (
                  <HorizontalBarChart
                    data={summaryChartData}
                    height={Math.max(160, chartHeight - 40)}
                    maxBars={5}
                    color="#10b981"
                    highlightedIndex={highlightedIndex}
                    onBarClick={(payload: any) => {
                      const clickedRow = summaryChartData.find(d => d.name === payload?.name);
                      if (clickedRow) {
                        const fullRow = data.find((r: any) => r.label === clickedRow.name);
                        if (fullRow && onRowClick) {
                          onRowClick(level, fullRow.label);
                        }
                      }
                    }}
                  />
                )}
                {level === 'pincode' && (
                  <MiniColumnChart
                    data={summaryChartData}
                    height={chartHeight}
                    maxColumns={10}
                    highlightedIndex={highlightedIndex}
                    onColumnClick={(payload: any) => {
                      const clickedRow = summaryChartData.find(d => d.name === payload?.name);
                      if (clickedRow) {
                        const fullRow = data.find((r: any) => r.label === clickedRow.name);
                        if (fullRow && onRowClick) {
                          onRowClick(level, fullRow.label);
                        }
                      }
                    }}
                  />
                )}
              </motion.div>

              {showTable && (
                <>
                  <div className="border-t border-border pt-4 mt-2" />

                  <div className="overflow-auto" style={{ maxHeight: tableMaxHeight }}>
                    <Table>
                      <TableHeader className={stickyHeader ? 'sticky top-0 z-10 bg-white dark:bg-gray-900' : ''}>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>{title}</TableHead>
                          <TableHead className="text-right">GMV</TableHead>
                          <TableHead className="text-right">Share %</TableHead>
                          <TableHead>Trend</TableHead>
                          <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.map((row, idx) => {
                          const share = total > 0 ? (row.sum_gmv / total) * 100 : 0;
                          const isHighlighted = highlightedIndex === idx;
                          return (
                            <motion.tr
                              key={row.label}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`cursor-pointer transition-colors border-b last:border-0 ${isHighlighted
                                ? 'bg-blue-100 dark:bg-blue-900/30 shadow-sm'
                                : 'hover:bg-accent'
                                }`}
                              onClick={() => onRowClick?.(level, row.label)}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              onMouseLeave={() => setHighlightedIndex(undefined)}
                            >
                              <TableCell>{idx + 1}</TableCell>
                              <TableCell className="font-medium">{row.label}</TableCell>
                              <TableCell className="text-right">{formatINR(row.sum_gmv)}</TableCell>
                              <TableCell className="text-right">{share.toFixed(1)}%</TableCell>
                              <TableCell>
                                <DetailRowSparkline />
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(row);
                                  }}
                                  className="h-8 px-2"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </>
          )}
        </CardContent>

        {/* Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Details for {selectedRow?.label}
              </DialogTitle>
              <DialogDescription>
                {level === 'region' && 'Region-level breakdown'}
                {level === 'state' && 'State-level breakdown'}
                {level === 'pincode' && 'Pincode-level breakdown'}
                {' • '}
                {filters.date_from && filters.date_to
                  ? `${filters.date_from} to ${filters.date_to}`
                  : 'All time'}
              </DialogDescription>
            </DialogHeader>

            {detailLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading details...</div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">GMV</TableHead>
                        <TableHead className="text-right">Units</TableHead>
                        <TableHead className="text-right">AOV</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{item.date}</TableCell>
                          <TableCell className="text-right">{formatINR(item.gmv)}</TableCell>
                          <TableCell className="text-right">{item.units}</TableCell>
                          <TableCell className="text-right">{formatINR(item.aov)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, detailData.length)} of {detailData.length} entries
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                          .map((p, idx, arr) => (
                            <div key={p}>
                              {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1">...</span>}
                              <Button
                                variant={currentPage === p ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(p)}
                                className="w-8 h-8 p-0"
                              >
                                {p}
                              </Button>
                            </div>
                          ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}
