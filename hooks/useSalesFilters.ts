import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { getDefaultDateRange, getDateRangePreset } from '@/lib/formatters';
import type { SalesFilters } from '@/types/sales';

/**
 * Hook to manage sales filtering logic
 * Handles state, debouncing, and filter resetting
 */
export const useSalesFilters = () => {
    const defaultDates = useMemo(() => getDefaultDateRange(), []);

    const [filters, setFilters] = useState<SalesFilters>({
        sku: undefined,
        selectedRegion: undefined,
        selectedState: undefined,
        selectedPincode: undefined,
        dateFrom: defaultDates.from,
        dateTo: defaultDates.to,
        topN: 10,
        minGmv: undefined,
        isBusinessOnly: false,
    });

    // Debounce filters to prevent excessive API calls
    const debouncedFilters = useDebounce(filters, 300);

    // Reset filters to default state
    const reset = useCallback(() => {
        setFilters({
            sku: undefined,
            selectedRegion: undefined,
            selectedState: undefined,
            selectedPincode: undefined,
            dateFrom: defaultDates.from,
            dateTo: defaultDates.to,
            topN: 10,
            minGmv: undefined,
            isBusinessOnly: false,
        });
    }, [defaultDates]);

    // Handle row clicks for drill-down navigation
    const handleRowClick = useCallback((level: 'region' | 'state' | 'pincode', value: string) => {
        setFilters((prev) => {
            switch (level) {
                case 'region':
                    return {
                        ...prev,
                        selectedRegion: prev.selectedRegion === value ? undefined : value,
                        selectedState: undefined,
                        selectedPincode: undefined
                    };
                case 'state':
                    return {
                        ...prev,
                        selectedState: prev.selectedState === value ? undefined : value,
                        selectedPincode: undefined
                    };
                case 'pincode':
                    return {
                        ...prev,
                        selectedPincode: prev.selectedPincode === value ? undefined : value
                    };
                default:
                    return prev;
            }
        });
    }, []);

    const setDatePreset = useCallback((preset: 'yesterday' | 'last7' | 'last30') => {
        const { from, to } = getDateRangePreset(preset);
        setFilters(f => ({ ...f, dateFrom: from, dateTo: to }));
    }, []);

    return {
        filters,
        setFilters,
        debouncedFilters,
        reset,
        handleRowClick,
        defaultDates,
        setDatePreset
    };
};
