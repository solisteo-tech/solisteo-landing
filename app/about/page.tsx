'use client';

import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import RequestAccessModal from '@/components/landing/RequestAccessModal';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Shield, ArrowRight, BarChart3, Package, Activity, MessageCircle } from 'lucide-react';

export default function AboutPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* About Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            Our Origins
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            WE ARE <br />
                            <span className="text-blue-600 italic">SOLISTEO.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-slate-500 max-w-4xl mx-auto leading-relaxed font-medium">
                            Engineering the future of autonomous commerce for Bharat's most ambitious brands. We build the <span className="text-blue-600">algorithmic backbone</span> of modern retail.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-16 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Our Core</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase">THE VALUES THAT <br /><span className="text-blue-600 italic">DRIVE US.</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ValueCard
                            icon={<Users />}
                            title="Seller First"
                            description="We engineer based on real friction, ensuring every feature drives measurable growth for domestic brands."
                        />
                        <ValueCard
                            icon={<Zap />}
                            title="Velocity"
                            description="In a 14ms world, speed isn't a feature—it's the foundation of every engine we deploy."
                        />
                        <ValueCard
                            icon={<Shield />}
                            title="Integrity"
                            description="Enterprise-grade data protection and deterministic accuracy in every inventory sync node."
                        />
                        <ValueCard
                            icon={<Target />}
                            title="Precision"
                            description="Eliminating manual error through algorithmic automation and predictive infrastructure."
                        />
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="text-[12px] font-black tracking-[0.6em] text-blue-600 uppercase mb-6">The Journey</div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-tight mb-8">BORN FROM <br /><span className="text-slate-400 italic">FRICTION.</span></h2>
                        <div className="space-y-6 text-slate-500 text-lg font-medium leading-relaxed">
                            <p>
                                Solisteo emerged from a simple realization: the tools governing Bharat's e-commerce landscape were built for a slower era. Marketplace sellers were trapped between disconnected dashboards, manual inventory updates, and delayed insights.
                            </p>
                            <p>
                                We built a different kind of infrastructure. One that doesn't just display data, but acts on it with sub-millisecond precision. Real-time GMV tracking, automated listing health monitoring, WhatsApp-native alerts, and pincode-level segmentation—all running on a proprietary API that exceeds standard marketplace limits by 400%.
                            </p>
                            <p>
                                Today, Solisteo powers high-volume sellers across Amazon.in, Flipkart, and the ONDC ecosystem with 13 autonomous modules: Sales Monitoring, Inventory Control, Insight Reports, Anomaly Alerts, WhatsApp Sync, Team Access, Listing Health, Geo Segmentation, Ads Hub Analysis, Shield Protection, Custom Dashboards, and Market Research.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 blur-[120px] rounded-full opacity-30" />
                        <div className="relative rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl">
                            <img src="/images/homepage/feature_intelligence.png" alt="Engineering Solisteo" className="w-full h-auto" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Platform Capabilities */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6">What We Built</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase">THE INTELLIGENCE <br /><span className="text-blue-600 italic">MESH.</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <CapabilityCard
                            icon={<BarChart3 />}
                            title="Sales Monitoring"
                            description="Real-time GMV tracking and growth analysis across all Indian marketplaces."
                        />
                        <CapabilityCard
                            icon={<Package />}
                            title="Inventory Control"
                            description="Predictive stock prevention with Pan-India inventory mirroring in 14ms."
                        />
                        <CapabilityCard
                            icon={<Activity />}
                            title="Listing Health"
                            description="24/7 automated monitoring of Buy Box status and suppressed listings."
                        />
                        <CapabilityCard
                            icon={<MessageCircle />}
                            title="WhatsApp Sync"
                            description="Real-time notification streaming via India's primary communication channel."
                        />
                    </div>
                </div>
            </section>

            {/* Reach Out CTA */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-8 uppercase tracking-tighter">PARTNER WITH THE <br /><span className="text-blue-600 italic">BEST.</span></h2>
                    <p className="text-slate-500 text-lg md:text-xl mb-10 font-medium max-w-2xl mx-auto">Join the movement to automate Bharat's e-commerce economy. Let's engineer your growth together.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-16 py-6 bg-slate-950 text-white font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center gap-4 mx-auto"
                    >
                        GET IN TOUCH <ArrowRight size={20} />
                    </button>
                </div>
            </section>

            <Footer />
            <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
            </div>
            <h4 className="text-lg font-black text-slate-950 mb-3 uppercase tracking-tight">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
        </div>
    );
}

function CapabilityCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
            </div>
            <h4 className="text-lg font-black text-slate-950 mb-3 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed font-bold uppercase tracking-wider">{description}</p>
        </div>
    );
}
