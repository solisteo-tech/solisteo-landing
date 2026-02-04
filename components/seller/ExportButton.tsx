"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

interface ExportButtonProps {
  filters: any;
}

export default function ExportButton({ filters }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  const onExport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/v1/seller/sales/insights', {
        params: {
          sku: filters.sku || undefined,
          selected_region: filters.selected_region || undefined,
          selected_state: filters.selected_state || undefined,
          selected_pincode: filters.selected_pincode || undefined,
          date_from: filters.date_from || undefined,
          date_to: filters.date_to || undefined,
          top_n: filters.top_n || undefined,
          min_gmv: filters.min_gmv || undefined,
        },
      });
      const summary = res.data?.summary || {};
      const insights = res.data?.insights || [];

      const rows: string[] = [];
      rows.push('Section,Key,Value');
      Object.entries(summary).forEach(([k, v]) => {
        rows.push(`summary,${escapeCsv(k)},${escapeCsv(typeof v === 'object' ? JSON.stringify(v) : String(v))}`);
      });
      insights.forEach((line: string) => {
        rows.push(`insight,,${escapeCsv(line)}`);
      });

      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sales_insights.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export CSV', e);
    } finally {
      setLoading(false);
    }
  };

  const escapeCsv = (s: any) => {
    const str = String(s ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  return (
    <Button onClick={onExport} disabled={loading} variant="outline" aria-label="Export insights CSV">
      {loading ? 'Exporting…' : 'Export CSV'}
    </Button>
  );
}
