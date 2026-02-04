'use client';

import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, MessageSquare, ArrowRight } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />

            {/* Contact Hero */}
            <section className="pt-32 pb-12 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                            Connect with us
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter text-slate-950 uppercase leading-[0.85]">
                            GET IN <br />
                            <span className="text-blue-600 italic">TOUCH.</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-medium">
                            Connect with our engineering and support team across India. We're here to help you scale.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Metrics */}
            <section className="py-16 px-6 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContactItem
                        icon={<Mail />}
                        title="Email Support"
                        value="solisteo.tech@gmail.com"
                        detail="General & Enterprise Inquiries"
                    />
                    <ContactItem
                        icon={<Phone />}
                        title="Phone Support"
                        value="+91 80 4567 8900"
                        detail="Business Hours: 9 AM - 6 PM IST"
                    />
                    <ContactItem
                        icon={<MapPin />}
                        title="Office Location"
                        value="Bengaluru, KA"
                        detail="HSR Layout, Karnataka, India"
                    />
                </div>
            </section>

            {/* Form Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <div className="text-[12px] font-black tracking-[0.6em] text-blue-600 uppercase mb-3">Contact Form</div>
                            <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter uppercase leading-tight mb-6">SEND US A <br /><span className="text-slate-400 italic">MESSAGE.</span></h2>
                            <p className="text-slate-500 font-medium mb-8">
                                Share your business details below and our team will respond within one business day.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 text-slate-950 font-bold uppercase tracking-widest text-xs">
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    Fast Response Time
                                </div>
                                <div className="flex items-center gap-4 text-slate-950 font-bold uppercase tracking-widest text-xs">
                                    <div className="w-2 h-2 rounded-full bg-blue-200" />
                                    24/7 Support Availability
                                </div>
                            </div>
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Name</label>
                                <input type="text" placeholder="Full name" className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                                <input type="email" placeholder="Work email address" className="w-full p-5 bg-white border border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                                <textarea placeholder="Tell us about your business needs..." className="w-full h-40 p-5 bg-white border border-slate-100 rounded-2xl focus:border-blue-600 outline-none transition-all font-bold text-sm resize-none"></textarea>
                            </div>
                            <button className="w-full py-6 bg-slate-950 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-2xl shadow-blue-100 flex items-center justify-center gap-4 text-xs">
                                SEND MESSAGE <ArrowRight size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function ContactItem({ icon, title, value, detail }: { icon: React.ReactNode, title: string, value: string, detail: string }) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
            </div>
            <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">{title}</div>
            <div className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tighter mb-3">{value}</div>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{detail}</div>
        </div>
    );
}
