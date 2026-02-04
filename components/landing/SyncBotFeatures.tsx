'use client';

import { motion } from 'framer-motion';
import {
    Zap,
    BarChart3,
    Globe2,
    Bell,
    Package,
    FileText,
    MessageCircle,
    Users,
    Activity,
    MapPin,
    Target,
    ShieldCheck,
    LayoutDashboard,
    Search
} from 'lucide-react';

export default function SyncBotFeatures() {
    return (
        <section className="py-24 px-6 bg-white overflow-hidden relative">
            {/* Background Branding Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] md:text-[25rem] font-black text-slate-50 select-none pointer-events-none tracking-tighter uppercase opacity-30">
                SYNC
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-32 items-center mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="text-[12px] font-black tracking-[0.4em] text-blue-600 uppercase mb-6">Precision Engineering</div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter mb-10 uppercase leading-none">REAL-TIME <br /><span className="text-blue-600 italic">LOGIC.</span></h2>
                        <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium max-w-md mb-12">
                            Our proprietary engine updates your inventory across all Indian marketplaces in under 14ms. Engineering excellence meets domestic market dominance.
                        </p>

                        <div className="space-y-6">
                            <FeaturePoint icon={<Zap size={22} />} text="Instant Buy-Box Reclamation" />
                            <FeaturePoint icon={<Globe2 size={22} />} text="Pan-India Inventory Mirroring" />
                            <FeaturePoint icon={<Bell size={22} />} text="Predictive Stock Prevention" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative aspect-square"
                    >
                        <div className="absolute inset-0 bg-blue-100 blur-[120px] rounded-full opacity-40" />
                        <div className="relative h-full w-full bg-white border border-slate-100 rounded-[3rem] p-4 flex flex-col justify-center items-center overflow-hidden shadow-2xl shadow-blue-100 group">
                            <motion.img
                                src="/images/homepage/product_dashboard_premium.png"
                                alt="SyncBot Integration"
                                className="w-full h-full object-cover rounded-[2.5rem] group-hover:scale-110 transition-transform duration-1000 ease-out"
                            />
                            <div className="absolute inset-x-10 bottom-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-10 group-hover:translate-y-0">
                                <span className="text-blue-600 font-black uppercase tracking-widest text-xs">Reality Sync Mesh v2.0</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 13 Feature Grid */}
                <div className="text-center mb-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Autonomous Core Modules</span>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter mt-4 uppercase">The Intelligence Mesh</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <GraphicCard
                        icon={<BarChart3 size={24} />}
                        title="Sales Monitoring"
                        desc="Real-time GMV tracking and growth analysis across Bharat's marketplaces."
                        delay={0.1}
                    />
                    <GraphicCard
                        icon={<Package size={24} />}
                        title="Inventory Control"
                        desc="Predictive stock prevention and Pan-India inventory mirroring."
                        delay={0.15}
                    />
                    <GraphicCard
                        icon={<FileText size={24} />}
                        title="Insight Reports"
                        desc="Automated performance summaries and daily run-rate monitoring."
                        delay={0.2}
                    />
                    <GraphicCard
                        icon={<Bell size={24} />}
                        title="Anomaly Alerts"
                        desc="Critical surge/drop detection and business health notifications."
                        delay={0.25}
                    />
                    <GraphicCard
                        icon={<MessageCircle size={24} />}
                        title="WhatsApp Sync"
                        desc="Real-time notification streaming via India's primary support channel."
                        delay={0.3}
                    />
                    <GraphicCard
                        icon={<Users size={24} />}
                        title="Team Access"
                        desc="Multi-user role-based permissions for collaborative management."
                        delay={0.35}
                    />
                    <GraphicCard
                        icon={<Zap size={24} />}
                        title="Proprietary API"
                        desc="High-performance architecture exceeding standard Indian API limits."
                        delay={0.4}
                    />
                    <GraphicCard
                        icon={<Activity size={24} />}
                        title="Listing Health"
                        desc="24/7 automated monitoring of Buy Box status and suppressed listings."
                        delay={0.45}
                    />
                    <GraphicCard
                        icon={<MapPin size={24} />}
                        title="Geo Segmentation"
                        desc="Pincode-level performance breakdown and regional demand isolation."
                        delay={0.5}
                    />
                    <GraphicCard
                        icon={<Target size={24} />}
                        title="Ads Hub Analysis"
                        desc="Amazon PPC optimization with real-time ACOS and ROAS tracking."
                        delay={0.55}
                    />
                    <GraphicCard
                        icon={<ShieldCheck size={24} />}
                        title="Shield Protection"
                        desc="SPF claim automation and FBA consignment reconciliation."
                        delay={0.6}
                    />
                    <GraphicCard
                        icon={<LayoutDashboard size={24} />}
                        title="Custom Dash"
                        desc="Personalized operations monitor tailoring metrics to your business."
                        delay={0.65}
                    />
                    <GraphicCard
                        icon={<Search size={24} />}
                        title="Market Research"
                        desc="Competitor intelligence and price war tracking for market dominance."
                        delay={0.7}
                    />
                </div>
            </div>
        </section>
    );
}

function FeaturePoint({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-5 text-slate-700 font-bold uppercase tracking-tight text-sm"
        >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                {icon}
            </div>
            {text}
        </motion.div>
    );
}

function GraphicCard({ icon, title, desc, delay, imageSrc }: { icon: React.ReactNode, title: string, desc: string, delay: number, imageSrc?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300 flex flex-col group min-h-[220px]"
        >
            {imageSrc && (
                <div className="relative h-40 mb-6 rounded-[1.5rem] overflow-hidden border border-slate-200 bg-white">
                    <img src={imageSrc} alt={title} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-30" />
                </div>
            )}

            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-6 border border-slate-100 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {icon}
            </div>

            <h4 className="text-lg font-black text-slate-950 mb-3 tracking-tight uppercase group-hover:text-blue-600 transition-colors line-clamp-1">{title}</h4>
            <p className="text-slate-500 text-[10px] leading-relaxed font-bold uppercase tracking-wider">{desc}</p>
        </motion.div>
    );
}

