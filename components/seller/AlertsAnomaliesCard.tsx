"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Info, Filter, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Anomaly {
  type: "gmv_drop" | "gmv_surge" | string;
  entity: string;
  drop_pct?: number;
  surge_pct?: number;
  change_pct?: number;
  value_current?: number;
  value_prev?: number;
  severity?: "critical" | "warning" | "info" | string;
  detail?: string;
  suggestion?: string;
}

interface AlertsAnomaliesCardProps {
  anomalies: Anomaly[];
  className?: string;
}

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
};

export default function AlertsAnomaliesCard({ anomalies, className = "" }: AlertsAnomaliesCardProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [severityFilter, setSeverityFilter] = useState<Set<string>>(new Set(["critical", "warning"])); // Hide info by default
  const [searchTerm, setSearchTerm] = useState("");

  const sorted = useMemo(() => {
    const score = (a: Anomaly) => Math.abs(a.change_pct ?? a.drop_pct ?? a.surge_pct ?? 0);
    return [...anomalies]
      .filter((a) => {
        const sev = a.severity ?? (Math.abs(a.change_pct ?? a.drop_pct ?? a.surge_pct ?? 0) >= 40 ? "critical" : Math.abs(a.change_pct ?? a.drop_pct ?? a.surge_pct ?? 0) >= 25 ? "warning" : "info");
        const matchesSev = severityFilter.size === 0 || severityFilter.has(sev);
        const matchesSearch = !searchTerm || (a.entity?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
        return matchesSev && matchesSearch;
      })
      .sort((a, b) => score(b) - score(a));
  }, [anomalies, severityFilter, searchTerm]);

  const toggleSev = (s: string) => {
    setSeverityFilter((prev) => {
      const n = new Set(prev);
      if (n.has(s)) n.delete(s);
      else n.add(s);
      return n;
    });
  };

  if (!anomalies || anomalies.length === 0) return null;

  return (
    <Card className={`p-3 border border-border/60 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-semibold">Alerts & Anomalies</h3>
        </div>
        <Badge variant="secondary" className="text-xs">{anomalies.length} detected</Badge>
      </div>

      {/* Filters and search */}
      <div className="mb-2 flex items-center gap-2">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-muted-foreground" />
          {["critical", "warning", "info"].map((s) => (
            <button
              key={s}
              onClick={() => toggleSev(s)}
              className={`text-xs px-2 py-0.5 rounded border ${severityFilter.has(s) ? severityColors[s] : "border-border text-muted-foreground bg-muted/40"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3 h-3 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by entity..."
            className="text-xs pl-7 pr-2 py-1 h-7"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        <AnimatePresence initial={false}>
          {sorted.map((a, idx) => {
            const isDrop = a.type === "gmv_drop";
            const pct = a.change_pct ?? a.drop_pct ?? a.surge_pct ?? 0;
            const sev = a.severity ?? (Math.abs(pct) >= 40 ? "critical" : Math.abs(pct) >= 25 ? "warning" : "info");
            const PillIcon = isDrop ? ArrowDownRight : ArrowUpRight;
            const pillColor = isDrop
              ? "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20"
              : "bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20";

            return (
              <motion.button
                key={`${a.entity}-${idx}`}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2, delay: idx * 0.04 }}
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                className={`px-3 py-2 rounded-md text-sm whitespace-nowrap flex items-center gap-2 hover:brightness-110 ${pillColor}`}
                aria-expanded={expandedIdx === idx}
              >
                <PillIcon className="w-4 h-4" />
                <span className="font-medium">{a.entity}</span>
                <span className="opacity-80">{isDrop ? "-" : "+"}{Math.abs(pct).toFixed(1)}%</span>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded ${severityColors[sev] || severityColors.info}`}>{sev}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expandedIdx !== null && sorted[expandedIdx] && (
          <motion.div
            key={`detail-${expandedIdx}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 bg-muted/50 rounded-md p-3"
          >
            <div className="text-sm mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Details</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {sorted[expandedIdx].detail || "No additional details provided."}
            </div>
            {sorted[expandedIdx].suggestion && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Suggestion: </span>
                <span>{sorted[expandedIdx].suggestion}</span>
              </div>
            )}
            {(sorted[expandedIdx].value_current !== undefined && sorted[expandedIdx].value_prev !== undefined) && (
              <div className="mt-2 text-xs text-muted-foreground">
                Current: ₹{Number(sorted[expandedIdx].value_current).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                {"  •  "}
                Previous: ₹{Number(sorted[expandedIdx].value_prev).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
            )}
            <div className="mt-2">
              <Link href={`/seller/sales?region=${encodeURIComponent(sorted[expandedIdx].entity)}`}>
                <button className="text-xs text-blue-600 hover:underline">
                  View {sorted[expandedIdx].entity} in Sales →
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
