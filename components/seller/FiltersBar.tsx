"use client";

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, Download, RotateCcw } from 'lucide-react';
import api from '@/lib/api';

export interface FiltersBarProps {
  value: {
    sku?: string | null;
    date_from?: string | null;
    date_to?: string | null;
    top_n?: number;
    min_gmv?: number | null;
    selected_region?: string | null;
    selected_state?: string | null;
    selected_pincode?: string | null;
  };
  onChange: (val: any) => void;
  onReset?: () => void;
  onExport?: () => void;
}

// Region to states mapping
const REGION_STATES: Record<string, string[]> = {
  North: ['Delhi', 'Punjab', 'Haryana', 'Uttar Pradesh'],
  South: ['Karnataka', 'Tamil Nadu', 'Telangana', 'Kerala'],
  East: ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand'],
  West: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa'],
};

const DATE_PRESETS = [
  { label: 'Today', value: 'today' },
  { label: 'Last day', value: 'last_day' },
  { label: 'Last 3 days', value: 'last_3' },
  { label: 'Last 7 days', value: 'last_7' },
  { label: 'Last 30 days', value: 'last_30' },
  { label: 'Custom date', value: 'custom' },
];

const NET_GROSS_OPTIONS = [
  'All',
  'Net',
  'Gross',
];

export default function FiltersBar({ value, onChange, onReset }: FiltersBarProps) {
  const [datePreset, setDatePreset] = useState<string>('last_7');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Update available states when region changes
  useEffect(() => {
    if (value.selected_region) {
      setAvailableStates(REGION_STATES[value.selected_region] || []);
    } else {
      setAvailableStates([]);
    }
  }, [value.selected_region]);

  // Handle date preset selection
  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset);
    
    if (preset === 'custom') {
      setShowCustomDate(true);
      return;
    }
    
    setShowCustomDate(false);
    const today = new Date();
    let fromDate: Date;
    
    switch (preset) {
      case 'today':
        fromDate = new Date(today);
        break;
      case 'last_day':
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 1);
        break;
      case 'last_3':
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 2);
        break;
      case 'last_7':
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 6);
        break;
      case 'last_30':
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 29);
        break;
      default:
        fromDate = new Date(today);
        fromDate.setDate(today.getDate() - 6);
    }
    
    onChange({
      ...value,
      date_from: fromDate.toISOString().split('T')[0],
      date_to: today.toISOString().split('T')[0],
    });
  };

  // Handle region change
  const handleRegionChange = (region: string) => {
    const newRegion = region === '__ALL__' ? null : region;
    onChange({
      ...value,
      selected_region: newRegion,
      selected_state: null, // Reset state when region changes
    });
  };

  // Handle state change
  const handleStateChange = (state: string) => {
    const newState = state === '__ALL__' ? null : state;
    onChange({
      ...value,
      selected_state: newState,
    });
  };

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await api.get('/api/v1/seller/sales/insights', {
        params: {
          sku: value.sku || undefined,
          selected_region: value.selected_region || undefined,
          selected_state: value.selected_state || undefined,
          selected_pincode: value.selected_pincode || undefined,
          date_from: value.date_from || undefined,
          date_to: value.date_to || undefined,
          top_n: value.top_n || undefined,
          min_gmv: value.min_gmv || undefined,
        },
      });
      
      const summary = res.data?.summary || {};
      const insights = res.data?.insights || [];

      const rows: string[] = [];
      rows.push('Section,Key,Value');
      Object.entries(summary).forEach(([k, v]) => {
        rows.push(`summary,${escapeCsv(k)},${escapeCsv(typeof v === 'object' ? JSON.stringify(v) : String(v))}`);
      });
      insights.forEach((line: any) => {
        const text = typeof line === 'string' ? line : line.text || String(line);
        rows.push(`insight,,${escapeCsv(text)}`);
      });

      const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-insights-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export CSV', e);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const escapeCsv = (s: any) => {
    const str = String(s ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  };

  // Handle reset
  const handleReset = () => {
    setDatePreset('last_7');
    setShowCustomDate(false);
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className="flex flex-wrap gap-3 items-end bg-white/50 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-sm">
      {/* Date Dropdown */}
      <div className="min-w-[160px]">
        <label className="text-xs font-medium text-gray-700 mb-1 block">Date</label>
        <Select value={datePreset} onValueChange={handleDatePresetChange}>
          <SelectTrigger className="h-10 bg-white">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATE_PRESETS.map((preset) => (
              <SelectItem key={preset.value} value={preset.value}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Custom Date Inputs (shown when Custom is selected) */}
      {showCustomDate && (
        <>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">From</label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 h-10 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={value.date_from ?? ''}
              onChange={(e) => onChange({ ...value, date_from: e.target.value || null })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">To</label>
            <input
              type="date"
              className="border border-gray-300 rounded-md px-3 py-2 h-10 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={value.date_to ?? ''}
              onChange={(e) => onChange({ ...value, date_to: e.target.value || null })}
            />
          </div>
        </>
      )}

      {/* Region Dropdown */}
      <div className="min-w-[140px]">
        <label className="text-xs font-medium text-gray-700 mb-1 block">Region</label>
        <Select 
          value={value.selected_region ?? '__ALL__'} 
          onValueChange={handleRegionChange}
        >
          <SelectTrigger className="h-10 bg-white">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">All Regions</SelectItem>
            {Object.keys(REGION_STATES).map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* State Dropdown (enabled only when region is selected) */}
      <div className="min-w-[160px]">
        <label className="text-xs font-medium text-gray-700 mb-1 block">State</label>
        <Select 
          value={value.selected_state ?? '__ALL__'} 
          onValueChange={handleStateChange}
          disabled={!value.selected_region}
        >
          <SelectTrigger className="h-10 bg-white" disabled={!value.selected_region}>
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__ALL__">All States</SelectItem>
            {availableStates.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Net/Gross Dropdown */}
      <div className="min-w-[140px]">
        <label className="text-xs font-medium text-gray-700 mb-1 block">Net/Gross</label>
        <Select defaultValue="All">
          <SelectTrigger className="h-10 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {NET_GROSS_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 ml-auto">
        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={isExporting}
          className="h-10 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="h-10 bg-white hover:bg-gray-50"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
