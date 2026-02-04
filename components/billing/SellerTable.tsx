/**
 * Seller Table Component
 * Displays billing information for all sellers with actions
 */

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SellerBilling } from '@/types/billing';
import {
    getStatusBadgeVariant,
    getStatusIcon,
    getStatusColor,
    formatCurrency,
    formatDate,
    getPlanBadgeVariant
} from '@/lib/billing-utils';
import { cn } from '@/lib/utils';

interface SellerTableProps {
    sellers: SellerBilling[];
    onChangePlan: (seller: SellerBilling) => void;
}

export function SellerTable({ sellers, onChangePlan }: SellerTableProps) {
    if (sellers.length === 0) {
        return (
            <Card className="p-12">
                <div className="text-center text-muted-foreground">
                    <p className="text-lg font-medium">No sellers found</p>
                    <p className="text-sm">Try adjusting your filters</p>
                </div>
            </Card>
        );
    }

    return (
        <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Monthly</TableHead>
                            <TableHead>Renewal</TableHead>
                            <TableHead>Total Revenue</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sellers.map((seller) => {
                            const StatusIcon = getStatusIcon(seller.status);
                            const statusColor = getStatusColor(seller.status);

                            return (
                                <TableRow key={seller.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{seller.name}</div>
                                            <div className="text-sm text-muted-foreground">{seller.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getPlanBadgeVariant(seller.current_plan)}>
                                            {seller.current_plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <StatusIcon className={cn("h-4 w-4", statusColor)} aria-hidden="true" />
                                            <Badge variant={getStatusBadgeVariant(seller.status)}>
                                                {seller.status}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatCurrency(seller.plan_price)}</TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {seller.renewal_date === 'N/A' ? 'N/A' : formatDate(seller.renewal_date)}
                                    </TableCell>
                                    <TableCell className="font-semibold">{formatCurrency(seller.total_revenue)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onChangePlan(seller)}
                                            aria-label={`Change plan for ${seller.name}`}
                                        >
                                            Change Plan
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {sellers.map((seller) => {
                    const StatusIcon = getStatusIcon(seller.status);
                    const statusColor = getStatusColor(seller.status);

                    return (
                        <Card key={seller.id} className="p-4">
                            <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-medium">{seller.name}</div>
                                        <div className="text-sm text-muted-foreground">{seller.email}</div>
                                    </div>
                                    <Badge variant={getPlanBadgeVariant(seller.current_plan)}>
                                        {seller.current_plan}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Status:</span>
                                        <div className="flex items-center gap-1 mt-1">
                                            <StatusIcon className={cn("h-3 w-3", statusColor)} aria-hidden="true" />
                                            <Badge variant={getStatusBadgeVariant(seller.status)} className="text-xs">
                                                {seller.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Monthly:</span>
                                        <div className="font-semibold mt-1">{formatCurrency(seller.plan_price)}</div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Renewal:</span>
                                        <div className="font-mono text-xs mt-1">
                                            {seller.renewal_date === 'N/A' ? 'N/A' : formatDate(seller.renewal_date)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Total Revenue:</span>
                                        <div className="font-semibold mt-1">{formatCurrency(seller.total_revenue)}</div>
                                    </div>
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onChangePlan(seller)}
                                    className="w-full"
                                    aria-label={`Change plan for ${seller.name}`}
                                >
                                    Change Plan
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </>
    );
}
