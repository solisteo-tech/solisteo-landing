"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Freshness {
  last_snapshot_day?: string | null;
  last_etl_completed_at?: string | null;
  data_sources: Array<{ id?: string; name: string; type: string; is_active: boolean; last_sync_at?: string | null }>;
  status: "fresh" | "stale" | "degraded" | string;
  stale_hours?: number | null;
}

const statusStyles: Record<string, string> = {
  fresh: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  degraded: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  stale: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const dotStyles: Record<string, string> = {
  fresh: "bg-emerald-500",
  degraded: "bg-amber-500",
  stale: "bg-red-500",
};

export default function FreshnessChip() {
  const [data, setData] = useState<Freshness | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get("/api/v1/seller/sales/freshness", { params: { _t: Date.now() } })
      .then((res) => {
        if (!active) return;
        setData(res.data as Freshness);
      })
      .catch((e) => {
        console.error("Failed to fetch freshness", e);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  if (!data && loading) return null;
  if (!data) return null;

  const style = statusStyles[data.status] || statusStyles.stale;
  const dot = dotStyles[data.status] || dotStyles.stale;

  const tooltip = (
    <div className="text-xs space-y-1">
      <div>Last sales day: <span className="font-medium">{data.last_snapshot_day || "n/a"}</span></div>
      <div>Last ETL: <span className="font-medium">{data.last_etl_completed_at ? new Date(data.last_etl_completed_at).toLocaleString() : "n/a"}</span></div>
      {Number.isFinite(data.stale_hours) && (
        <div>Stale: <span className="font-medium">{data.stale_hours}h</span></div>
      )}
      {data.data_sources?.length > 0 && (
        <div className="pt-1">
          <div className="font-medium mb-0.5">Sources</div>
          <ul className="list-disc ml-4">
            {data.data_sources.map((s) => (
              <li key={s.id || s.name} className="opacity-80">{s.name} ({s.type}){s.last_sync_at ? ` · ${new Date(s.last_sync_at).toLocaleString()}` : ""}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Badge variant="secondary" className={`flex items-center gap-2 ${style}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
              <span className="hidden sm:inline">Data {data.status}</span>
              <span className="sm:hidden capitalize">{data.status}</span>
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
