import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, UserPlus, AlertCircle, ArrowUpRight, Bell } from 'lucide-react';
import { SystemStats } from '@/hooks/useDashboard';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
    stats: SystemStats | null;
}

export function ActivityFeed({ stats }: ActivityFeedProps) {
    if (!stats?.recent_activities) return null;

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'registration': return <UserPlus className="h-4 w-4 text-green-600" />;
            case 'alert': return <AlertCircle className="h-4 w-4 text-red-600" />;
            case 'login': return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
            case 'support': return <Bell className="h-4 w-4 text-yellow-600" />;
            default: return <Activity className="h-4 w-4 text-slate-600" />;
        }
    };

    const getBgColor = (type: string) => {
        switch (type) {
            case 'registration': return "bg-green-100 dark:bg-green-950/40";
            case 'alert': return "bg-red-100 dark:bg-red-950/40";
            case 'login': return "bg-blue-100 dark:bg-blue-950/40";
            case 'support': return "bg-yellow-100 dark:bg-yellow-950/40";
            default: return "bg-slate-100 dark:bg-slate-800";
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-500" />
                    Recent Activity
                </CardTitle>
                <CardDescription>Latest system events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {stats.recent_activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                            <div className={cn("p-2 rounded-lg shrink-0", getBgColor(activity.type))}>
                                {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium leading-none">{activity.user}</p>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{activity.action}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {activity.timestamp}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
