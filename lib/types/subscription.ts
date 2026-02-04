// Subscription and Usage Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_users: number;
  max_charts: number;
  max_alerts: number;
  max_data_sources: number;
  api_calls_limit?: number;
  has_custom_exports: boolean;
  support_tier: 'basic' | 'priority' | 'premium';
  features: string[];
  stripe_price_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageMetrics {
  seller_id: string;
  seller_name: string;
  plan_name: string;
  charts_created: number;
  charts_limit: number;
  alerts_configured: number;
  alerts_limit: number;
  data_sources_connected: number;
  data_sources_limit: number;
  api_calls_made: number;
  api_calls_limit: number;
  data_processed_mb: number;
  data_processed_limit_mb: number;
  last_sync_timestamp: string;
  plan_usage_percentage: number;
}

export interface SellerUsage {
  current_plan: SubscriptionPlan;
  usage: UsageMetrics;
  can_upgrade: boolean;
  upgrade_options: SubscriptionPlan[];
}

export interface AdminUsageStats {
  total_sellers: number;
  total_charts_created: number;
  total_api_calls: number;
  total_data_processed_mb: number;
  total_alerts_configured: number;
  plan_distribution: {
    plan_name: string;
    seller_count: number;
    percentage: number;
  }[];
  top_active_sellers: {
    seller_id: string;
    seller_name: string;
    charts_created: number;
    api_calls: number;
    last_activity: string;
  }[];
  usage_trends: {
    date: string;
    charts_created: number;
    api_calls: number;
    data_processed_mb: number;
  }[];
}

// Billing Types
export interface BillingStats {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  activeSubscriptions: number;
  churnRate: number;
  planDistribution: Array<{
    plan: string;
    count: number;
    revenue: number;
    percentage: number;
  }>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    subscriptions: number;
  }>;
}

export interface SellerBilling {
  id: string;
  name: string;
  email: string;
  current_plan: string;
  plan_price: number;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  renewal_date: string;
  total_revenue: number;
  last_payment: string;
  payment_method: string;
}

export interface CheckoutSessionRequest {
  plan_id: string;
  success_url: string;
  cancel_url: string;
}

export interface CheckoutSessionResponse {
  checkout_url: string;
  session_id: string;
}

export interface PlanAccess {
  canCreateChart: boolean;
  canCreateAlert: boolean;
  canAddDataSource: boolean;
  canExportData: boolean;
  remainingCharts: number;
  remainingAlerts: number;
  remainingDataSources: number;
  planName: string;
  planFeatures: string[];
  supportTier: string;
  usagePercentage: number;
  isAtLimit: (feature: 'charts' | 'alerts' | 'data_sources') => boolean;
}
