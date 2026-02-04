'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

const SERVICES = [
    { name: 'Reality Sync Core', status: 'operational', uptime: '99.99%' },
    { name: 'Amazon Node (India)', status: 'operational', uptime: '99.98%' },
    { name: 'Flipkart Node (India)', status: 'operational', uptime: '99.97%' },
    { name: 'ONDC Gateway', status: 'operational', uptime: '99.95%' },
    { name: 'Analytical Compute', status: 'operational', uptime: '99.99%' },
    { name: 'Global API Bridge', status: 'operational', uptime: '99.99%' },
];

export default function SystemPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* System Hero */}
            <section className="pt-48 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-green-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-40" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-green-50 border border-green-100 text-green-600 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            All Systems Operational
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black mb-12 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            NETWORK <br />
                            <span className="text-blue-600 italic">VITALITY.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                            Real-time monitoring of every infrastructure node and marketplace bridge within the <span className="text-blue-600">Solisteo Mesh.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Service Grid */}
            <section className="py-24 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SERVICES.map((service, idx) => (
                        <ServiceCard key={idx} {...service} />
                    ))}
                </div>
            </section>

            {/* Uptime Insight */}
            <section className="py-40 px-6">
                <div className="max-w-5xl mx-auto bg-slate-950 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[100px] opacity-20 pointer-events-none" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">DETERMINISTIC <br />RELIABILITY.</h3>
                            <p className="text-white/60 font-medium leading-relaxed">
                                Our infrastructure is engineered for redundancy. Every node is mirrored across multiple domestic data centers to ensure zero interruption in your sync cycles.
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center">
                            <div className="text-5xl font-black text-blue-400 mb-2">99.98%</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Aggregated Uptime (L30D)</div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function ServiceCard({ name, status, uptime }: any) {
    return (
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                    <CheckCircle size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">{name}</h4>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{status}</span>
                </div>
            </div>
            <div className="text-right">
                <div className="text-lg font-black text-slate-950 tracking-tighter">{uptime}</div>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Uptime</div>
            </div>
        </div>
    );
}
