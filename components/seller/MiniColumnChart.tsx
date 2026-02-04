"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ColumnChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface MiniColumnChartProps {
  data: ColumnChartData[];
  height?: number;
  maxColumns?: number;
  color?: string;
  onColumnClick?: (data: ColumnChartData) => void;
  valueFormatter?: (value: number) => string;
  highlightedIndex?: number;
}

export default function MiniColumnChart({
  data,
  height = 180,
  maxColumns = 10,
  color = '#10b981',
  onColumnClick,
  highlightedIndex,
  valueFormatter,
}: MiniColumnChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort and limit data
  const sortedData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, maxColumns);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const formattedValue = valueFormatter
        ? valueFormatter(payload[0].value)
        : `₹${payload[0].value.toLocaleString('en-IN')}`;

      return (
        <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
          <p className="font-semibold text-sm">PIN: {payload[0].payload.name}</p>
          <p className="text-xs text-muted-foreground">
            {formattedValue}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ height, minHeight: 120 }}
      className="w-full min-w-0"
    >
      <ResponsiveContainer width="100%" height={height} minWidth={0} minHeight={0}>
        <BarChart
          data={sortedData}
          margin={{ top: 5, right: 5, left: 5, bottom: 20 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 } as any}
            angle={-45}
            textAnchor="end"
            height={50}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
            animationEasing="ease-out"
            onClick={(data: any) => {
              if (onColumnClick && data) onColumnClick(data);
            }}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  highlightedIndex === index
                    ? '#059669'
                    : hoveredIndex === index
                      ? '#34d399'
                      : color
                }
                opacity={highlightedIndex !== undefined && highlightedIndex !== index ? 0.5 : 1}
                cursor="pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
