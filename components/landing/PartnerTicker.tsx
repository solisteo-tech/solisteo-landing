'use client';

import { motion } from 'framer-motion';

const LOGOS = [
    { src: '/images/homepage/logo_amazon.svg', alt: 'Amazon', comingSoon: false },
    { src: '/images/homepage/logo_flipkart.svg', alt: 'Flipkart', comingSoon: true },
    { src: '/images/homepage/logo_shopify.svg', alt: 'Shopify', comingSoon: true },
];

export default function PartnerTicker() {
    return (
        <div className="py-8 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
                        Unified Marketplace Integration
                    </span>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                    {LOGOS.map((logo, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="relative px-8 py-4 bg-white rounded-[2rem] border border-slate-100 flex items-center justify-center hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all group"
                        >
                            {logo.comingSoon && (
                                <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest z-20 shadow-lg shadow-blue-100">
                                    SOON
                                </div>
                            )}
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className={`h-6 md:h-8 w-auto object-contain transition-all duration-500 group-hover:scale-110 ${logo.comingSoon ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-100'}`}
                            />
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
}
