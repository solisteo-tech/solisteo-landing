"use client";

import { useState } from "react";
import { useProductPerformance, SalesFilters } from "@/hooks/useSalesData";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { currencyFormatter, numberFormatter } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SalesDetailsTableProps {
    filters: SalesFilters;
}

const PAGE_SIZE = 20;

export default function SalesDetailsTable({ filters }: SalesDetailsTableProps) {
    const [page, setPage] = useState(0);

    // Reset page when filters change (optional, but good UX)
    // Logic could be added here or in parent, but for now we keep simple state.

    const { data: products, isLoading, isError } = useProductPerformance(filters, PAGE_SIZE, page * PAGE_SIZE);

    const handleNext = () => {
        if (products && products.length === PAGE_SIZE) {
            setPage(p => p + 1);
        }
    };

    const handlePrev = () => {
        setPage(p => Math.max(0, p - 1));
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="space-y-0.5">
                    <CardTitle className="text-lg font-semibold">Sales Details</CardTitle>
                    <CardDescription>Detailed breakdown by SKU with inventory status</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                        disabled={page === 0 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-500 font-medium">Page {page + 1}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNext}
                        disabled={isLoading || (products && products.length < PAGE_SIZE)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="border-t border-gray-100">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                                <TableHead className="w-[300px]">Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>ASIN</TableHead>
                                <TableHead className="text-right">Units Sold</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                                <TableHead className="text-right">Avg Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : isError ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-red-500">
                                        Error loading sales details.
                                    </TableCell>
                                </TableRow>
                            ) : products && products.length > 0 ? (
                                products.map((product, index) => (
                                    <TableRow key={`${product.sku}-${product.asin}-${index}`} className="group">
                                        <TableCell className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer">
                                            <div className="line-clamp-2" title={product.product_name}>
                                                {product.product_name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-500 font-mono text-xs">{product.sku}</TableCell>
                                        <TableCell className="text-gray-500 font-mono text-xs">{product.asin || '-'}</TableCell>
                                        <TableCell className="text-right font-medium">{numberFormatter.format(product.units_sold)}</TableCell>
                                        <TableCell className="text-right text-gray-900 font-semibold">{currencyFormatter.format(product.revenue)}</TableCell>
                                        <TableCell className="text-right text-gray-500 text-sm">{currencyFormatter.format(product.avg_selling_price)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                                        No sales data found for current filters.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
