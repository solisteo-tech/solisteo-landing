'use client';

import { motion } from 'framer-motion';

interface StatsTickerProps {
    stats: {
        totalOrders: number;
        activeUsers: number;
        totalRevenue: number;
        totalItems: number;
    };
}

export default function StatsTicker({ stats }: StatsTickerProps) {
    const formatNum = (num: number) => new Intl.NumberFormat('en-IN').format(num);

    return (
        <div className="bg-white border-y border-slate-100 py-16">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <TickerItem label="Orders Processed" value={formatNum(stats.totalOrders)} suffix="+" />
                <TickerItem label="Assets Managed" value={`₹${formatNum(Math.floor(stats.totalRevenue / 100))}`} suffix="Cr" />
                <TickerItem label="Live Inventory" value={formatNum(stats.totalItems)} suffix="+" />
                <TickerItem label="Health Scans" value={formatNum(stats.activeUsers)} suffix="+" />
            </div>
        </div>
    );
}

function TickerItem({ label, value, suffix }: { label: string, value: string, suffix: string }) {
    return (
        <div className="flex flex-col items-center md:items-start group">
            <div className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight mb-3 uppercase flex items-baseline gap-1">
                <span className="shrink-0">{value}</span>
                <span className="text-blue-600 group-hover:animate-pulse text-2xl md:text-3xl shrink-0 whitespace-nowrap">{suffix}</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 whitespace-nowrap">{label}</div>
        </div>
    );
}
