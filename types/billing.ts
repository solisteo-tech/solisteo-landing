/**
 * Billing Types and Interfaces
 * Comprehensive type definitions for billing system
 */

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete' | 'unpaid';
export type PlanTier = 'basic' | 'pro' | 'premium' | 'enterprise';
export type PaymentMethod = 'card' | 'bank_transfer' | 'paypal' | 'none';

export interface SubscriptionPlan {
    id: string;
    name: string;
    price_monthly: number;
    price_yearly?: number;
    features: string[];
    max_users?: number;
    max_products?: number;
    is_active: boolean;
}

export interface SellerBilling {
    id: string;
    name: string;
    email: string;
    current_plan: string;
    plan_price: number;
    status: SubscriptionStatus;
    renewal_date: string;
    total_revenue: number;
    last_payment: string;
    payment_method: PaymentMethod;
    stripe_customer_id?: string;
    subscription_id?: string;
}

export interface BillingStats {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    activeSubscriptions: number;
    churnRate: number;
    averageRevenuePerUser: number;
    lifetimeValue: number;
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
        newSubscriptions: number;
        churnedSubscriptions: number;
    }>;
    statusDistribution: Array<{
        status: SubscriptionStatus;
        count: number;
        percentage: number;
    }>;
}

export interface BillingFilters {
    search: string;
    plan: string;
    status: string;
    sortBy: 'name' | 'revenue' | 'renewal_date' | 'plan_price';
    sortOrder: 'asc' | 'desc';
}

export interface InvoiceData {
    id: string;
    seller_id: string;
    seller_name: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    invoice_date: string;
    due_date: string;
    payment_method: PaymentMethod;
}

export interface PaymentHistory {
    id: string;
    amount: number;
    status: 'succeeded' | 'failed' | 'pending';
    payment_date: string;
    payment_method: PaymentMethod;
    invoice_id?: string;
}
