import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Building, CreditCard, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SystemStats } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/billing-utils';
import { cn } from '@/lib/utils';

interface KPIStatsGridProps {
    stats: SystemStats | null;
}

export function KPIStatsGrid({ stats }: KPIStatsGridProps) {
    if (!stats) return null;

    const metrics = [
        {
            title: 'Total Revenue',
            value: formatCurrency(stats.revenue_metrics?.total_revenue || 0),
            icon: DollarSign,
            color: 'text-green-600',
            change: stats.revenue_metrics?.revenue_growth,
            trend: stats.revenue_metrics?.revenue_growth && stats.revenue_metrics.revenue_growth >= 0 ? 'up' : 'down',
            label: stats.revenue_metrics?.revenue_growth != null ? 'from last month' : 'annual estimate'
        },
        {
            title: 'MRR',
            value: formatCurrency(stats.revenue_metrics?.mrr || 0),
            icon: TrendingUp,
            color: 'text-blue-600',
            change: stats.revenue_metrics?.mrr_growth,
            trend: stats.revenue_metrics?.mrr_growth && stats.revenue_metrics.mrr_growth >= 0 ? 'up' : 'down',
            label: stats.revenue_metrics?.mrr_growth != null ? 'monthly growth' : 'current MRR'
        },
        {
            title: 'Total Companies',
            value: stats.total_sellers,
            icon: Building,
            color: 'text-purple-600',
            change: null,
            trend: 'up',
            label: 'total registered'
        },
        {
            title: 'Active Plans',
            value: stats.active_sellers,
            icon: CreditCard,
            color: 'text-orange-600',
            change: null,
            trend: 'up',
            label: 'active subscriptions'
        },
        {
            title: 'Churn Rate',
            value: stats.revenue_metrics?.churn_rate != null ? `${stats.revenue_metrics.churn_rate}%` : 'N/A',
            icon: TrendingDown,
            color: 'text-red-600',
            change: null,
            trend: 'down',
            label: stats.revenue_metrics?.churn_rate != null ? 'this month' : 'requires historical data'
        },
        {
            title: 'ARPU',
            value: formatCurrency(stats.revenue_metrics?.arpu || 0),
            icon: Users,
            color: 'text-cyan-600',
            change: null,
            trend: 'up',
            label: 'per active user'
        },
        {
            title: 'Active Alerts',
            value: stats.active_alerts,
            icon: AlertTriangle,
            color: 'text-yellow-600',
            subValue: `${stats.total_alerts} total events`,
            label: ''
        },
        {
            title: 'System Uptime',
            value: `${stats.system_health?.uptime || 99.9}%`,
            icon: CheckCircle2,
            color: 'text-green-600',
            label: 'Last 30 days'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <metric.icon className={cn("h-4 w-4", metric.color)} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>

                        {metric.subValue ? (
                            <p className="text-xs text-muted-foreground mt-1">{metric.subValue}</p>
                        ) : metric.label && (
                            <div className="flex items-center text-xs text-muted-foreground mt-1">
                                {metric.change !== undefined && (
                                    metric.trend === 'up' ?
                                        <TrendingUp className={cn("h-3 w-3 mr-1", metric.title === 'Churn Rate' ? 'text-red-600' : 'text-green-600')} /> :
                                        <TrendingDown className={cn("h-3 w-3 mr-1", metric.title === 'Churn Rate' ? 'text-green-600' : 'text-red-600')} />
                                )}

                                {metric.change !== undefined && (
                                    <span className={cn(
                                        "font-medium",
                                        (metric.trend === 'up' && metric.title !== 'Churn Rate') || (metric.trend === 'down' && metric.title === 'Churn Rate') ? 'text-green-600' : 'text-red-600'
                                    )}>
                                        {metric.change > 0 ? '+' : ''}{metric.change}%
                                    </span>
                                )}

                                <span className="ml-1">{metric.label}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
