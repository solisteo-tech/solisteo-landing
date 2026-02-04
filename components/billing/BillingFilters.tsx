/**
 * Billing Filters Component
 * Search and filter controls for billing table
 */

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { BillingFilters as BillingFiltersType } from '@/types/billing';

interface BillingFiltersProps {
    filters: BillingFiltersType;
    onFilterChange: (filters: Partial<BillingFiltersType>) => void;
    planOptions: string[];
}

export function BillingFilters({ filters, onFilterChange, planOptions }: BillingFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => onFilterChange({ search: e.target.value })}
                    className="pl-9"
                    aria-label="Search sellers"
                />
            </div>

            <Select
                value={filters.plan}
                onValueChange={(value) => onFilterChange({ plan: value })}
            >
                <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by plan">
                    <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Plans</SelectItem>
                    {planOptions.map((plan) => (
                        <SelectItem key={plan} value={plan}>
                            {plan}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={filters.status}
                onValueChange={(value) => onFilterChange({ status: value })}
            >
                <SelectTrigger className="w-full sm:w-[180px]" aria-label="Filter by status">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="past_due">Past Due</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="trialing">Trialing</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                    const [sortBy, sortOrder] = value.split('-') as [BillingFiltersType['sortBy'], BillingFiltersType['sortOrder']];
                    onFilterChange({ sortBy, sortOrder });
                }}
            >
                <SelectTrigger className="w-full sm:w-[200px]" aria-label="Sort by">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="revenue-desc">Revenue (High-Low)</SelectItem>
                    <SelectItem value="revenue-asc">Revenue (Low-High)</SelectItem>
                    <SelectItem value="renewal_date-asc">Renewal (Soonest)</SelectItem>
                    <SelectItem value="renewal_date-desc">Renewal (Latest)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
