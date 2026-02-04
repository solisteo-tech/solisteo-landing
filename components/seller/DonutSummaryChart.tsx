"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface DonutChartData {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

interface DonutSummaryChartProps {
  data: DonutChartData[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  onSliceClick?: (payload: any) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function DonutSummaryChart({
  data,
  height = 200,
  innerRadius = 0,
  outerRadius = 80,
  showLegend = true,
  onSliceClick,
}: DonutSummaryChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((payload[0].value / total) * 100).toFixed(1);

      return (
        <div className="bg-popover border border-border rounded-md px-3 py-2 shadow-lg">
          <p className="font-semibold text-sm">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
          <p className="text-xs font-medium text-primary">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ height, minHeight: 160 }}
      className="relative w-full min-w-0"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-br from-blue-100/20 to-purple-100/20 blur-xl" />
      </div>
      <ResponsiveContainer width="100%" height={height} minWidth={0} minHeight={0}>
        <PieChart>
          <defs>
            {data.map((entry, index) => {
              const color = entry.color || COLORS[index % COLORS.length];
              return (
                <filter key={`shadow-${index}`} id={`shadow-${index}`} height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" floodColor={color} />
                </filter>
              );
            })}
          </defs>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
            animationEasing="ease-out"
            paddingAngle={2}
            stroke="#fff"
            strokeWidth={2}
            onClick={onSliceClick}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || COLORS[index % COLORS.length]}
                filter={`url(#shadow-${index})`}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
