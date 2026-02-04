'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* Terms Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            Legal
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            TERMS OF <br />
                            <span className="text-blue-600 italic">SERVICE.</span>
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 px-6 border-y border-slate-100 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-12">
                        <TermsSection
                            index="01"
                            title="Service Access"
                            content="By using Solisteo, you agree to these terms of service. Our platform is designed for e-commerce sellers operating on Indian marketplaces including Amazon India, Flipkart, and ONDC. Access is granted subject to account approval and payment of applicable fees."
                        />
                        <TermsSection
                            index="02"
                            title="User Responsibilities"
                            content="You are responsible for maintaining the security of your account credentials and marketplace API keys. You must not share your account access with unauthorized users or attempt to reverse-engineer our platform."
                        />
                        <TermsSection
                            index="03"
                            title="Service Availability"
                            content="We strive to maintain high service availability but cannot guarantee uninterrupted access. Scheduled maintenance will be communicated in advance. We are not liable for issues caused by third-party marketplace API downtime or internet connectivity problems."
                        />
                        <TermsSection
                            index="04"
                            title="Termination"
                            content="Either party may terminate service with 30 days notice. Upon termination, you retain the right to export your data. We reserve the right to suspend accounts that violate these terms or engage in fraudulent activity."
                        />
                    </div>

                    <div className="mt-16 p-10 bg-white border border-slate-100 rounded-[2.5rem] text-center shadow-xl shadow-slate-200/50">
                        <h4 className="text-xl font-black text-slate-950 uppercase tracking-tight mb-3">Legal Questions?</h4>
                        <p className="text-slate-500 font-medium mb-6">Contact us for any questions about our terms of service.</p>
                        <a href="mailto:solisteo.tech@gmail.com" className="px-10 py-5 bg-slate-950 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-blue-600 transition-all inline-block">
                            solisteo.tech@gmail.com
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function TermsSection({ index, title, content }: { index: string, title: string, content: string }) {
    return (
        <section>
            <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-black text-blue-600 tracking-widest">{index}</span>
                <div className="h-px flex-1 bg-slate-200" />
            </div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase mb-4">{title}</h2>
            <p className="text-slate-500 leading-relaxed font-medium text-lg">
                {content}
            </p>
        </section>
    );
}
