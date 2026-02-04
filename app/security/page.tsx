'use client';

import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import RequestAccessModal from '@/components/landing/RequestAccessModal';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileCheck, AlertTriangle, CheckCircle, Zap, ShieldAlert, ArrowRight, Key, UserCheck, Clock } from 'lucide-react';

export default function SecurityPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* Security Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 opacity-50" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            Protocol: Hardened
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            SECURITY <br />
                            <span className="text-blue-600 italic">ARMOR.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                            Deterministic protection for your operational intelligence. We build <span className="text-blue-600">secure infrastructure</span> for Bharat's top brands.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Security Pillars */}
            <section className="py-16 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6">Our Implementation</h2>
                        <h3 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase">SECURITY <br /><span className="text-blue-600 italic">FEATURES.</span></h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <SecurityCard
                            icon={<Key />}
                            title="JWT Authentication"
                            desc="Secure token-based authentication with 1-hour expiration and automatic refresh mechanisms for all API requests."
                        />
                        <SecurityCard
                            icon={<UserCheck />}
                            title="Role-Based Access"
                            desc="Multi-tier permission system with Admin, Seller, Owner, Editor, and Viewer roles enforced at middleware level."
                        />
                        <SecurityCard
                            icon={<ShieldAlert />}
                            title="XSS Protection"
                            desc="Input sanitization across all user-facing forms to prevent cross-site scripting and injection attacks."
                        />
                        <SecurityCard
                            icon={<Lock />}
                            title="Secure Storage"
                            desc="Client-side token storage with timestamp validation and automatic expiration handling via localStorage and cookies."
                        />
                        <SecurityCard
                            icon={<Clock />}
                            title="Rate Limiting"
                            desc="API request throttling with 5 requests per minute limit on pricing endpoints to prevent abuse."
                        />
                        <SecurityCard
                            icon={<Shield />}
                            title="Password Strength"
                            desc="Enforced 12+ character passwords with uppercase, lowercase, numbers, and special characters validation."
                        />
                    </div>
                </div>
            </section>

            {/* Implementation Details */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="text-[12px] font-black tracking-[0.6em] text-blue-600 uppercase mb-6">Technical Stack</div>
                        <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter uppercase leading-tight mb-8">BUILT ON <br /><span className="text-slate-400 italic">PROVEN TECH.</span></h2>
                        <div className="space-y-6 text-slate-500 text-lg font-medium leading-relaxed">
                            <p>
                                Our security infrastructure is built on industry-standard protocols. JWT tokens secure every authenticated request, while middleware-level role validation ensures users only access authorized resources.
                            </p>
                            <p>
                                Input sanitization prevents XSS attacks across all forms. Password validation enforces strong credentials with multi-character-type requirements. Rate limiting protects API endpoints from abuse.
                            </p>
                            <p>
                                Token expiration is managed automatically with 1-hour windows and secure cookie storage using SameSite=Lax policies for CSRF protection.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 blur-[120px] rounded-full opacity-30" />
                        <div className="relative rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-950 p-12">
                            <div className="space-y-4 font-mono text-sm">
                                <div className="text-blue-400">// Authentication Flow</div>
                                <div className="text-slate-300">const token = <span className="text-green-400">getToken()</span>;</div>
                                <div className="text-slate-300">const role = <span className="text-green-400">getUserRole()</span>;</div>
                                <div className="text-slate-300 mt-4">if (<span className="text-yellow-400">!isAuthenticated()</span>) {'{'}</div>
                                <div className="text-slate-300 pl-4">redirect(<span className="text-orange-400">'/login'</span>);</div>
                                <div className="text-slate-300">{'}'}</div>
                                <div className="text-slate-300 mt-4">// Role Validation</div>
                                <div className="text-slate-300">if (role === <span className="text-orange-400">'admin'</span>) {'{'}</div>
                                <div className="text-slate-300 pl-4">allow(<span className="text-orange-400">'/admin/*'</span>);</div>
                                <div className="text-slate-300">{'}'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-8 uppercase tracking-tighter">QUESTIONS ABOUT <br /><span className="text-blue-600 italic">SECURITY?</span></h2>
                    <p className="text-slate-500 text-lg md:text-xl mb-10 font-medium max-w-2xl mx-auto">Our team is ready to discuss your security requirements and implementation details.</p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-16 py-6 bg-slate-950 text-white font-black uppercase tracking-widest rounded-full hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center gap-4 mx-auto text-xs"
                    >
                        CONTACT SECURITY TEAM <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            <Footer />
            <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
}

function SecurityCard({ icon, title, desc }: any) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 border border-blue-50 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
            </div>
            <h4 className="text-lg font-black text-slate-950 uppercase tracking-tighter mb-3">{title}</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{desc}</p>
        </div>
    );
}
