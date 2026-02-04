"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AgeSummaryData {
    doh_0: number;
    doh_1_7: number;
    doh_7_15: number;
    doh_15_30: number;
    doh_gt_30: number;
}

interface InventoryAgeSummaryProps {
    data?: AgeSummaryData;
    isLoading?: boolean;
    onFilterChange: (min: number | null, max: number | null) => void;
    currentFilter: { min: number | null; max: number | null };
}

export default function InventoryAgeSummary({ data, isLoading, onFilterChange, currentFilter }: InventoryAgeSummaryProps) {
    if (isLoading) {
        return (
            <Card className="border-gray-200 shadow-sm mb-6">
                <CardHeader className="pb-4">
                    <CardTitle className="text-base font-semibold text-gray-900">Inventory Age Summary</CardTitle>
                    <CardDescription>Breakdown by Days of Cover (DOH)</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-16 bg-gray-100 animate-pulse rounded-md" />
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const total = (data.doh_0 || 0) + (data.doh_1_7 || 0) + (data.doh_7_15 || 0) + (data.doh_15_30 || 0) + (data.doh_gt_30 || 0);

    const getPercentage = (val: number) => {
        if (!total) return '0%';
        return `${((val / total) * 100).toFixed(1)}%`;
    };

    const handleFilter = (min: number | null, max: number | null) => {
        // Toggle off if clicking same filter
        if (currentFilter.min === min && currentFilter.max === max) {
            onFilterChange(null, null);
        } else {
            onFilterChange(min, max);
        }
    };

    const isActive = (min: number | null, max: number | null) => {
        return currentFilter.min === min && currentFilter.max === max;
    };

    return (
        <Card className="border-gray-200 shadow-sm mb-6">
            <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold text-gray-900">Inventory Age Summary</CardTitle>
                <CardDescription>Click on a category to filter the inventory list below</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50 border-gray-200 hover:bg-gray-50">
                                <TableHead className="w-[150px] text-xs font-bold text-gray-700 uppercase tracking-wider pl-6">Metric</TableHead>
                                <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleFilter(0, 0)}>
                                    <div className="flex flex-col gap-0.5">
                                        <span>Stockout</span>
                                        <span className="text-[10px] text-gray-400 font-normal normal-case">No Coverage</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleFilter(0, 7)}>
                                    <div className="flex flex-col gap-0.5">
                                        <span>Critical Low</span>
                                        <span className="text-[10px] text-gray-400 font-normal normal-case">1-7 Days</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleFilter(7, 15)}>
                                    <div className="flex flex-col gap-0.5">
                                        <span>Low Stock</span>
                                        <span className="text-[10px] text-gray-400 font-normal normal-case">8-15 Days</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleFilter(15, 30)}>
                                    <div className="flex flex-col gap-0.5">
                                        <span>Healthy</span>
                                        <span className="text-[10px] text-gray-400 font-normal normal-case">16-30 Days</span>
                                    </div>
                                </TableHead>
                                <TableHead className="text-center text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleFilter(30, null)}>
                                    <div className="flex flex-col gap-0.5">
                                        <span>Overstock</span>
                                        <span className="text-[10px] text-gray-400 font-normal normal-case">30+ Days</span>
                                    </div>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="border-gray-100 divide-x divide-gray-100 hover:bg-transparent">
                                <TableCell className="font-medium text-sm text-gray-900 bg-gray-50/30 pl-6 border-r border-gray-200">
                                    Product Count
                                </TableCell>
                                <TableCell
                                    className={cn("text-center p-4 cursor-pointer transition-colors hover:bg-gray-50", isActive(0, 0) && "bg-gray-100 ring-2 ring-inset ring-gray-200")}
                                    onClick={() => handleFilter(0, 0)}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg font-semibold text-gray-900">{data.doh_0}</span>
                                        <Badge variant="secondary" className="text-[10px] bg-gray-100 text-gray-600 border-gray-200">
                                            {getPercentage(data.doh_0)}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className={cn("text-center p-4 cursor-pointer transition-colors hover:bg-red-50/50", isActive(0, 7) && "bg-red-50 ring-2 ring-inset ring-red-100")}
                                    onClick={() => handleFilter(0, 7)}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg font-semibold text-red-700">{data.doh_1_7}</span>
                                        <Badge variant="secondary" className="text-[10px] bg-red-50 text-red-700 border-red-200">
                                            {getPercentage(data.doh_1_7)}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className={cn("text-center p-4 cursor-pointer transition-colors hover:bg-amber-50/50", isActive(7, 15) && "bg-amber-50 ring-2 ring-inset ring-amber-100")}
                                    onClick={() => handleFilter(7, 15)}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg font-semibold text-amber-700">{data.doh_7_15}</span>
                                        <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                                            {getPercentage(data.doh_7_15)}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className={cn("text-center p-4 cursor-pointer transition-colors hover:bg-emerald-50/50", isActive(15, 30) && "bg-emerald-50 ring-2 ring-inset ring-emerald-100")}
                                    onClick={() => handleFilter(15, 30)}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg font-semibold text-emerald-700">{data.doh_15_30}</span>
                                        <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                            {getPercentage(data.doh_15_30)}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell
                                    className={cn("text-center p-4 cursor-pointer transition-colors hover:bg-blue-50/50", isActive(30, null) && "bg-blue-50 ring-2 ring-inset ring-blue-100")}
                                    onClick={() => handleFilter(30, null)}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="text-lg font-semibold text-blue-700">{data.doh_gt_30}</span>
                                        <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                                            {getPercentage(data.doh_gt_30)}
                                        </Badge>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
