"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Info, Sparkles, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Insight {
  text: string;
  severity?: 'critical' | 'warning' | 'safe' | 'info';
  details?: {
    type: string;
    recommendation?: string;
    [key: string]: any;
  };
  ai_generated?: boolean;
  type?: string;
  detail?: string;
}

export interface InsightFeedProps {
  insights: (string | Insight)[];
  anomalies?: Array<{ type: string; entity: string; drop_pct?: number; surge_pct?: number; detail: string }>;
  generatedAt?: string;
}

export default function InsightFeed({ insights, anomalies, generatedAt }: InsightFeedProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const ts = useMemo(() => {
    try {
      return generatedAt ? new Date(generatedAt).toLocaleString() : '';
    } catch {
      return generatedAt || '';
    }
  }, [generatedAt]);

  // Normalize insights to object format
  const normalizedInsights = useMemo(() => {
    return insights.map(i =>
      typeof i === 'string'
        ? { text: i, ai_generated: false, type: 'rule', detail: undefined, severity: 'info' as const }
        : i
    );
  }, [insights]);

  const getSeverityStyles = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return {
          border: 'border-l-4 border-l-red-500 border-y border-r border-gray-100',
          icon: <AlertTriangle className="w-4 h-4 mt-1 text-red-600" />,
          badge: 'bg-red-50 text-red-700 border border-red-200'
        };
      case 'warning':
        return {
          border: 'border-l-4 border-l-amber-500 border-y border-r border-gray-100',
          icon: <AlertCircle className="w-4 h-4 mt-1 text-amber-600" />,
          badge: 'bg-amber-50 text-amber-700 border border-amber-200'
        };
      case 'safe':
        return {
          border: 'border-l-4 border-l-green-500 border-y border-r border-gray-100',
          icon: <CheckCircle2 className="w-4 h-4 mt-1 text-green-600" />,
          badge: 'bg-green-50 text-green-700 border border-green-200'
        };
      default:
        return {
          border: 'border-l-4 border-l-blue-500 border-y border-r border-gray-100',
          icon: <Info className="w-4 h-4 mt-1 text-blue-600" />,
          badge: 'bg-blue-50 text-blue-700 border border-blue-200'
        };
    }
  };

  const renderDetailedBreakdown = (details: any) => {
    if (!details) return null;

    return (
      <div className="space-y-3">
        {/* Recommendation */}
        {details.recommendation && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs font-semibold text-blue-900 mb-1">💡 Recommendation</p>
            <p className="text-sm text-blue-800">{details.recommendation}</p>
          </div>
        )}

        {/* Low Stock Products */}
        {details.top_products && details.type === 'low_stock' && (
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Critical Products ({details.total_affected} total)</p>
            <div className="space-y-2">
              {details.top_products.map((product: any, idx: number) => (
                <div key={idx} className="p-2 bg-white border border-gray-200 rounded text-xs">
                  <div className="font-medium text-gray-900 truncate">{product.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-gray-600">
                    <span>ASIN: {product.asin}</span>
                    <span className="text-red-600 font-bold">DOH: {product.doh?.toFixed(1)}</span>
                    <span>Units: {product.units}</span>
                    <span>{product.city}, {product.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overstock Products */}
        {details.top_products && details.type === 'overstock' && (
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Slow-Moving Products ({details.total_affected} total)</p>
            <div className="space-y-2">
              {details.top_products.map((product: any, idx: number) => (
                <div key={idx} className="p-2 bg-white border border-gray-200 rounded text-xs">
                  <div className="font-medium text-gray-900 truncate">{product.title}</div>
                  <div className="flex items-center gap-3 mt-1 text-gray-600">
                    <span>ASIN: {product.asin}</span>
                    <span className="text-amber-600 font-bold">DOH: {product.doh?.toFixed(1)}</span>
                    <span>Units: {product.units}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State Breakdown */}
        {details.state_breakdown && (
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Geographic Distribution</p>
            <div className="grid grid-cols-2 gap-2">
              {details.state_breakdown.map((item: any, idx: number) => (
                <div key={idx} className="p-2 bg-white border border-gray-200 rounded text-xs">
                  <div className="font-medium text-gray-900">{item.state}</div>
                  <div className="text-gray-600">{(item.units ?? 0).toLocaleString()} units ({item.percentage ?? 0}%)</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warehouse Breakdown */}
        {details.warehouse_breakdown && (
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Warehouse Distribution</p>
            <div className="grid grid-cols-2 gap-2">
              {details.warehouse_breakdown.map((item: any, idx: number) => (
                <div key={idx} className="p-2 bg-white border border-gray-200 rounded text-xs">
                  <div className="font-medium text-gray-900">{item.warehouse}</div>
                  <div className="text-gray-600">{(item.units ?? 0).toLocaleString()} units ({item.percentage ?? 0}%)</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disposition Breakdown */}
        {details.disposition_breakdown && (
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Inventory by Disposition</p>
            <div className="space-y-1">
              {details.disposition_breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded text-xs">
                  <span className="font-medium text-gray-900">{item.disposition}</span>
                  <span className="text-gray-600">{(item.units ?? 0).toLocaleString()} units ({item.percentage ?? 0}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Return Rate Details */}
        {(details.type === 'high_returns' || details.type === 'low_returns') && (
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 bg-white border border-gray-200 rounded text-xs text-center">
              <div className="text-gray-600">Return Rate</div>
              <div className="font-bold text-gray-900">{details.return_rate}%</div>
            </div>
            <div className="p-2 bg-white border border-gray-200 rounded text-xs text-center">
              <div className="text-gray-600">Returns</div>
              <div className="font-bold text-gray-900">{details.total_returns?.toLocaleString()}</div>
            </div>
            <div className="p-2 bg-white border border-gray-200 rounded text-xs text-center">
              <div className="text-gray-600">Shipments</div>
              <div className="font-bold text-gray-900">{details.total_shipments?.toLocaleString()}</div>
            </div>
          </div>
        )}

        {/* Stock Velocity Details */}
        {(details.type === 'low_velocity' || details.type === 'high_velocity') && (
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white border border-gray-200 rounded text-xs text-center">
              <div className="text-gray-600">Active Products</div>
              <div className="font-bold text-gray-900">{details.active_products}</div>
            </div>
            <div className="p-2 bg-white border border-gray-200 rounded text-xs text-center">
              <div className="text-gray-600">Total Products</div>
              <div className="font-bold text-gray-900">{details.total_products}</div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Insights</CardTitle>
          {ts && <Badge variant="secondary" aria-label={`Generated at ${ts}`}>Updated {ts}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {normalizedInsights.length === 0 ? (
          <div className="text-sm text-muted-foreground">No insights available for current filters.</div>
        ) : (
          <ul className="space-y-2 max-h-[420px] overflow-auto pr-1">
            {normalizedInsights.map((insight, idx) => {
              const isOpen = expandedIndex === idx;
              const anomalyItems = (anomalies || []).filter(a => insight.text.toLowerCase().includes((a.entity || '').toLowerCase()));
              const isAI = insight.ai_generated;
              const styles = getSeverityStyles(insight.severity);

              return (
                <li key={idx}>
                  <button
                    className={`w-full text-left border rounded-lg p-3 hover:shadow-md transition-all focus:outline-none focus:ring-2 ${styles.border}`}
                    onClick={() => setExpandedIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-2">
                      {styles.icon}
                      <div className="flex-1">
                        <div className="font-medium leading-snug">{insight.text}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-xs text-muted-foreground">Tap for details</div>
                          {insight.severity && (
                            <Badge className={`text-xs ${styles.badge}`}>
                              {insight.severity.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isOpen ? <ChevronDown className="w-4 h-4 mt-1" /> : <ChevronRight className="w-4 h-4 mt-1" />}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-3 pb-3 pt-2"
                      >
                        {/* Show detailed breakdown */}
                        {insight.details && renderDetailedBreakdown(insight.details)}

                        {/* Legacy detail field */}
                        {insight.detail && !insight.details && (
                          <div className="mb-3 p-3 bg-muted/50 rounded-md border border-border">
                            <p className="text-sm text-foreground leading-relaxed">{insight.detail}</p>
                          </div>
                        )}

                        {/* Show related anomalies */}
                        {anomalyItems.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Related Anomalies:</p>
                            <ul className="text-sm list-disc ml-5 space-y-1">
                              {anomalyItems.map((a, i) => (
                                <li key={i} className="text-muted-foreground">
                                  {a.detail}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Show message if no detail */}
                        {!insight.details && !insight.detail && anomalyItems.length === 0 && (
                          <div className="text-xs text-muted-foreground italic">No additional details available.</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
