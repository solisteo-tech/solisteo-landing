
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';

interface UsageCardProps {
    title: string;
    current: number;
    limit: number;
    icon: React.ReactNode;
    color: string;
    description?: string;
    className?: string; // For motion wrappers or grid layout
}

export function UsageCard({ title, current, limit, icon, color, description, className }: UsageCardProps) {
    const percentage = limit === -1 ? 0 : Math.min((current / limit) * 100, 100);
    const isUnlimited = limit === -1;
    const isNearLimit = !isUnlimited && percentage > 80;

    return (
        <Card className={`relative transition-all hover:shadow-md ${isNearLimit ? 'border-orange-200 bg-orange-50/50' : ''} ${className || ''}`}>
            {isNearLimit && (
                <div className="absolute -top-2 -right-2">
                    <Badge variant="destructive" className="text-xs shadow-sm">
                        Near Limit
                    </Badge>
                </div>
            )}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {icon}
                    {title}
                </CardTitle>
                <div className="text-right">
                    <div className="text-2xl font-bold">{current.toLocaleString('en-IN')}</div>
                    <div className="text-xs text-muted-foreground">
                        {isUnlimited ? 'Unlimited' : `of ${limit.toLocaleString('en-IN')}`}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {!isUnlimited && (
                    <div className="space-y-2">
                        <Progress
                            value={percentage}
                            className={`h-2 ${color}`}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{percentage.toFixed(1)}% used</span>
                            <span>{(limit - current).toLocaleString('en-IN')} remaining</span>
                        </div>
                    </div>
                )}
                {isUnlimited && (
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <Zap className="h-4 w-4 fill-green-600" />
                        Unlimited usage
                    </div>
                )}
                {description && (
                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}
