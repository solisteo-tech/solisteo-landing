"use client";

import SparklineChart from './SparklineChart';

interface DetailRowSparklineProps {
  data?: number[]; // simple numeric series
  color?: string;
}

export default function DetailRowSparkline({ data = [], color = '#2563EB' }: DetailRowSparklineProps) {
  // Convert simple array into chart-friendly format for SparklineChart
  const chartData = (data.length ? data : [2, 3, 2, 4, 3, 5, 4]).map((v, i) => ({ 
    day: `D${i + 1}`, 
    value: v * 1000 // Scale up for realistic GMV values
  }));
  
  return (
    <div className="w-24 h-10 min-w-0">
      <SparklineChart data={chartData} color={color} height={40} showTooltip={true} animate={false} />
    </div>
  );
}
