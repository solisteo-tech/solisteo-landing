'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function RequestAccessModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - Separate fixed element for maximum coverage */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[998] cursor-pointer"
                    />

                    {/* Modal Container - Centering wrapper */}
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-900/40 max-h-[90vh] overflow-y-auto scrollbar-hide pointer-events-auto"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors z-20 p-2 hover:bg-slate-50 rounded-full"
                            >
                                <X size={24} />
                            </button>

                            <div className="p-10 md:p-14 text-center relative z-10">
                                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6 font-space">Partner Engagement</div>
                                <h3 className="text-4xl font-black text-slate-950 tracking-tighter mb-8 uppercase leading-none font-space-grotesk">Initialize <br /><span className="text-blue-600 italic">ONBOARDING.</span></h3>

                                <p className="text-slate-500 text-sm mb-12 leading-relaxed font-medium">
                                    Solisteo is currently in high-velocity Private Beta. To ensure perfect alignment with your enterprise goals, please reach out to our team directly.
                                </p>

                                <div className="space-y-4 mb-12">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Direct Transmission Node</div>
                                    <a
                                        href="mailto:solisteo.tech@gmail.com"
                                        className="block w-full py-8 bg-blue-50 border border-blue-100 rounded-[2rem] text-2xl md:text-3xl font-black text-blue-600 hover:border-blue-200 hover:bg-blue-100 transition-all tracking-tighter shadow-sm"
                                    >
                                        solisteo.tech@gmail.com
                                    </a>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-center gap-4 text-slate-950 font-bold uppercase tracking-widest text-[10px]">
                                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                        Active Priority Support
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
