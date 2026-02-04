'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import RequestAccessModal from './RequestAccessModal';

export default function SyncBotHero() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [units, setUnits] = useState<number[]>([]);
    const [chartHeights, setChartHeights] = useState<number[]>([]);

    useEffect(() => {
        setMounted(true);
        setUnits([...Array(8)].map(() => Math.floor(Math.random() * 900 + 100)));
        setChartHeights([...Array(20)].map(() => Math.random() * 100));
    }, []);

    return (
        <section className="relative min-h-[95vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 overflow-hidden bg-white">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">

                {/* Text Left */}
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        Infrastructure Node 01
                    </motion.div>

                    <motion.h1
                        className="text-6xl md:text-8xl font-black text-slate-950 tracking-tighter leading-[0.9] mb-8 uppercase"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        SYNCBOT <br />
                        <span className="text-blue-600 italic">DOMINANCE.</span>
                    </motion.h1>

                    <motion.p
                        className="text-xl md:text-2xl text-slate-600 max-w-xl lg:mx-0 mx-auto leading-relaxed font-medium mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        The absolute engine for Bharat's top sellers. Scale your marketplace footprint with autonomous inventory logic, real-time listing health, and a cross-platform reality mesh that never sleeps.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-8"
                    >
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full sm:w-auto px-12 py-5 bg-slate-950 text-white font-bold rounded-full hover:bg-blue-600 shadow-2xl shadow-blue-100 transition-all active:scale-95 text-sm uppercase tracking-widest"
                        >
                            Get Started
                        </button>
                        <Link
                            href="/syncbot/login"
                            className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors border-b border-slate-200 hover:border-blue-600 pb-1"
                        >
                            Partner Login
                        </Link>
                    </motion.div>
                </div>


                {/* Dashboard Right */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative flex items-center justify-center"
                >
                    <div className="w-full max-w-xl aspect-[4/3] bg-white rounded-[3rem] border border-slate-100 p-6 shadow-2xl shadow-blue-100 relative z-20 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8 px-2">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-100" />
                                <div className="w-3 h-3 rounded-full bg-slate-100" />
                                <div className="w-3 h-3 rounded-full bg-slate-100" />
                            </div>
                            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Operations Monitor v2.0</div>
                        </div>

                        {/* Animated Grid */}
                        <div className="h-full w-full bg-slate-50/50 rounded-2xl p-8 border border-slate-100 font-mono text-[11px] text-slate-600">
                            <div className="space-y-5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100/50">
                                        <div className="flex items-center gap-6">
                                            <span className="text-blue-600 font-bold">{`ID_${1024 + i}`}</span>
                                            <span className="text-slate-400 font-bold uppercase tracking-tighter">AMZ_IN_PROD</span>
                                        </div>
                                        <motion.div
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                            <span className="text-blue-600 font-black uppercase tracking-widest text-[9px]">Live Data</span>
                                        </motion.div>
                                        <span className="text-slate-800 font-bold">{mounted ? units[i] : '---'} STK</span>
                                    </div>
                                ))}

                                {/* Floating Chart */}
                                <div className="mt-12 h-20 flex items-end justify-between gap-1.5 opacity-60">
                                    {[...Array(24)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: mounted ? `${chartHeights[i % 20]}%` : '0%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.05 }}
                                            className="w-full bg-blue-100 hover:bg-blue-400 rounded-t-sm transition-colors"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Stats */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 w-36 h-36 bg-white border border-slate-100 rounded-[2rem] flex flex-col justify-center items-center shadow-2xl z-30"
                    >
                        <div className="text-3xl font-black text-blue-600 tracking-tighter uppercase">99.9<span className="text-sm">%</span></div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-2">Active Uptime</div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-10 -left-6 w-48 h-28 bg-white border border-slate-100 rounded-[2rem] p-8 flex flex-col justify-center shadow-2xl z-30"
                    >
                        <div className="text-2xl font-black text-slate-950 tracking-tighter uppercase leading-none">14<span className="text-blue-600">MS</span></div>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-2">Reality Latency</div>
                    </motion.div>
                </motion.div>

            </div>

            <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}
