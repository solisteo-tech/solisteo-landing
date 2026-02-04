/**
 * Error State Component for Alerts
 * Displays when alert fetching fails
 */

import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface AlertErrorStateProps {
    error: string;
    onRetry: () => void;
}

export function AlertErrorState({ error, onRetry }: AlertErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <XCircle className="h-12 w-12 text-destructive" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Failed to Load Alerts</h2>
            <p className="text-muted-foreground text-center max-w-md">{error}</p>
            <Button onClick={onRetry}>Try Again</Button>
        </div>
    );
}
