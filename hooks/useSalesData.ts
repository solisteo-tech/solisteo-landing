import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '@/lib/api';

export interface SalesFilters {
  sku?: string | null;
  selected_region?: string | null;
  selected_state?: string | null;
  selected_pincode?: string | null;
  date_from?: string | null;
  date_to?: string | null;
  top_n?: number | null;
  min_gmv?: number | null;
  is_business_only?: boolean | null;
}

export interface SalesInsightsResponse {
  summary: {
    total_gmv: number;
    total_units: number;
    total_orders: number;
    avg_order_value: number;
    growth_pct: number;
    top_sku?: { sku: string; gmv: number } | null;

    // New Metrics
    b2b_gmv: number;
    b2b_pct: number;
    cancelled_orders: number;
    cancellation_rate: number;
    fba_gmv: number;
    fbm_gmv: number;
    total_discount: number;
  };
  insights: any[];
  city_heatmap: { city: string; gmv: number; orders: number }[];
  anomalies: any[];
  meta: Record<string, any>;
}

export function useSalesInsights(filters: SalesFilters, options?: UseQueryOptions<SalesInsightsResponse>) {
  return useQuery<SalesInsightsResponse>({
    queryKey: ['sales', 'insights', filters],
    queryFn: async () => {
      const res = await api.get<SalesInsightsResponse>('/api/v1/seller/sales/insights', {
        params: {
          sku: filters.sku || undefined,
          selected_region: filters.selected_region || undefined,
          selected_state: filters.selected_state || undefined,
          selected_pincode: filters.selected_pincode || undefined,
          date_from: filters.date_from || undefined,
          date_to: filters.date_to || undefined,
          top_n: filters.top_n || undefined,
          min_gmv: filters.min_gmv || undefined,
          is_business_only: filters.is_business_only || undefined,
        },
      });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    ...options,
  });
}

export interface ProductPerformance {
  product_name: string;
  sku: string;
  asin?: string;
  units_sold: number;
  revenue: number;
  avg_selling_price: number;
  current_stock: number;
  stock_value: number;
  days_on_hand: number;
  stock_status: 'healthy' | 'low' | 'critical' | 'out_of_stock';
  velocity: 'fast' | 'medium' | 'slow';
  reorder_recommended: boolean;
}

export function useProductPerformance(filters: SalesFilters, limit: number = 20, skip: number = 0) {
  return useQuery<ProductPerformance[]>({
    queryKey: ['sales', 'product-performance', filters, limit, skip],
    queryFn: async () => {
      const res = await api.get<ProductPerformance[]>('/api/v1/seller/sales-inventory/product-performance', {
        params: {
          sku: filters.sku || undefined,
          selected_region: filters.selected_region || undefined,
          selected_state: filters.selected_state || undefined,
          selected_pincode: filters.selected_pincode || undefined,
          date_from: filters.date_from || undefined,
          date_to: filters.date_to || undefined,
          limit,
          skip,
        },
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Profitability hooks removed per request
