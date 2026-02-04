import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
    lastUpdated: Date;
    timeRange: string;
    setTimeRange: (value: string) => void;
    autoRefresh: boolean;
    setAutoRefresh: (value: boolean) => void;
    onRefresh: () => void;
}

export function DashboardHeader({
    lastUpdated,
    timeRange,
    setTimeRange,
    autoRefresh,
    setAutoRefresh,
    onRefresh
}: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
            </div>

            <div className="flex items-center gap-3 bg-card p-1 rounded-lg border shadow-sm">
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[140px] border-none bg-transparent focus:ring-0">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                </Select>

                <div className="h-4 w-px bg-border mx-1" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={cn(autoRefresh && "text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50")}
                    title={autoRefresh ? "Auto-refresh on (30s)" : "Auto-refresh off"}
                >
                    <RefreshCw className={cn("h-4 w-4 mr-2", autoRefresh && "animate-spin")} />
                    {autoRefresh ? 'Auto' : 'Manual'}
                </Button>

                <Button variant="ghost" size="sm" onClick={onRefresh}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>

                <Badge variant="outline" className="ml-2 text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 animate-pulse"></div>
                    Online
                </Badge>
            </div>
        </div>
    );
}
