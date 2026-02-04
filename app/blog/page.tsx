'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const POSTS = [
    {
        title: 'Winning Flash Sales on Multiple Platforms',
        excerpt: 'How Indian brands are using automation to capture flash-sale opportunities across Amazon, Flipkart, and ONDC simultaneously.',
        date: 'Dec 12, 2024',
        category: 'Strategy',
        readTime: '6 min',
        slug: 'winning-flash-sales'
    },
    {
        title: 'Real-Time Inventory Sync Explained',
        excerpt: 'Understanding the technology behind keeping your inventory accurate across multiple marketplaces in real-time.',
        date: 'Dec 08, 2024',
        category: 'Technology',
        readTime: '10 min',
        slug: 'inventory-sync-explained'
    },
    {
        title: 'Scaling Your D2C Brand',
        excerpt: 'Infrastructure and automation strategies for high-growth direct-to-consumer brands in India.',
        date: 'Dec 05, 2024',
        category: 'Growth',
        readTime: '8 min',
        slug: 'scaling-d2c-brands'
    }
];

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* Blog Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            Blog
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            INSIGHTS & <br />
                            <span className="text-blue-600 italic">UPDATES.</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-500 max-w-3xl leading-relaxed font-medium px-4">
                            Expert insights on e-commerce automation, marketplace strategies, and growing your business in India.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-16 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {POSTS.map((post, idx) => (
                        <Link key={idx} href={`/blog/${post.slug}`} className="group">
                            <article className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{post.category}</span>
                                    <div className="flex items-center gap-2 text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                                        <Clock size={12} /> {post.readTime} read
                                    </div>
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tighter mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8 flex-grow">{post.excerpt}</p>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                                    <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white group-hover:bg-blue-600 transition-colors">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto p-8 sm:p-12 md:p-16 lg:p-20 rounded-[2.5rem] sm:rounded-[3rem] lg:rounded-[4rem] bg-slate-950 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-600 opacity-5" />
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tighter">Stay Updated.</h3>
                    <p className="text-white/40 font-medium mb-8 sm:mb-12 text-sm sm:text-base px-4">Get weekly insights on e-commerce trends and platform updates.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input type="email" placeholder="Your email" className="flex-1 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-600 transition-all font-bold text-sm" />
                        <button className="px-8 sm:px-10 py-4 sm:py-5 bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-blue-600 hover:text-white transition-all">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
