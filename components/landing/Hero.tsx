'use client';

import { motion } from 'framer-motion';
import CrystalS from './CrystalS';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-12 px-6 overflow-hidden bg-white text-slate-900">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/50 to-transparent" />
                <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-600/50 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-50 rounded-full blur-[120px] -z-10" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
                {/* The 3D S Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="mb-8"
                >
                    <CrystalS />
                </motion.div>

                {/* Text Group */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black tracking-[0.4em] uppercase mb-4"
                    >
                        Pioneering E-Commerce Automation
                    </motion.div>

                    <motion.h2
                        className="text-5xl md:text-7xl lg:text-[100px] font-black text-slate-950 leading-[0.95] tracking-tighter"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                    >
                        THE FUTURE <br />
                        <span className="text-blue-600 italic">OF</span> COMMERCE.
                    </motion.h2>

                    <motion.p
                        className="text-lg md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium px-4 pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        Solisteo builds intelligent autonomous engines that streamline Pan-India operations, maximize efficiency, and scale your brand across India's leading marketplaces with enterprise-grade automation.
                    </motion.p>


                </div>
            </div>
        </section>
    );
}

