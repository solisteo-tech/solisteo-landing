/**
 * Billing utility functions
 * Helper functions for billing UI logic
 */

import { SubscriptionStatus, PaymentMethod } from '@/types/billing';
import { CheckCircle, AlertTriangle, XCircle, Calendar, CreditCard, Building2, Wallet } from 'lucide-react';

export function getStatusBadgeVariant(status: SubscriptionStatus): 'default' | 'destructive' | 'secondary' {
    switch (status) {
        case 'active':
            return 'default';
        case 'past_due':
        case 'unpaid':
            return 'destructive';
        case 'canceled':
        case 'incomplete':
            return 'secondary';
        default:
            return 'default';
    }
}

export function getStatusIcon(status: SubscriptionStatus) {
    switch (status) {
        case 'active':
            return CheckCircle;
        case 'past_due':
        case 'unpaid':
            return AlertTriangle;
        case 'canceled':
            return XCircle;
        case 'trialing':
        case 'incomplete':
            return Calendar;
        default:
            return CheckCircle;
    }
}

export function getStatusColor(status: SubscriptionStatus): string {
    switch (status) {
        case 'active':
            return 'text-green-600';
        case 'past_due':
        case 'unpaid':
            return 'text-red-600';
        case 'canceled':
            return 'text-gray-600';
        case 'trialing':
            return 'text-blue-600';
        default:
            return 'text-gray-600';
    }
}

export function getPaymentMethodIcon(method: PaymentMethod) {
    switch (method) {
        case 'card':
            return CreditCard;
        case 'bank_transfer':
            return Building2;
        case 'paypal':
            return Wallet;
        default:
            return CreditCard;
    }
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(dateString: string): string {
    try {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return 'Invalid date';
    }
}

export function calculateChurnRate(
    activeSubscriptions: number,
    churnedSubscriptions: number
): number {
    if (activeSubscriptions === 0) return 0;
    return (churnedSubscriptions / (activeSubscriptions + churnedSubscriptions)) * 100;
}

export function calculateLTV(
    averageRevenuePerUser: number,
    averageLifetimeMonths: number
): number {
    return averageRevenuePerUser * averageLifetimeMonths;
}

export function getPlanColor(plan: string): string {
    const planLower = plan.toLowerCase();

    if (planLower.includes('enterprise')) return 'text-purple-600';
    if (planLower.includes('premium')) return 'text-yellow-600';
    if (planLower.includes('pro')) return 'text-blue-600';
    return 'text-gray-600';
}

export function getPlanBadgeVariant(plan: string): 'default' | 'secondary' | 'outline' {
    const planLower = plan.toLowerCase();

    if (planLower.includes('enterprise') || planLower.includes('premium')) return 'default';
    if (planLower.includes('pro')) return 'secondary';
    return 'outline';
}
