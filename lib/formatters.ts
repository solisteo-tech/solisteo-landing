/**
 * Number and Currency Formatters
 * Reusable formatters for consistent number/currency display
 */

/**
 * Currency formatter for Indian Rupees
 */
export const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

/**
 * Number formatter for Indian locale
 */
export const numberFormatter = new Intl.NumberFormat('en-IN');

/**
 * Get default date range (last 30 days)
 */
export const getDefaultDateRange = () => {
    return getDateRangePreset('last30');
};

export type DatePreset = 'yesterday' | 'last7' | 'last30' | 'custom';

/**
 * Get date range for a specific preset
 */
export const getDateRangePreset = (preset: DatePreset) => {
    const today = new Date();
    const fromDate = new Date(today);

    switch (preset) {
        case 'yesterday':
            fromDate.setDate(today.getDate() - 1);
            // Yesterday means ONLY yesterday, so To date should also be yesterday? 
            // Usually "Previous Day" in reports implies a 1-day range.
            // Let's assume To date is also yesterday for a single day report.
            const yesterdayStr = fromDate.toISOString().split('T')[0];
            return { from: yesterdayStr, to: yesterdayStr };

        case 'last7':
            fromDate.setDate(today.getDate() - 7);
            break;

        case 'last30':
            fromDate.setDate(today.getDate() - 30);
            break;

        default:
            return { from: '', to: '' };
    }

    return {
        from: fromDate.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0],
    };
};

/**
 * Format percentage with sign
 */
export const formatPercentage = (value: number): string => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${Math.abs(value).toFixed(1)}%`;
};
