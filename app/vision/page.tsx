'use client';

import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import RequestAccessModal from '@/components/landing/RequestAccessModal';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Globe, ArrowRight, Zap, Target, Cpu } from 'lucide-react';

export default function VisionPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* Vision Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-50" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            Our Vision
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            THE <span className="text-blue-600 italic">SOLISTEO</span> <br />
                            VISION.
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-500 max-w-4xl mx-auto leading-relaxed font-medium px-4">
                            We're building the future of e-commerce automation for India. Our vision is to empower every seller with <span className="text-blue-600">intelligent tools</span> that scale their business.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-16 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Pillar
                        icon={<Target />}
                        title="Maximum Efficiency"
                        description="Automate repetitive tasks and reduce operational costs through smart inventory synchronization and real-time updates."
                    />
                    <Pillar
                        icon={<Shield />}
                        title="Reliable Data"
                        description="Accurate inventory tracking across all your marketplaces, ensuring you never oversell or miss a sale."
                    />
                    <Pillar
                        icon={<Globe />}
                        title="Built to Scale"
                        description="Infrastructure designed to grow with your business, from startup to enterprise-level operations."
                    />
                </div>
            </section>

            {/* Strategic Roadmap */}
            <section id="roadmap" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                        <div>
                            <div className="text-[12px] font-black tracking-[0.6em] text-blue-600 uppercase mb-3">Roadmap</div>
                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-none">OUR <br /><span className="text-slate-400 italic">JOURNEY.</span></h2>
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs sm:text-sm max-w-xs md:text-right">
                            Building the future of e-commerce automation.
                        </p>
                    </div>

                    <div className="space-y-12">
                        <Milestone year="2026" title="Platform Launch" status="In Progress" detail="Launched core platform with Amazon India and Flipkart integrations for early adopters." />
                        <Milestone year="2026+" title="AI Features" status="In Progress" detail="Introducing smart pricing recommendations and predictive inventory management alongside launch." />
                        <Milestone year="2027" title="Growth Phase" status="Upcoming" detail="Expanding to 500+ sellers and adding ONDC network support across India." />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-12 px-6 bg-white relative">
                <div className="max-w-4xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] bg-slate-950 p-6 sm:p-8 md:p-12 lg:p-16 text-center shadow-3xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                    <div className="relative z-10">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tighter">Ready to grow your business?</h3>
                        <p className="text-white/60 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-medium max-w-xl mx-auto px-4">Join hundreds of Indian sellers who are scaling their e-commerce operations with Solisteo.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-xs rounded-full hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-2xl"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
            <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}

function Pillar({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-[2.5rem] border border-slate-100 bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all group">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon as React.ReactElement, { size: 28, strokeWidth: 2.5 })}
            </div>
            <h4 className="text-xl font-black mb-3 uppercase tracking-tight text-slate-950">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
        </div>
    );
}

function Milestone({ year, title, status, detail }: { year: string, title: string, status: string, detail: string }) {
    return (
        <div className="flex gap-6 sm:gap-8 md:gap-10 group">
            <div className="flex flex-col items-center flex-shrink-0">
                <div className="text-lg sm:text-xl font-black text-blue-600 tracking-tighter">{year}</div>
                <div className="w-px flex-1 bg-slate-100 my-4 sm:my-6 group-last:hidden" />
            </div>
            <div className="pb-12 sm:pb-16">
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-6 mb-3 sm:mb-4">
                    <h4 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tighter">{title}</h4>
                    <span className="px-3 sm:px-4 py-1.5 bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 rounded-full inline-block w-fit">
                        {status}
                    </span>
                </div>
                <p className="text-slate-500 font-medium text-base sm:text-lg max-w-2xl leading-relaxed">{detail}</p>
            </div>
        </div>
    );
}
