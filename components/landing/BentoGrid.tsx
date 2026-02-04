'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, BarChart3, Database, ArrowRight, Zap, Globe } from 'lucide-react';

export default function BentoGrid() {
    return (
        <section className="pt-6 pb-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[280px]">

                    {/* SyncBot Card */}
                    <Link
                        href="/syncbot"
                        className="md:col-span-12 md:row-span-2 group relative overflow-hidden rounded-[2.5rem] bg-slate-50 border border-slate-100 hover:border-blue-400 transition-all p-12"
                    >
                        <div className="absolute -right-20 -bottom-20 w-[600px] h-[450px] opacity-20 group-hover:opacity-40 transition-all group-hover:scale-105 pointer-events-none">
                            <img
                                src="/images/homepage/product_dashboard_premium.png"
                                alt="SyncBot Dashboard"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                                >
                                    <ShoppingCart size={14} />
                                    Marketplace Dominance
                                </motion.div>
                                <h3 className="text-5xl font-black text-slate-950 mb-6 tracking-tighter uppercase">SyncBot</h3>
                                <p className="text-xl text-slate-600 max-w-md leading-relaxed font-medium">
                                    Maximize your Buy Box dominance on Amazon.in. Real-time listing health and deep-reality inventory sync for Bharat's top sellers.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 text-blue-600 font-bold uppercase tracking-widest text-xs group/link">
                                Scale your Operations <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </section>
    );
}

function StatItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="text-center md:text-left translate-y-2">
            <div className="text-4xl font-black text-slate-950 tracking-tighter mb-1">{value}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</div>
        </div>
    );
}
