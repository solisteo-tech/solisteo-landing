/**
 * Sales Types
 * Shared TypeScript interfaces for sales insights and analytics
 */

export interface SalesFilters {
    sku?: string;
    selectedRegion?: string;
    selectedState?: string;
    selectedPincode?: string;
    dateFrom?: string;
    dateTo?: string;
    topN?: number;
    minGmv?: number;
    isBusinessOnly?: boolean;
}

export interface SalesSummary {
    total_gmv: number;
    total_units: number;
    avg_order_value: number;
    growth_pct: number;
}

export interface SalesInsights {
    summary: SalesSummary;
    // Add other fields as needed
}

export type GeographicLevel = 'region' | 'state' | 'pincode';
