import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SystemStats } from '@/hooks/useDashboard';
import { formatCurrency } from '@/lib/billing-utils';

interface RevenueChartsProps {
    stats: SystemStats | null;
}

export function RevenueCharts({ stats }: RevenueChartsProps) {
    if (!stats?.revenue_metrics?.revenue_data || stats.revenue_metrics.revenue_data.length === 0) {
        return (
            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle>Revenue & MRR</CardTitle>
                    <CardDescription>Monthly revenue and recurring revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <p className="text-sm">No historical revenue data available yet</p>
                            <p className="text-xs mt-2">Data will appear as your business grows</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Revenue & MRR</CardTitle>
                <CardDescription>Monthly revenue and recurring revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <AreaChart data={stats.revenue_metrics.revenue_data}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorMRR" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="month"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `₹${value}`} // Simple formatter for axis, full formatCurrency for tooltip
                            />
                            <Tooltip
                                formatter={(value: any) => formatCurrency(value)}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                name="Total Revenue"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="mrr"
                                name="MRR"
                                stroke="#10b981"
                                fillOpacity={1}
                                fill="url(#colorMRR)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
