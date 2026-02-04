import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Server, Cpu, Activity, Database, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { SystemStats } from '@/hooks/useDashboard';
import { cn } from '@/lib/utils';

interface SystemHealthProps {
    stats: SystemStats | null;
}

export function SystemHealth({ stats }: SystemHealthProps) {
    if (!stats?.system_health) return null;

    const health = stats.system_health;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-indigo-500" />
                    System Health
                </CardTitle>
                <CardDescription>Real-time server performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Progress Bars */}
                    <div className="space-y-6">
                        <HealthProgress label="CPU Usage" value={health.cpu_usage} icon={Cpu} color="bg-blue-600" />
                        <HealthProgress label="Memory" value={health.memory_usage} icon={Activity} color="bg-purple-600" />
                        <HealthProgress label="Database" value={health.database_load} icon={Database} color="bg-green-600" />
                    </div>

                    {/* Key Metrics */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <HealthMetric
                            label="API Response"
                            value={`${health.api_response_time}ms`}
                            icon={Clock}
                            variant="blue"
                        />
                        <HealthMetric
                            label="Uptime"
                            value={`${health.uptime}%`}
                            icon={CheckCircle2}
                            variant="green"
                        />
                        <HealthMetric
                            label="Error Rate"
                            value={`${health.error_rate}%`}
                            icon={XCircle}
                            variant={health.error_rate > 1 ? 'red' : 'green'}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function HealthProgress({ label, value, icon: Icon, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                    {label}
                </span>
                <span className="text-sm font-bold">{value}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-500", color)}
                    style={{ width: `${Math.min(value, 100)}%` }}
                ></div>
            </div>
        </div>
    );
}

function HealthMetric({ label, value, icon: Icon, variant }: any) {
    const variants: any = {
        blue: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
        green: "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400",
        red: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
    };

    return (
        <div className={cn("flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-border transition-colors", variants[variant])}>
            <div>
                <p className="text-xs font-medium opacity-80">{label}</p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <Icon className="h-8 w-8 opacity-20" />
        </div>
    );
}
