import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';

export interface SystemStats {
    total_sellers: number;
    active_sellers: number;
    total_alerts: number;
    active_alerts: number;
    total_audit_logs: number;
    recent_alerts: number;
    user_growth: Array<{ month: string; users: number }>;
    alert_distribution: Array<{ type: string; count: number }>;
    recent_activity: Array<{ hour: string; requests: number }>;
    company_activity: Array<{ company: string; activity: number }>;

    // Enhanced metrics
    revenue_metrics?: {
        total_revenue: number;
        mrr: number;
        revenue_growth: number;
        mrr_growth: number;
        churn_rate: number;
        arpu: number;
        revenue_data: Array<{ month: string; revenue: number; mrr: number }>;
    };
    system_health?: {
        cpu_usage: number;
        memory_usage: number;
        database_load: number;
        api_response_time: number;
        uptime: number;
        error_rate: number;
    };
    recent_activities?: Array<{
        id: string;
        type: string;
        user: string;
        action: string;
        timestamp: string;
    }>;
    plan_distribution?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
}

export function useDashboard() {
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [error, setError] = useState<string | null>(null);

    const fetchSystemStats = async () => {
        try {
            const response = await adminAPI.getSystemStats();
            setStats(response.data);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            console.error('Failed to fetch system stats:', err);
            // Don't overwrite stats with null on error to prevent flashing, just show error
            if (!stats) {
                setError('Failed to load dashboard data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSystemStats();
    }, [timeRange]);

    useEffect(() => {
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchSystemStats();
            }, 30000); // Refresh every 30 seconds

            // Immediate fetch on auto-refresh toggle on
            if (autoRefresh) fetchSystemStats();

            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const refresh = () => fetchSystemStats();

    return {
        stats,
        isLoading,
        error,
        timeRange,
        setTimeRange,
        autoRefresh,
        setAutoRefresh,
        lastUpdated,
        refresh
    };
}
