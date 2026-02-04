'use client';

import { motion } from 'framer-motion';
import { Check, Shield, Zap, Globe, Lock } from 'lucide-react';

interface PricingTier {
    id: string;
    name: string;
    price: number;
    interval: string;
    features: string[];
    tier: string;
    isPopular?: boolean;
}

interface PricingSectionProps {
    tiers: PricingTier[];
}

export default function PricingSection({ tiers }: PricingSectionProps) {
    return (
        <section className="py-16 px-6 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-blue-100/50 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-cyan-100/30 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6 block">Scalable Infrastructure</span>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter mb-8 uppercase leading-none">THE COST OF <br /><span className="text-blue-600 italic">DOMINANCE.</span></h2>
                        <p className="text-slate-500 max-w-2xl mx-auto text-lg md:text-xl font-medium">Choose the performance tier that matches your domestic inventory demands and scaling velocity.</p>
                    </motion.div>
                </div>

                {/* Coming Soon Placeholder */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="relative flex flex-col items-center justify-center p-16 rounded-[3rem] border-2 border-dashed border-slate-200 bg-white/60 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-[3rem]" />
                        <div className="relative z-10 text-center space-y-4">
                            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                                <Lock className="h-10 w-10 text-slate-400" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Pricing Tiers</h3>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Coming Soon</p>
                            <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                                Enterprise-grade performance nodes are being calibrated. Contact our team for early access and custom infrastructure.
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Custom enterprise nodes available. <span className="text-blue-600 cursor-pointer hover:underline">Contact Sales</span></p>
                </div>
            </div>
        </section>
    );
}

function PricingCard({ tier, delay }: { tier: PricingTier; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            whileHover={{ y: -10 }}
            className={`relative flex flex-col p-12 rounded-[3.5rem] border-2 transition-all duration-500 group overflow-hidden ${tier.isPopular ? 'border-blue-600 bg-white shadow-2xl shadow-blue-100' : 'border-slate-100 bg-white/60 hover:bg-white hover:border-slate-200 shadow-sm hover:shadow-xl'}`}
        >
            {tier.isPopular && (
                <div className="absolute top-8 right-8 bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-100">
                    RECOMMENDED
                </div>
            )}

            <div className="mb-12">
                <h3 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${tier.isPopular ? 'text-blue-600' : 'text-slate-400'}`}>{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black text-slate-950 tracking-tighter leading-none">₹{tier.price.toLocaleString('en-IN')}</span>
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">/mo</span>
                </div>
            </div>

            <div className="space-y-6 mb-12 flex-grow">
                {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 group/feat">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${tier.isPopular ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'} transition-transform group-hover/feat:scale-110`}>
                            <Check size={14} strokeWidth={4} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 group-hover/feat:text-slate-950 transition-colors uppercase tracking-tight">{feature}</span>
                    </div>
                ))}
            </div>

            <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-95 ${tier.isPopular ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700' : 'bg-slate-950 text-white hover:bg-blue-600 shadow-lg shadow-blue-50'}`}>
                Deploy Node
            </button>
        </motion.div>
    );
}
