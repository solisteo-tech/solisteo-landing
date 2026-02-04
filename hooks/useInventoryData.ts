/**
 * Custom hooks for fetching inventory data
 */

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface InventorySummary {
    total_units: number;
    sellable_units: number;
    total_products: number;
    total_warehouses: number;
    disposition_breakdown: Record<string, number>;
    movement_summary: {
        receipts: number;
        shipments: number;
        returns: number;
        damaged: number;
        lost: number;
        found: number;
        disposed: number;
        in_transit: number;
    };
    doh_summary?: {
        average_doh: number;
        total_drr: number;
    };
    inventory_age_summary?: {
        doh_0: number;
        doh_1_7: number;
        doh_7_15: number;
        doh_15_30: number;
        doh_gt_30: number;
    };
}

export interface InventoryByLocation {
    data: Array<{
        state?: string;
        city?: string;
        pincode?: string;
        units: number;
    }>;
}

export interface LowDOHProduct {
    asin: string;
    sku: string;
    title: string;
    total_sales: number;
    drr: number;
    total_inventory: number;
    doh: number;
    city: string;
    state: string;
}

export interface LowDOHResponse {
    products: LowDOHProduct[];
    total_count: number;
    threshold: number;
    limit: number;
}

export interface InventoryTableResponse {
    data: any[];
    total: number;
    skip: number;
    limit: number;
}

// Update helper to serialize arrays for axios/params
const getParams = (params: any) => {
    const p = new URLSearchParams();
    Object.keys(params).forEach(key => {
        const value = params[key];
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
            value.forEach(v => p.append(key, v));
        } else {
            p.append(key, value);
        }
    });
    return p;
};

/**
 * Hook to fetch inventory summary
 */
export function useInventorySummary(
    state?: string[],
    city?: string[],
    pincode?: string[],
    search?: string,
    disposition?: string[],
    movementType?: string,
    asin?: string,
    msku?: string,
    title?: string,
    warehouseId?: string[],
    startDate?: string,
    endDate?: string
) {
    return useQuery<InventorySummary>({
        queryKey: ['inventory', 'summary', state, city, pincode, search, disposition, movementType, asin, msku, title, warehouseId, startDate, endDate],
        queryFn: async () => {
            const response = await api.get('/api/v1/seller/inventory/summary', {
                params: {
                    state,
                    city,
                    pincode,
                    search,
                    disposition,
                    movement_type: movementType,
                    asin,
                    msku,
                    title,
                    warehouse_id: warehouseId,
                    date_from: startDate,
                    date_to: endDate,
                    start_date: startDate,
                    end_date: endDate
                },
                paramsSerializer: (params) => getParams(params).toString()
            });
            return response.data;
        },
    });
}

/**
 * Hook to fetch inventory by state
 */
export function useInventoryByState(
    city?: string[],
    pincode?: string[],
    topN: number = 1000,
    search?: string,
    disposition?: string[],
    movementType?: string,
    asin?: string,
    msku?: string,
    title?: string,
    state?: string[],
    warehouseId?: string[],
    startDate?: string,
    endDate?: string
) {
    return useQuery<InventoryByLocation>({
        queryKey: ['inventory', 'by-state', city, pincode, topN, search, disposition, movementType, asin, msku, title, state, warehouseId, startDate, endDate],
        queryFn: async () => {
            const response = await api.get('/api/v1/seller/inventory/by-state', {
                params: {
                    city,
                    pincode,
                    top_n: topN,
                    search,
                    disposition,
                    movement_type: movementType,
                    asin,
                    msku,
                    title,
                    state,
                    warehouse_id: warehouseId,
                    date_from: startDate,
                    date_to: endDate,
                    start_date: startDate,
                    end_date: endDate
                },
                paramsSerializer: (params) => getParams(params).toString()
            });
            return response.data;
        },
    });
}

/**
 * Hook to fetch inventory by city
 */
export function useInventoryByCity(
    state?: string[],
    pincode?: string[],
    topN: number = 1000,
    search?: string,
    disposition?: string[],
    movementType?: string,
    asin?: string,
    msku?: string,
    title?: string,
    city?: string[],
    warehouseId?: string[],
    startDate?: string,
    endDate?: string
) {
    return useQuery<InventoryByLocation>({
        queryKey: ['inventory', 'by-city', state, pincode, topN, search, disposition, movementType, asin, msku, title, city, warehouseId, startDate, endDate],
        queryFn: async () => {
            const response = await api.get('/api/v1/seller/inventory/by-city', {
                params: {
                    state,
                    pincode,
                    top_n: topN,
                    search,
                    disposition,
                    movement_type: movementType,
                    asin,
                    msku,
                    title,
                    city,
                    warehouse_id: warehouseId,
                    date_from: startDate,
                    date_to: endDate,
                    start_date: startDate,
                    end_date: endDate
                },
                paramsSerializer: (params) => getParams(params).toString()
            });
            return response.data;
        },
    });
}

