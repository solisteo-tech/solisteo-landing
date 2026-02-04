export interface SellerUsageData {
    seller_id: string;
    company_name: string;
    email: string;
    current_plan: string;
    plan_status: string;
    charts_created: number;
    alerts_configured: number;
    data_sources_connected: number;
    api_calls_made: number;
    max_charts: number;
    max_alerts: number;
    max_data_sources: number;
    api_calls_limit: number;
}

export interface UsageStats {
    total_sellers: number;
    active_sellers: number;
    total_charts: number;
    total_alerts: number;
    total_data_sources: number;
    total_api_calls: number;
}
