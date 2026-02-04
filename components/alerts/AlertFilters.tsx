/**
 * Alert Filter Buttons Component
 * Filter controls for alert list
 */

import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { FilterType } from '@/types/alerts';

interface AlertFiltersProps {
    currentFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    counts: {
        all: number;
        active: number;
        critical: number;
        resolved: number;
    };
}

export function AlertFilters({ currentFilter, onFilterChange, counts }: AlertFiltersProps) {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm font-medium">Filter:</span>
            <div className="flex gap-2 flex-wrap">
                <Button
                    variant={currentFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange('all')}
                    aria-pressed={currentFilter === 'all'}
                >
                    All ({counts.all})
                </Button>
                <Button
                    variant={currentFilter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange('active')}
                    aria-pressed={currentFilter === 'active'}
                >
                    Active ({counts.active})
                </Button>
                <Button
                    variant={currentFilter === 'critical' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange('critical')}
                    aria-pressed={currentFilter === 'critical'}
                >
                    Critical ({counts.critical})
                </Button>
                <Button
                    variant={currentFilter === 'resolved' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange('resolved')}
                    aria-pressed={currentFilter === 'resolved'}
                >
                    Resolved ({counts.resolved})
                </Button>
            </div>
        </div>
    );
}
