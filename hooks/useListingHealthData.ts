/**
 * React Query hooks for Listing Health API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ListingHealthData {
    id: string;
    asin: string;
    msku: string;
    title: string;
    health_status: 'live' | 'non_live' | 'checking';
    health_reason: string | null;
    last_scan_time: string | null;
    delivery_times: {
        north: number;
        south: number;
        east: number;
        west: number;
    } | null;
    buy_box: {
        is_owner: boolean;
        winner_name: string;
        price_difference: number;
        winning_price?: number;
        my_price?: number;
        winner_deal?: string;
        my_deal?: string;
    };
    current_price: number | null;
    last_updated: string | null;
}

export interface ListingHealthResponse {
    data: ListingHealthData[];
    total: number;
    skip: number;
    limit: number;
    summary?: {
        total_items: number;
        live_listings: number;
        issues_found: number;
        buy_box_win_count: number;
    };
}

export interface ForceCheckStatus {
    can_check: boolean;
    last_check_date: string | null;
    checks_remaining: number;
    status?: string;
    job_id?: string;
}

export interface ForceCheckResponse {
    status: string;
    job_id: string;
    message: string;
    total_asins: number;
}

export interface JobStatus {
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    total_asins: number;
    processed_asins: number;
    requested_at: string;
    completed_at: string | null;
}

/**
 * Hook to fetch listing health inventory data
 */
export function useListingHealthData(
    skip: number = 0,
    limit: number = 10,
    search?: string,
    status?: string,
    buyBoxStatus?: string,
    dateFrom?: string,
    dateTo?: string
) {
    return useQuery<ListingHealthResponse>({
        queryKey: ['listing-health', skip, limit, search, status, buyBoxStatus, dateFrom, dateTo],
        queryFn: async () => {
            const params = new URLSearchParams({
                skip: skip.toString(),
                limit: limit.toString(),
                ...(search && { search }),
                ...(status && status !== 'all' && { status }),
                ...(buyBoxStatus && buyBoxStatus !== 'all' && { buy_box_status: buyBoxStatus }),
                ...(dateFrom && { date_from: dateFrom }),
                ...(dateTo && { date_to: dateTo }),
            });

            const response = await api.get(`/api/v1/seller/listing-health/inventory?${params}`);
            return response.data;
        },
        staleTime: 30000, // 30 seconds
    });
}

/**
 * Hook to check force check status
 */
export function useForceCheckStatus() {
    return useQuery<ForceCheckStatus>({
        queryKey: ['force-check-status'],
        queryFn: async () => {
            const response = await api.get('/api/v1/seller/listing-health/force-check/status');
            return response.data;
        },
        refetchInterval: 60000, // Refetch every minute
    });
}

/**
 * Hook to trigger force check
 */
export function useTriggerForceCheck() {
    const queryClient = useQueryClient();

    return useMutation<ForceCheckResponse, Error>({
        mutationFn: async () => {
            const response = await api.post('/api/v1/seller/listing-health/force-check');
            return response.data;
        },
        onSuccess: () => {
            // Invalidate force check status
            queryClient.invalidateQueries({ queryKey: ['force-check-status'] });
        },
    });
}

/**
 * Hook to poll job status
 */
export function useJobStatus(jobId: string | null, enabled: boolean = true) {
    return useQuery<JobStatus>({
        queryKey: ['job-status', jobId],
        queryFn: async () => {
            if (!jobId) throw new Error('No job ID');
            const response = await api.get(`/api/v1/seller/listing-health/force-check/job/${jobId}`);
            return response.data;
        },
        enabled: enabled && !!jobId,
        refetchInterval: (data) => {
            // Stop polling if completed or failed
            // Note: data might be undefined initially
            const status = data?.status;
            if (status === 'completed' || status === 'failed') {
                return false;
            }
            return 3000; // Poll every 3 seconds
        },
    });
}

/**
 * Hook to search specific ASINs/MSKUs
 */
export function useSearchListingHealth() {
    return useMutation<ListingHealthResponse, Error, { asins?: string[]; mskus?: string[] }>({
        mutationFn: async (payload) => {
            const response = await api.post('/api/v1/seller/listing-health/search', payload);
            return response.data;
        },
    });
}
