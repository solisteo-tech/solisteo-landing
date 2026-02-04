'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { Book, Zap, Shield, ArrowRight } from 'lucide-react';

const SECTIONS = [
    {
        title: 'Getting Started',
        icon: <Zap />,
        items: [
            { name: 'Account Setup', href: '#' },
            { name: 'Connecting Marketplaces', href: '#' },
            { name: 'First Sync', href: '#' },
        ]
    },
    {
        title: 'Platform Guides',
        icon: <Book />,
        items: [
            { name: 'Sales Dashboard', href: '#' },
            { name: 'Inventory Management', href: '#' },
            { name: 'Listing Health', href: '#' },
        ]
    },
    {
        title: 'Integrations',
        icon: <Book />,
        items: [
            { name: 'Amazon India', href: '#' },
            { name: 'Flipkart', href: '#' },
            { name: 'ONDC Network', href: '#' },
        ]
    },
    {
        title: 'Support',
        icon: <Shield />,
        items: [
            { name: 'FAQs', href: '#' },
            { name: 'Troubleshooting', href: '#' },
            { name: 'Contact Support', href: '#' },
        ]
    }
];

export default function DocsPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* Docs Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            Knowledge Base
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            HELP <br />
                            <span className="text-blue-600 italic">CENTER.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                            Comprehensive guides to help you get the most out of <span className="text-blue-600">Solisteo.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Doc Grid */}
            <section className="py-16 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SECTIONS.map((section, idx) => (
                        <div key={idx} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                                {React.cloneElement(section.icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
                            </div>
                            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight mb-6">{section.title}</h3>
                            <div className="space-y-4">
                                {section.items.map((item, i) => (
                                    <a key={i} href={item.href} className="flex items-center justify-between text-slate-500 hover:text-blue-600 font-bold uppercase tracking-widest text-[10px] transition-colors group/link">
                                        {item.name}
                                        <ArrowRight size={14} className="opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
