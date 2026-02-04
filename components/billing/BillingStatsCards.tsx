/**
 * Billing Stats Cards Component
 * Displays KPI metrics for billing overview
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { BillingStats } from '@/types/billing';
import { formatCurrency } from '@/lib/billing-utils';

interface BillingStatsCardsProps {
    stats: BillingStats | null;
}

export function BillingStatsCards({ stats }: BillingStatsCardsProps) {
    if (!stats) return null;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue || 0)}</div>
                    <p className="text-xs text-muted-foreground">All time earnings</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">MRR</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRecurringRevenue || 0)}</div>
                    <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeSubscriptions || 0}</div>
                    <p className="text-xs text-muted-foreground">Paying customers</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(stats.churnRate || 0).toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Monthly churn rate</p>
                </CardContent>
            </Card>
        </div>
    );
}
