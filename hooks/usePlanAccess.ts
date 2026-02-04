'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import api, { billingAPI } from '../lib/api';
import { PlanAccess, SellerUsage } from '../lib/types/subscription';

export const usePlanAccess = (): PlanAccess & { refresh: () => Promise<void>; isLoading: boolean } => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [planAccess, setPlanAccess] = useState<PlanAccess>({
    canCreateChart: false,
    canCreateAlert: false,
    canAddDataSource: false,
    canExportData: false,
    remainingCharts: 0,
    remainingAlerts: 0,
    remainingDataSources: 0,
    planName: 'Loading...',
    planFeatures: [],
    supportTier: 'basic',
    usagePercentage: 0,
    isAtLimit: () => false,
  });

  const fetchUsage = useCallback(async () => {
    if (!user) return;

    try {
      const response = await billingAPI.getSellerUsage();
      const usageData: SellerUsage = response.data;

      const { current_plan, usage } = usageData;

      // Handle case where current_plan is null
      if (!current_plan) {
        setPlanAccess({
          canCreateChart: false,
          canCreateAlert: false,
          canAddDataSource: false,
          canExportData: false,
          remainingCharts: 0,
          remainingAlerts: 0,
          remainingDataSources: 0,
          planName: 'No Plan Assigned',
          planFeatures: [],
          supportTier: 'basic',
          usagePercentage: 0,
          isAtLimit: () => false,
        });
        return;
      }

      const access: PlanAccess = {
        canCreateChart: usage.charts_created < current_plan.max_charts || current_plan.max_charts === -1,
        canCreateAlert: usage.alerts_configured < current_plan.max_alerts || current_plan.max_alerts === -1,
        canAddDataSource: usage.data_sources_connected < current_plan.max_data_sources || current_plan.max_data_sources === -1,
        canExportData: current_plan.has_custom_exports,
        remainingCharts: current_plan.max_charts === -1 ? -1 : Math.max(0, current_plan.max_charts - usage.charts_created),
        remainingAlerts: current_plan.max_alerts === -1 ? -1 : Math.max(0, current_plan.max_alerts - usage.alerts_configured),
        remainingDataSources: current_plan.max_data_sources === -1 ? -1 : Math.max(0, current_plan.max_data_sources - usage.data_sources_connected),
        planName: current_plan.name,
        planFeatures: current_plan.features || [],
        supportTier: current_plan.support_tier,
        usagePercentage: usage.plan_usage_percentage || 0,
        isAtLimit: (feature: 'charts' | 'alerts' | 'data_sources') => {
          switch (feature) {
            case 'charts':
              return current_plan.max_charts !== -1 && usage.charts_created >= current_plan.max_charts;
            case 'alerts':
              return current_plan.max_alerts !== -1 && usage.alerts_configured >= current_plan.max_alerts;
            case 'data_sources':
              return current_plan.max_data_sources !== -1 && usage.data_sources_connected >= current_plan.max_data_sources;
            default:
              return false;
          }
        },
      };

      setPlanAccess(access);
    } catch (error: any) {
      // Silently handle rate limiting errors (429)
      if (error?.response?.status === 429) {
        console.warn('Rate limit hit for billing/usage - will retry on next interval');
        return; // Keep current state, don't update
      }

      console.error('Failed to fetch plan access:', error);
      // Set basic access for error cases
      setPlanAccess((prev: PlanAccess) => ({
        ...prev,
        canCreateChart: true, // Allow basic functionality even if API fails
        canCreateAlert: true,
        canAddDataSource: true,
        planName: 'Unknown Plan',
        planFeatures: ['sales', 'inventory'], // Allow all features on error
      }));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsage();

    // Set up polling for real-time updates (every 60 seconds)
    // Billing data doesn't change frequently, so longer interval is appropriate
    const interval = setInterval(fetchUsage, 60000);

    return () => clearInterval(interval);
  }, [fetchUsage]);

  // Listen for storage changes (in case plan is updated in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'plan_updated') {
        fetchUsage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchUsage]);

  return {
    ...planAccess,
    refresh: fetchUsage,
    isLoading,
  };
};