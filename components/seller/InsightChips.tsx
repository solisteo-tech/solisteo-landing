"use client";

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Sparkles, MapPin, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface InsightChip {
  id: string;
  text: string;
  type: 'positive' | 'negative' | 'neutral' | 'highlight';
  icon?: 'trend-up' | 'trend-down' | 'sparkles' | 'map' | 'award';
  value?: string;
}

interface InsightChipsProps {
  insights: InsightChip[];
  maxVisible?: number;
}

export default function InsightChips({ insights, maxVisible = 5 }: InsightChipsProps) {
  const visibleInsights = insights.slice(0, maxVisible);

  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'trend-up':
        return <TrendingUp className="w-3 h-3" />;
      case 'trend-down':
        return <TrendingDown className="w-3 h-3" />;
      case 'sparkles':
        return <Sparkles className="w-3 h-3" />;
      case 'map':
        return <MapPin className="w-3 h-3" />;
      case 'award':
        return <Award className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getChipStyles = (type: InsightChip['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100';
      case 'negative':
        return 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100';
      case 'highlight':
        return 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100';
      default:
        return 'bg-muted border-border text-foreground hover:bg-accent';
    }
  };

  if (visibleInsights.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground">Key Insights</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleInsights.map((insight, idx) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.2 }}
          >
            <Card
              className={`px-3 py-1.5 border rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors cursor-default ${getChipStyles(
                insight.type
              )}`}
            >
              {getIcon(insight.icon)}
              <span>{insight.text}</span>
              {insight.value && (
                <span className="font-bold ml-0.5">{insight.value}</span>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
