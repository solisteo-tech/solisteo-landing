/**
 * Custom hook for managing alerts
 * Handles data fetching, error states, and alert actions
 */

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { adminAPI } from '@/lib/api';
import { AlertData } from '@/types/alerts';

interface UseAlertsReturn {
    alerts: AlertData[];
    isLoading: boolean;
    error: string | null;
    fetchAlerts: () => Promise<void>;
    acknowledgeAlert: (id: number) => Promise<void>;
    resolveAlert: (id: number) => Promise<void>;
}

export function useAlerts(): UseAlertsReturn {
    const [alerts, setAlerts] = useState<AlertData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchAlerts = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await adminAPI.getAlerts();
            setAlerts(response.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load alerts';
            setError(errorMessage);

            // Log to error tracking service in production
            if (process.env.NODE_ENV === 'production') {
                console.error('Alert fetch error:', err);
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    const acknowledgeAlert = useCallback(async (id: number) => {
        try {
            await adminAPI.acknowledgeAlert(id);
            toast({
                title: "Success",
                description: "Alert acknowledged",
            });
            await fetchAlerts();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to acknowledge alert';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }, [fetchAlerts, toast]);

    const resolveAlert = useCallback(async (id: number) => {
        try {
            await adminAPI.resolveAlert(id);
            toast({
                title: "Success",
                description: "Alert resolved successfully",
            });
            await fetchAlerts();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to resolve alert';
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }, [fetchAlerts, toast]);

    // Auto-refresh with visibility check
    useEffect(() => {
        fetchAlerts();

        const interval = setInterval(() => {
            if (!document.hidden) {
                fetchAlerts();
            }
        }, 60000); // 60 seconds

        return () => clearInterval(interval);
    }, [fetchAlerts]);

    return {
        alerts,
        isLoading,
        error,
        fetchAlerts,
        acknowledgeAlert,
        resolveAlert,
    };
}
