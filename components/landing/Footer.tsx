'use client';

import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-100 pt-12 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="group inline-block mb-6">
                            <div className="relative w-12 h-12 flex items-center justify-center mb-4">
                                <div className="absolute inset-0 bg-blue-50 blur-xl group-hover:bg-blue-100 transition-all rounded-full" />
                                <img
                                    src="/solisteo-logo.svg"
                                    alt="Solisteo Logo"
                                    className="relative w-12 h-12 group-hover:scale-105 transition-transform object-contain"
                                />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-slate-950 uppercase group-hover:text-blue-600 transition-colors block">
                                Solisteo
                            </span>
                        </Link>
                        <p className="text-slate-400 text-xs leading-relaxed font-bold uppercase tracking-tight max-w-xs">
                            Autonomous infrastructure for domestic scale. Pioneering Bharat's e-commerce engine integration.
                        </p>
                    </div>

                    {/* Column 2: Platform */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Platform</h4>
                        <div className="flex flex-col gap-3">
                            <FooterLink href="/" label="Home" />
                            <FooterLink href="/vision" label="Vision" />
                        </div>
                    </div>

                    {/* Column 3: Company */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Company</h4>
                        <div className="flex flex-col gap-3">
                            <FooterLink href="/about" label="About Us" />
                            <FooterLink href="/careers" label="Careers" />
                            <FooterLink href="/blog" label="Blog" />
                            <FooterLink href="/security" label="Security" />
                            <FooterLink href="/contact" label="Contact" />
                        </div>
                    </div>

                    {/* Column 4: Resources */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Resources</h4>
                        <div className="flex flex-col gap-3">
                            <FooterLink href="/docs" label="Documentation" />
                        </div>
                    </div>

                    {/* Column 5: Legal */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Legal</h4>
                        <div className="flex flex-col gap-3">
                            <FooterLink href="/privacy" label="Privacy Policy" />
                            <FooterLink href="/terms" label="Terms & Conditions" />
                        </div>
                    </div>
                </div>

                {/* Corporate Detail */}
                <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 border-t border-slate-100 pt-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-4">
                        <span>© {currentYear} Solisteo Tech Private Limited</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span>All Rights Reserved</span>
                    </div>
                    <div className="flex gap-12">
                        <span className="text-slate-300">Bengaluru · India</span>
                        <span className="text-blue-600">Enterprise Certified</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, label }: { href: string, label: string }) {
    return (
        <Link href={href} className="text-slate-500 hover:text-blue-600 transition-colors duration-300 text-[11px] font-bold uppercase tracking-widest">
            {label}
        </Link>
    );
}
