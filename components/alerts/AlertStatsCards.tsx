/**
 * Alert Statistics Cards Component
 * Displays KPI cards for alert metrics
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AlertStats } from '@/types/alerts';

interface AlertStatsCardsProps {
    stats: AlertStats;
}

export function AlertStatsCards({ stats }: AlertStatsCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeCount}</div>
                    <p className="text-xs text-muted-foreground">Require attention</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.resolvedCount}</div>
                    <p className="text-xs text-muted-foreground">Fixed issues</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.criticalCount}</div>
                    <p className="text-xs text-muted-foreground">High priority</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.avgResolutionTime}</div>
                    <p className="text-xs text-muted-foreground">
                        {stats.resolvedCount} resolved
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
