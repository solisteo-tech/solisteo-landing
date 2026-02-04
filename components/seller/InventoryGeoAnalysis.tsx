"use client";

import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { useInventoryByState, useInventoryByCity, useInventoryByPincode } from '@/hooks/useInventoryData';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface InventoryGeoAnalysisProps {
    // Filters
    search?: string;
    selectedAsin?: string;
    selectedMsku?: string;
    selectedTitle?: string;
    selectedDispositions?: string[];
    selectedMovement?: string;
    selectedWarehouses?: string[];
    startDate?: string;
    endDate?: string;

    // Selection State
    selectedStates: string[];
    setSelectedStates: (val: string[]) => void;
    selectedCities: string[];
    setSelectedCities: (val: string[]) => void;
    selectedPincodes: string[];
    setSelectedPincodes: (val: string[]) => void;
}

export default function InventoryGeoAnalysis({
    search,
    selectedAsin,
    selectedMsku,
    selectedTitle,
    selectedDispositions,
    selectedMovement,
    selectedWarehouses,
    startDate,
    endDate,
    selectedStates,
    setSelectedStates,
    selectedCities,
    setSelectedCities,
    selectedPincodes,
    setSelectedPincodes,
}: InventoryGeoAnalysisProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        // Delay mount to ensure container dimensions are set
        // Longer delay to prevent Recharts dimension warnings
        const timer = setTimeout(() => setIsMounted(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Fetch Data (Reflecting current filters)
    const { data: stateData, isLoading: stateLoading } = useInventoryByState(
        selectedCities.length ? selectedCities : undefined,
        selectedPincodes.length ? selectedPincodes : undefined,
        20, // Top 20 states max
        search,
        selectedDispositions && selectedDispositions.length ? selectedDispositions : undefined,
        selectedMovement,
        selectedAsin,
        selectedMsku,
        selectedTitle,
        undefined,
        selectedWarehouses && selectedWarehouses.length ? selectedWarehouses : undefined,
        startDate,
        endDate
    );

    const { data: cityData, isLoading: cityLoading } = useInventoryByCity(
        selectedStates.length ? selectedStates : undefined,
        selectedPincodes.length ? selectedPincodes : undefined,
        20, // Top 20 cities
        search,
        selectedDispositions && selectedDispositions.length ? selectedDispositions : undefined,
        selectedMovement,
        selectedAsin,
        selectedMsku,
        selectedTitle,
        undefined,
        selectedWarehouses && selectedWarehouses.length ? selectedWarehouses : undefined,
        startDate,
        endDate
    );

    const { data: pincodeData, isLoading: pincodeLoading } = useInventoryByPincode(
        selectedStates.length ? selectedStates : undefined,
        selectedCities.length ? selectedCities : undefined,
        undefined,
        20, // Top 20
        search,
        selectedDispositions && selectedDispositions.length ? selectedDispositions : undefined,
        selectedMovement,
        selectedAsin,
        selectedMsku,
        selectedTitle,
        selectedWarehouses && selectedWarehouses.length ? selectedWarehouses : undefined,
        startDate,
        endDate
    );

    // Handlers
    const handleStateClick = (data: any) => {
        if (!data || !data.state) return;
        const val = data.state;
        setSelectedStates(selectedStates.includes(val) ? selectedStates.filter(s => s !== val) : [...selectedStates, val]);
    };

    const handleCityClick = (data: any) => {
        if (!data || !data.city) return;
        const val = data.city;
        setSelectedCities(selectedCities.includes(val) ? selectedCities.filter(s => s !== val) : [...selectedCities, val]);
    };

    const handlePincodeClick = (data: any) => {
        if (!data || !data.pincode) return;
        const val = data.pincode;
        setSelectedPincodes(selectedPincodes.includes(val) ? selectedPincodes.filter(s => s !== val) : [...selectedPincodes, val]);
    };

    const downloadCSV = (data: any[], filename: string) => {
        if (!data || !data.length) return;

        // Extract headers
        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* State Chart: Horizontal Bar (Green) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-sm font-medium">By State</CardTitle>
                        <CardDescription>Top States by Units</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadCSV(stateData?.data || [], 'inventory_by_state')}>
                        <Download className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="h-[250px] w-full min-h-[250px]">
                    {stateLoading || !isMounted ? (
                        <Skeleton className="w-full h-full" />
                    ) : !stateData?.data || stateData.data.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-sm text-gray-400">
                            No data available
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '100%', minHeight: 250 }}>
                            <ResponsiveContainer width="100%" aspect={2.5} minWidth={0} minHeight={0}>
                                <BarChart
                                    data={stateData?.data}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="state"
                                        width={90}
                                        tick={{ fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar
                                        dataKey="units"
                                        onClick={handleStateClick}
                                        radius={[0, 4, 4, 0]}
                                        cursor="pointer"
                                        barSize={20}
                                    >
                                        {stateData?.data.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={selectedStates.includes(entry.state) ? '#059669' : '#10b981'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* City Chart: Horizontal Bar (Blue) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-sm font-medium">By City</CardTitle>
                        <CardDescription>Top Cities by Units</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadCSV(cityData?.data || [], 'inventory_by_city')}>
                        <Download className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="h-[250px] w-full min-h-[250px]">
                    {cityLoading || !isMounted ? (
                        <Skeleton className="w-full h-full" />
                    ) : !cityData?.data || cityData.data.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-sm text-gray-400">
                            No data available
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '100%', minHeight: 250 }}>
                            <ResponsiveContainer width="100%" aspect={2.5} minWidth={0} minHeight={0}>
                                <BarChart
                                    data={cityData?.data}
                                    layout="vertical"
                                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                                >
                                    <XAxis type="number" hide />
                                    <YAxis
                                        type="category"
                                        dataKey="city"
                                        width={90}
                                        tick={{ fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar
                                        dataKey="units"
                                        onClick={handleCityClick}
                                        radius={[0, 4, 4, 0]}
                                        cursor="pointer"
                                        barSize={20}
                                    >
                                        {cityData?.data.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={selectedCities.includes(entry.city) ? '#2563eb' : '#60a5fa'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pincode Chart: Vertical Columns (Green) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-0.5">
                        <CardTitle className="text-sm font-medium">By Pincode</CardTitle>
                        <CardDescription>Top Pincodes by Units</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadCSV(pincodeData?.data || [], 'inventory_by_pincode')}>
                        <Download className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="h-[250px] w-full min-h-[250px]">
                    {pincodeLoading || !isMounted ? (
                        <Skeleton className="w-full h-full" />
                    ) : !pincodeData?.data || pincodeData.data.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-sm text-gray-400">
                            No data available
                        </div>
                    ) : (
                        <div style={{ width: '100%', height: '100%', minHeight: 250 }}>
                            <ResponsiveContainer width="100%" aspect={2.5} minWidth={0} minHeight={0}>
                                <BarChart
                                    data={pincodeData?.data}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <XAxis
                                        dataKey="pincode"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        height={60}
                                        angle={-45}
                                        textAnchor="end"
                                        interval={0}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar
                                        dataKey="units"
                                        onClick={handlePincodeClick}
                                        radius={[4, 4, 0, 0]}
                                        cursor="pointer"
                                    >
                                        {pincodeData?.data.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={selectedPincodes.includes(entry.pincode) ? '#059669' : '#10b981'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
