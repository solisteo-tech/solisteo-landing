/**
 * Custom hook for managing billing data
 * Handles data fetching, error states, and billing operations
 */

import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { billingAPI, adminAPI } from '@/lib/api';
import { BillingStats, SellerBilling, SubscriptionPlan } from '@/types/billing';

interface UseBillingReturn {
    stats: BillingStats | null;
    sellers: SellerBilling[];
    plans: SubscriptionPlan[];
    isLoading: boolean;
    error: string | null;
    fetchBillingData: () => Promise<void>;
    updateSellerPlan: (sellerId: string, planId: string) => Promise<void>;
}

export function useBilling(): UseBillingReturn {
    const [stats, setStats] = useState<BillingStats | null>(null);
    const [sellers, setSellers] = useState<SellerBilling[]>([]);
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchBillingData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const [sellersResponse, statsResponse, plansResponse] = await Promise.all([
                billingAPI.getSellersBilling(),
                billingAPI.getBillingStats(),
                adminAPI.getPlans(),
            ]);

            setSellers(sellersResponse.data);
            setStats(statsResponse.data);
            setPlans(plansResponse.data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load billing data';
            setError(errorMessage);

            if (process.env.NODE_ENV === 'production') {
                // Log to error tracking service
                console.error('Billing fetch error:', err);
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

    const updateSellerPlan = useCallback(async (sellerId: string, planId: string) => {
        try {
            await billingAPI.updateSellerPlan(sellerId, planId);

            toast({
                title: "Success",
                description: "Plan updated successfully",
            });

            // Refresh data
            await fetchBillingData();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update plan';

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });

            throw err; // Re-throw so caller can handle
        }
    }, [fetchBillingData, toast]);

    useEffect(() => {
        fetchBillingData();
    }, [fetchBillingData]);

    return {
        stats,
        sellers,
        plans,
        isLoading,
        error,
        fetchBillingData,
        updateSellerPlan,
    };
}
