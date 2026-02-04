/**
 * Listing Health Types
 * Shared TypeScript interfaces for listing health monitoring
 */

export interface DeliveryTimes {
    north: number | { days: number; pincode: string };
    south: number | { days: number; pincode: string };
    east: number | { days: number; pincode: string };
    west: number | { days: number; pincode: string };
}

export interface BuyBoxStatus {
    is_owner: boolean;
    winner_name: string;
    price_difference: number;
    winner_deal?: string | null;
    my_deal?: string | null;
}

export interface HealthData {
    id: string;
    asin: string;
    msku: string;
    title: string;
    health_status: 'live' | 'non_live' | 'checking';
    health_reason: string | null;
    last_scan_time: string | null;
    delivery_times: DeliveryTimes | null;
    buy_box: BuyBoxStatus;
    current_price: number | null;
    last_updated: string | null;
    is_paused?: boolean;
}

export interface HealthDataResponse {
    data: HealthData[];
    total: number;
    skip: number;
    limit: number;
}

export type HealthStatusFilter = 'all' | 'live' | 'non_live' | 'checking';
export type BuyBoxFilter = 'all' | 'winning' | 'losing';
export type MonitoringStatusFilter = 'all' | 'active' | 'paused';
export type DateRangeFilter = 'all' | 'today' | 'week' | 'month';
