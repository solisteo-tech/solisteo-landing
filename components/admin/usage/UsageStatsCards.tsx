'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart3, Bell, Database } from 'lucide-react';
import { UsageStats } from '@/lib/types/admin-usage';

interface UsageStatsCardsProps {
    stats: UsageStats | null;
}

export function UsageStatsCards({ stats }: UsageStatsCardsProps) {
    if (!stats) return null;

    const cards = [
        {
            label: 'Total Sellers',
            value: stats.total_sellers,
            subtext: `${stats.active_sellers} active`,
            icon: Users,
        },
        {
            label: 'Total Charts',
            value: stats.total_charts,
            subtext: 'Across all sellers',
            icon: BarChart3,
        },
        {
            label: 'Total Alerts',
            value: stats.total_alerts,
            subtext: 'Active configurations',
            icon: Bell,
        },
        {
            label: 'Data Sources',
            value: stats.total_data_sources,
            subtext: 'Connected integrations',
            icon: Database,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, idx) => (
                <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <p className="text-xs text-muted-foreground">{card.subtext}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