/**
 * Hook to fetch inventory by pincode
 */
export function useInventoryByPincode(
    state?: string[],
    city?: string[],
    pincode?: string[],
    topN: number = 1000,
    search?: string,
    disposition?: string[],
    movementType?: string,
    asin?: string,
    msku?: string,
    title?: string,
    warehouseId?: string[],
    startDate?: string,
    endDate?: string
) {
    return useQuery<InventoryByLocation>({
        queryKey: ['inventory', 'by-pincode', state, city, pincode, topN, search, disposition, movementType, asin, msku, title, warehouseId, startDate, endDate],
        queryFn: async () => {
            const response = await api.get('/api/v1/seller/inventory/by-pincode', {
                params: {
                    state,
                    city,
                    pincode,
                    top_n: topN,
                    search,
                    disposition,
                    movement_type: movementType,
                    asin,
                    msku,
                    title,
                    warehouse_id: warehouseId,
                    date_from: startDate,
                    date_to: endDate,
                    start_date: startDate,
                    end_date: endDate
                },
                paramsSerializer: (params) => getParams(params).toString()
            });
            return response.data;
        },
    });
}

/**
 * Hook to fetch inventory table data
 */
export function useInventoryTable(
    skip: number = 0,
    limit: number = 20,
    search?: string,
    disposition?: string[],
    state?: string[],
    city?: string[],
    pincode?: string[],
    movementType?: string,
    asin?: string,
    msku?: string,
    title?: string,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc',
    warehouseId?: string[],
    startDate?: string,
    endDate?: string,
    dohMin?: number | null,
    dohMax?: number | null
) {
    return useQuery<InventoryTableResponse>({
        queryKey: ['inventory', 'table', skip, limit, search, disposition, state, city, pincode, movementType, asin, msku, title, sortBy, sortOrder, warehouseId, startDate, endDate, dohMin, dohMax],
        queryFn: async () => {
            const response = await api.get('/api/v1/seller/inventory/table', {
                params: {
                    skip,
                    limit,
                    search,
                    disposition,
                    state,
                    city,
                    pincode,
                    movement_type: movementType,
                    asin,
                    msku,
                    title,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                    warehouse_id: warehouseId,
                    date_from: startDate,
                    date_to: endDate,
                    start_date: startDate,
                    end_date: endDate,
                    doh_min: dohMin,
                    doh_max: dohMax
                },
                paramsSerializer: (params) => getParams(params).toString()
            });
            return response.data;
        },
    });
}

/**
 * Hook to fetch inventory movements
 */
export function useInventoryMovements(
    state?: string[],
    city?: string[],
    pincode?: string[],
    search?: string,
    disposition?: string[],
    movementType?: string,
    asin?: string,
    msku?: string,
    title?: string,
    warehouseId?: string[],
    startDate?: string,
    endDate?: string
) {
    return useQuery<any>({
        queryKey: ['inventory', 'movements', state, city, pincode, search, disposition, movementType, asin, msku, title, warehouseId, startDate, endDate],
        queryFn: async () => {
            const response = await api.get('/api/v1/seller/inventory/movements', {
                params: {
                    state,
                    city,
                    pincode,
                    search,
                    disposition,
                    movement_type: movementType,
                    asin,
                    msku,
                    title,
                    warehouse_id: warehouseId,
                    date_from: startDate,
                    date_to: endDate,
                    start_date: startDate,
                    end_date: endDate
                },
                paramsSerializer: (params) => getParams(params).toString()
            });
            return response.data;
        },
    });
}

/**
 * Hook to fetch low DOH products
 */
export function useLowDOHProducts(
    threshold: number = 20,
    limit: number = 20,
    state?: string[],
    city?: string[],
    pincode?: string[],
    search?: string,
    disposition?: string[],
    asin?: string,
    msku?: string,
    title?: string,
    warehouseId?: string[],
    startDate?: string,
    endDate?: string
) {
    return useQuery<LowDOHResponse>({
        queryKey: ['inventory', 'low-doh', threshold, limit, state, city, pincode, search, disposition, asin, msku, title, warehouseId, startDate, endDate],
        queryFn: async () => {
            const response = await api.get('/api/v1/seller/inventory/low-doh', {
                params: {
                    threshold,
                    limit,
                    state,
                    city,
                    pincode,
                    search,
                    disposition,
                    asin,
                    msku,
                    title,
                    warehouse_id: warehouseId,
                    date_from: startDate,
                    date_to: endDate,
                    start_date: startDate,
                    end_date: endDate
                },
                paramsSerializer: (params) => getParams(params).toString()
            });
            return response.data;
        },
    });
}
