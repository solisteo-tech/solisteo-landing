'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, TrendingUp, Lightbulb, Target, ArrowRight } from 'lucide-react';

const POSITIONS = [
    {
        id: 'fullstack-eng-001',
        title: 'Senior Full-Stack Engineer',
        department: 'Engineering',
        location: 'Bengaluru, India',
        type: 'Full-time',
        description: 'Build scalable features for our multi-platform analytics platform using Next.js, FastAPI, and PostgreSQL.'
    },
    {
        id: 'prod-designer-001',
        title: 'Product Designer',
        department: 'Design',
        location: 'Remote / Hybrid',
        type: 'Full-time',
        description: 'Create beautiful, intuitive experiences for e-commerce sellers managing complex data across platforms.'
    },
    {
        id: 'csm-001',
        title: 'Customer Success Manager',
        department: 'Customer Success',
        location: 'Bengaluru, India',
        type: 'Full-time',
        description: 'Help our customers succeed by providing exceptional support and driving product adoption in the Indian marketplace.'
    }
];

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* Careers Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 opacity-50" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            Careers
                        </div>
                        <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            BUILD THE <br />
                            <span className="text-blue-600 italic">FUTURE.</span>
                        </h1>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-500 max-w-4xl mx-auto leading-relaxed font-medium px-4">
                            Join our team of talented people building <span className="text-blue-600">India's e-commerce future.</span>
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Why Join */}
            <section className="py-32 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <BenefitCard
                            icon={<TrendingUp />}
                            title="Exponential Growth"
                            description="Work in a high-velocity startup environment where your impact is immediate and your growth is prioritized."
                        />
                        <BenefitCard
                            icon={<Lightbulb />}
                            title="Hard Problems"
                            description="Solve complex synchronization and data integrity challenges at a national scale."
                        />
                        <BenefitCard
                            icon={<Target />}
                            title="Direct Impact"
                            description="Every line of code you write helps thousands of Indian sellers reclaim their multi-platform efficiency."
                        />
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-40 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-20">
                        <h2 className="text-[12px] font-black tracking-[0.6em] text-blue-600 uppercase mb-4">Open Roles</h2>
                        <h3 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase">JOIN THE <br /><span className="text-slate-400 italic">ENGINE.</span></h3>
                    </div>

                    <div className="space-y-6">
                        {POSITIONS.map((pos) => (
                            <JobCard key={pos.id} {...pos} />
                        ))}
                    </div>

                    <div className="mt-24 p-12 rounded-[3rem] bg-slate-950 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                        <h4 className="text-3xl font-black text-white mb-6 uppercase tracking-tight">Don't see your role?</h4>
                        <p className="text-white/60 font-medium mb-10">We're always looking for exceptional talent. Send us your portfolio or CV.</p>
                        <a href="mailto:solisteo.tech@gmail.com" className="inline-flex items-center gap-4 px-10 py-4 bg-white text-slate-950 font-black uppercase tracking-widest rounded-full hover:bg-blue-600 hover:text-white transition-all">
                            General Application <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-8">
                {React.cloneElement(icon as React.ReactElement, { size: 28, strokeWidth: 2.5 })}
            </div>
            <h4 className="text-xl font-black text-slate-950 mb-4 uppercase tracking-tight">{title}</h4>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">{description}</p>
        </div>
    );
}

function JobCard({ title, department, location, type, description }: any) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group">
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{department}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{type}</span>
                </div>
                <h4 className="text-2xl font-black text-slate-950 uppercase tracking-tight mb-4 group-hover:text-blue-600 transition-colors">{title}</h4>
                <div className="flex items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2"><MapPin size={14} /> {location}</div>
                </div>
            </div>
            <button className="px-8 py-4 bg-slate-950 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all active:scale-95 text-xs">
                Apply ROLE
            </button>
        </div>
    );
}
