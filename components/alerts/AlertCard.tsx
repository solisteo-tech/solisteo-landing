/**
 * Alert Card Component
 * Individual alert display with actions
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertData } from '@/types/alerts';
import {
    getAlertIcon,
    getAlertIconColor,
    getAlertBadgeVariant,
    getAlertBorderColor,
    formatAlertDate
} from '@/lib/alert-utils';
import { cn } from '@/lib/utils';

interface AlertCardProps {
    alert: AlertData;
    onAcknowledge: (id: number) => void;
    onResolve: (id: number) => void;
}

export function AlertCard({ alert, onAcknowledge, onResolve }: AlertCardProps) {
    const Icon = getAlertIcon(alert.severity);
    const iconColor = getAlertIconColor(alert.severity);
    const borderColor = getAlertBorderColor(alert.severity);

    return (
        <Alert className={cn("border-l-4 transition-all hover:shadow-md", borderColor)}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <Icon className={cn("h-5 w-5 mt-0.5", iconColor)} aria-hidden="true" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold">{alert.title}</h3>
                            <Badge variant={getAlertBadgeVariant(alert.severity)}>
                                {alert.severity}
                            </Badge>
                            {!alert.is_acknowledged && (
                                <Badge variant="outline" className="text-orange-600 border-orange-600">
                                    Unacknowledged
                                </Badge>
                            )}
                        </div>
                        <AlertDescription className="mb-2">{alert.message}</AlertDescription>
                        <div className="text-sm text-muted-foreground">
                            Company: {alert.company_id} • {formatAlertDate(alert.created_at)}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    {!alert.is_acknowledged && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAcknowledge(alert.id)}
                            aria-label={`Acknowledge alert: ${alert.title}`}
                        >
                            Acknowledge
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onResolve(alert.id)}
                        aria-label={`Resolve alert: ${alert.title}`}
                    >
                        Resolve
                    </Button>
                </div>
            </div>
        </Alert>
    );
}
