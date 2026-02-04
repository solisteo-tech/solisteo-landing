"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface BarChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface HorizontalBarChartProps {
  data: BarChartData[];
  height?: number;
  maxBars?: number;
  color?: string;
  onBarClick?: (data: BarChartData) => void;
  valueFormatter?: (value: number) => string;
  highlightedIndex?: number;
}

export default function HorizontalBarChart({
  data,
  height = 250,
  maxBars = 5,
  color = '#3b82f6',
  onBarClick,
  highlightedIndex,
  valueFormatter,
}: HorizontalBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort and limit data
  const sortedData = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, maxBars);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);
      const formattedValue = valueFormatter
        ? valueFormatter(payload[0].value)
        : `₹${payload[0].value.toLocaleString('en-IN')}`;

      return (
        <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
          <p className="font-semibold text-sm">{payload[0].payload.name}</p>
          <p className="text-xs text-muted-foreground">
            {formattedValue}
          </p>
          <p className="text-xs font-medium text-primary">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      style={{ height, minHeight: 180 }}
      className="w-full min-w-0"
    >
      <ResponsiveContainer width="100%" height={height} minWidth={0} minHeight={0}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
          <Bar
            dataKey="value"
            radius={[0, 4, 4, 0]}
            animationDuration={800}
            animationEasing="ease-out"
            onClick={(data: any) => {
              if (onBarClick && data) onBarClick(data);
            }}
            onMouseEnter={(_, index) => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  highlightedIndex === index
                    ? '#2563eb'
                    : hoveredIndex === index
                      ? '#60a5fa'
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
