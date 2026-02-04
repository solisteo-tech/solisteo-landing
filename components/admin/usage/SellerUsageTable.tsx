'use client';

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Crown, Shield, Zap, CheckCircle } from 'lucide-react';
import { SellerUsageData } from '@/lib/types/admin-usage';

// ----------------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------------

const UsageBar = ({ current, max, label }: { current: number; max: number; label?: string }) => {
    if (max === -1) {
        return (
            <div className="w-full max-w-[120px] flex flex-col items-center">
                <span className="text-xs text-muted-foreground">Unlimited</span>
            </div>
        );
    }

    const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
    const isNearLimit = percentage > 85;
    const isOverLimit = current > max;

    return (
        <div className="w-full max-w-[140px] space-y-1 mx-auto">
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                <span>{current.toLocaleString()}</span>
                <span>{max.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isOverLimit ? 'bg-destructive' : isNearLimit ? 'bg-orange-500' : 'bg-primary'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

const PlanBadge = ({ planName, status }: { planName: string; status: string }) => {
    const getConfig = () => {
        if (status !== 'active') {
            return { icon: <AlertTriangle className="h-3 w-3" />, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };
        }

        switch (planName.toLowerCase()) {
            case 'premium':
            case 'enterprise':
                return { icon: <Crown className="h-3 w-3" />, color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800' };
            case 'growth':
            case 'pro':
                return { icon: <Shield className="h-3 w-3" />, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
            default:
                return { icon: <Zap className="h-3 w-3" />, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' };
        }
    };

    const config = getConfig();

    return (
        <Badge variant="outline" className={`${config.color} border gap-1 shadow-sm`}>
            {config.icon}
            {planName}
        </Badge>
    );
};

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------

interface SellerUsageTableProps {
    data: SellerUsageData[];
}

export function SellerUsageTable({ data }: SellerUsageTableProps) {
    return (
        <div className="rounded-md border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center w-[150px]">Charts</TableHead>
                        <TableHead className="text-center w-[150px]">Alerts</TableHead>
                        <TableHead className="text-center w-[150px]">Sources</TableHead>
                        <TableHead className="text-center w-[150px]">API Calls</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                No sellers found matching filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((seller) => (
                            <TableRow key={seller.seller_id} className="group hover:bg-muted/50">
                                <TableCell>
                                    <div className="space-y-0.5">
                                        <div className="font-medium text-sm">{seller.company_name}</div>
                                        <div className="text-xs text-muted-foreground font-mono">{seller.email}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <PlanBadge planName={seller.current_plan} status={seller.plan_status} />
                                </TableCell>
                                <TableCell>
                                    {seller.plan_status === 'active' ? (
                                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Active
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="capitalize">
                                            {seller.plan_status.replace('_', ' ')}
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <UsageBar current={seller.charts_created} max={seller.max_charts} />
                                </TableCell>
                                <TableCell className="text-center">
                                    <UsageBar current={seller.alerts_configured} max={seller.max_alerts} />
                                </TableCell>
                                <TableCell className="text-center">
                                    <UsageBar current={seller.data_sources_connected} max={seller.max_data_sources} />
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="font-mono text-sm">{seller.api_calls_made.toLocaleString()}</span>
                                        {seller.api_calls_limit > 0 && (
                                            <span className="text-[10px] text-muted-foreground/70">
                                                / {seller.api_calls_limit.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
