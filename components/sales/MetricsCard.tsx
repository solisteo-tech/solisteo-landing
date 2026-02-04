import React from 'react';
import { cn } from '@/lib/utils';

interface MetricsCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    trend?: number;
    className?: string;
}

/**
 * MetricsCard Component
 * Displays a single metric with title, value, and optional trend indicator
 */
export const MetricsCard = React.memo(({
    title,
    value,
    subtitle,
    trend,
    className
}: MetricsCardProps) => {
    const getTrendColor = () => {
        if (trend === undefined) return 'text-gray-900';
        return trend >= 0 ? 'text-green-600' : 'text-red-600';
    };

    return (
        <div className={cn("bg-white rounded-lg border border-gray-200 p-4", className)}>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-500">{title}</span>
                <span className={cn("text-2xl font-semibold mt-1", getTrendColor())}>
                    {value}
                </span>
                <span className="text-xs text-gray-500 mt-1">{subtitle}</span>
            </div>
        </div>
    );
});

MetricsCard.displayName = 'MetricsCard';
