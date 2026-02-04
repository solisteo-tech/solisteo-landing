/**
 * Inventory Detail Panel - Displays inventory distribution charts by location
 * Mimics DetailPanel.tsx from sales dashboard
 */

'use client';

import { useMemo } from 'react';
import { useInventoryByState, useInventoryByCity, useInventoryByPincode } from '@/hooks/useInventoryData';
import HorizontalBarChart from './HorizontalBarChart';
import MiniColumnChart from './MiniColumnChart';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface InventoryDetailPanelProps {
    level: 'state' | 'city' | 'pincode';
    state?: string;
    city?: string;
    pincode?: string;
    topN?: number;
    chartHeight?: number;
    onLocationClick?: (level: 'state' | 'city' | 'pincode', value: string) => void;
    // New filters for cross-filtering
    search?: string;
    disposition?: string;
    movementType?: string;
    asin?: string;
    msku?: string;
    title?: string;
}

export default function InventoryDetailPanel({
    level,
    state,
    city,
    pincode,
    topN,
    chartHeight = 300,
    onLocationClick,
    search,
    disposition,
    movementType,
    asin,
    msku,
    title,
}: InventoryDetailPanelProps) {
    // 1. Fetch data selectively based on level
    // We pass all available location context to all hooks to enable cross-filtering
    // 1. Fetch data selectively based on level
    // We pass all available location context to all hooks to enable cross-filtering
    const { data: stateData, isLoading: stateLoading } = useInventoryByState(city ? [city] : undefined, pincode ? [pincode] : undefined, topN, search, disposition ? [disposition] : undefined, movementType, asin, msku, title);
    const { data: cityData, isLoading: cityLoading } = useInventoryByCity(state ? [state] : undefined, pincode ? [pincode] : undefined, topN, search, disposition ? [disposition] : undefined, movementType, asin, msku, title);
    const { data: pincodeData, isLoading: pincodeLoading } = useInventoryByPincode(state ? [state] : undefined, city ? [city] : undefined, pincode ? [pincode] : undefined, topN, search, disposition ? [disposition] : undefined, movementType, asin, msku, title);

    // 2. Select Active Data
    const { data, isLoading } = useMemo(() => {
        if (level === 'state') return { data: stateData?.data || [], isLoading: stateLoading };
        if (level === 'city') return { data: cityData?.data || [], isLoading: cityLoading };
        return { data: pincodeData?.data || [], isLoading: pincodeLoading };
    }, [level, stateData, cityData, pincodeData, stateLoading, cityLoading, pincodeLoading]);

    // 3. Prepare Chart Data
    const chartData = useMemo(() => {
        if (!data) return [];
        return data.map((item) => ({
            name: (level === 'state' ? item.state : level === 'city' ? item.city : item.pincode) || 'Unknown',
            value: item.units,
        }));
    }, [data, level]);

    // 4. Configurations
    const chartTitle = level === 'state' ? 'State' : level === 'city' ? 'City' : 'Pincode';
    const unitFormatter = (val: number) => `${val.toLocaleString()} units`;

    // Choose Icon
    const icon = level === 'state' ? <Building2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />;

    // Gradient Backgrounds (matching Sales Dashboard theme)
    const gradientClass = useMemo(() => {
        if (level === 'state') return 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950';
        if (level === 'city') return 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950';
        return 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950';
    }, [level]);

    // Header Colors
    const headerGradient = useMemo(() => {
        if (level === 'state') return 'from-emerald-600 to-teal-600';
        if (level === 'city') return 'from-indigo-600 to-purple-600';
        return 'from-purple-600 to-pink-600';
    }, [level]);

    // Chart Colors
    const chartColor = useMemo(() => {
        if (level === 'state') return '#10b981'; // emerald-500
        if (level === 'city') return '#6366f1'; // indigo-500
        return '#d946ef'; // fuchsia-500
    }, [level]);

    const handleChartClick = (payload: any) => {
        if (onLocationClick && payload?.name) {
            onLocationClick(level, payload.name);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl shadow-md ${gradientClass} flex flex-col h-full overflow-hidden`}
        >
            {/* Header */}
            <div className={`px-5 py-3 bg-gradient-to-r ${headerGradient} text-white shadow-sm flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    {icon}
                    <h3 className="text-lg font-semibold">{chartTitle} Breakdown</h3>
                </div>
                {data && (
                    <div className="text-xs bg-white/20 px-2 py-1 rounded">
                        {data.length} {chartTitle.toLowerCase()}s
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="bg-white/60 dark:bg-gray-900/40 p-1 flex-1">
                <Card className="border-0 shadow-none bg-transparent h-full">
                    <CardContent className="p-4 h-full flex flex-col justify-center">
                        {isLoading ? (
                            <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                                Loading...
                            </div>
                        ) : chartData.length === 0 ? (
                            <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
                                No data available for filters
                            </div>
                        ) : (
                            <>
                                {/* Render appropriate chart type */}
                                {level === 'pincode' ? (
                                    <MiniColumnChart
                                        data={chartData}
                                        height={chartHeight}
                                        color={chartColor}
                                        onColumnClick={handleChartClick}
                                        valueFormatter={unitFormatter}
                                    />
                                ) : (
                                    <HorizontalBarChart
                                        data={chartData}
                                        height={chartHeight}
                                        color={chartColor}
                                        onBarClick={handleChartClick}
                                        valueFormatter={unitFormatter}
                                    />
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
