/**
 * Alert Types and Interfaces
 * Centralized type definitions for the alert system
 */

export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AlertType =
    | 'low_inventory'
    | 'out_of_stock'
    | 'sales_decline'
    | 'stale_data'
    | 'aging_tickets'
    | 'system'
    | 'security';

export interface AlertMetadata {
    sku?: string;
    available_qty?: number;
    reorder_point?: number;
    warehouse?: string;
    decline_pct?: number;
    last_week_sales?: number;
    prev_week_sales?: number;
    hours_since_sync?: number;
    last_sync_at?: string;
    ticket_count?: number;
    [key: string]: any;
}

export interface AlertData {
    id: number;
    company_id: string;
    alert_type: AlertType;
    severity: AlertSeverity;
    title: string;
    message: string;
    is_acknowledged: boolean;
    acknowledged_at: string | null;
    is_resolved: boolean;
    resolved_at: string | null;
    created_at: string;
    metadata?: AlertMetadata;
}

export type FilterType = 'all' | 'active' | 'resolved' | 'critical';

export interface AlertStats {
    activeCount: number;
    resolvedCount: number;
    criticalCount: number;
    avgResolutionTime: string;
}
