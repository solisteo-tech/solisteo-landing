"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface SparklineData {
  day: string;
  value: number;
}

interface SparklineChartProps {
  data?: SparklineData[];
  color?: string;
  height?: number;
  showTooltip?: boolean;
  animate?: boolean;
}

export default function SparklineChart({
  data = [],
  color = '#8884d8',
  height = 40,
  showTooltip = true,
  animate = true,
}: SparklineChartProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Generate mock 7-day trend if no data provided
  const chartData = data.length > 0 ? data : Array.from({ length: 7 }, (_, i) => ({
    day: `D${i + 1}`,
    value: Math.random() * 1000 + 500,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const prevValue = chartData[Math.max(0, payload[0].payload.index - 1)]?.value || value;
      const change = ((value - prevValue) / prevValue) * 100;

      return (
        <div className="bg-popover border border-border rounded-md px-2 py-1 text-xs shadow-lg">
          <p className="font-semibold">₹{value.toFixed(0)}</p>
          {change !== 0 && (
            <p className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
              {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Add index to data for tooltip calculations
  const dataWithIndex = chartData.map((d, i) => ({ ...d, index: i }));

  return (
    <motion.div
      className="w-full min-w-0"
      style={{ height, minHeight: 40 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={animate ? { opacity: 0 } : undefined}
      animate={animate ? { opacity: 1 } : undefined}
      transition={{ duration: 0.3 }}
    >
      <ResponsiveContainer width="100%" height={height} minWidth={0} minHeight={0}>
        <LineChart data={dataWithIndex}>
          {showTooltip && <Tooltip content={<CustomTooltip />} cursor={false} />}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={isHovered ? 2 : 1.5}
            dot={false}
            animationDuration={animate ? 800 : 0}
            animationEasing="ease-in-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
