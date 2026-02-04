/**
 * Alert statistics calculations
 * Memoized calculations for alert metrics
 */

import { useMemo } from 'react';
import { AlertData, AlertStats } from '@/types/alerts';

export function useAlertStats(alerts: AlertData[]): AlertStats {
    const activeCount = useMemo(
        () => alerts.filter(alert => !alert.is_resolved).length,
        [alerts]
    );

    const resolvedCount = useMemo(
        () => alerts.filter(alert => alert.is_resolved).length,
        [alerts]
    );

    const criticalCount = useMemo(
        () => alerts.filter(alert => alert.severity === 'critical' && !alert.is_resolved).length,
        [alerts]
    );

    const avgResolutionTime = useMemo(() => {
        const resolved = alerts.filter(a => a.is_resolved && a.resolved_at);
        if (resolved.length === 0) return '0h';

        const totalMinutes = resolved.reduce((sum, alert) => {
            try {
                const created = new Date(alert.created_at).getTime();
                const resolvedTime = new Date(alert.resolved_at!).getTime();

                if (isNaN(created) || isNaN(resolvedTime)) return sum;

                return sum + (resolvedTime - created) / (1000 * 60);
            } catch {
                return sum;
            }
        }, 0);

        const avgHours = (totalMinutes / resolved.length / 60).toFixed(1);
        return `${avgHours}h`;
    }, [alerts]);

    return {
        activeCount,
        resolvedCount,
        criticalCount,
        avgResolutionTime,
    };
}
