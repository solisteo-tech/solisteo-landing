/**
 * Alert utility functions
 * Helper functions for alert UI logic
 */

import { AlertSeverity } from '@/types/alerts';
import { XCircle, AlertTriangle, Bell } from 'lucide-react';

export function getAlertIcon(severity: AlertSeverity) {
    switch (severity) {
        case 'critical':
        case 'high':
            return XCircle;
        case 'medium':
            return AlertTriangle;
        default:
            return Bell;
    }
}

export function getAlertIconColor(severity: AlertSeverity): string {
    switch (severity) {
        case 'critical':
        case 'high':
            return 'text-red-500';
        case 'medium':
            return 'text-yellow-500';
        default:
            return 'text-blue-500';
    }
}

export function getAlertBadgeVariant(severity: AlertSeverity): 'destructive' | 'secondary' | 'default' {
    switch (severity) {
        case 'critical':
        case 'high':
            return 'destructive';
        case 'medium':
            return 'secondary';
        default:
            return 'default';
    }
}

export function getAlertBorderColor(severity: AlertSeverity): string {
    switch (severity) {
        case 'critical':
            return 'border-l-red-600 bg-red-50 dark:bg-red-950/10';
        case 'high':
            return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/10';
        case 'medium':
            return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/10';
        default:
            return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/10';
    }
}

export function getStatusBadgeVariant(isResolved: boolean): 'default' | 'destructive' {
    return isResolved ? 'default' : 'destructive';
}

export function formatAlertDate(dateString: string): string {
    try {
        return new Date(dateString).toLocaleString();
    } catch {
        return 'Invalid date';
    }
}
