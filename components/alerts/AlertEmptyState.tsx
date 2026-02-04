/**
 * Empty State Component for Alerts
 * Displays when no alerts match the current filter
 */

import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { FilterType } from '@/types/alerts';

interface AlertEmptyStateProps {
    filter: FilterType;
}

export function AlertEmptyState({ filter }: AlertEmptyStateProps) {
    const getMessage = () => {
        switch (filter) {
            case 'active':
                return 'No active alerts at the moment.';
            case 'resolved':
                return 'No resolved alerts yet.';
            case 'critical':
                return 'No critical alerts - great job!';
            default:
                return 'No alerts at the moment.';
        }
    };

    return (
        <Card className="p-12">
            <div className="flex flex-col items-center text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500" aria-hidden="true" />
                <h3 className="text-2xl font-semibold">All Clear!</h3>
                <p className="text-muted-foreground max-w-md">
                    {getMessage()} Your system is running smoothly.
                </p>
            </div>
        </Card>
    );
}
