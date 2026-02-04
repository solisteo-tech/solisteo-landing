'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import RequestAccessModal from './RequestAccessModal';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Determine context
    const isSyncBot = pathname.startsWith('/syncbot');
    const isHub = pathname === '/';

    const loginPath = isSyncBot ? '/syncbot/login' : null;

    return (
        <>
            <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3' : 'bg-transparent py-6'
                }`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 bg-blue-100 blur-lg group-hover:bg-blue-200 transition-all rounded-full" />
                            <img
                                src="/solisteo-logo.svg"
                                alt="Solisteo Logo"
                                className="relative w-10 h-10 group-hover:scale-105 transition-transform object-contain"
                            />
                        </div>

                        <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase group-hover:text-blue-600 transition-colors">
                            Solisteo
                        </span>
                        {isSyncBot && <span className="ml-2 text-[10px] font-bold text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full tracking-widest uppercase bg-blue-50">SyncBot</span>}
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        <NavLink href="/" label="Home" active={isHub} />
                        <NavLink href="/syncbot" label="Automation" active={isSyncBot} />
                        <NavLink href="/vision" label="Vision" />
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 rounded-full font-bold text-sm bg-slate-900 text-white hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-2"
                        >
                            GET STARTED
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-slate-900"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="md:hidden absolute top-full inset-x-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-6 font-bold uppercase tracking-widest text-sm text-slate-900 shadow-xl"
                        >
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                            <Link href="/syncbot" onClick={() => setIsMobileMenuOpen(false)}>Automation</Link>
                            <Link href="/vision" onClick={() => setIsMobileMenuOpen(false)}>Vision</Link>
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsModalOpen(true);
                                }}
                                className="text-left text-blue-600 uppercase"
                            >
                                Get Started
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </nav>
            <RequestAccessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all relative group ${active ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
        >
            {label}
            <span className={`absolute -bottom-1 left-0 h-[2px] bg-blue-600 transition-all ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
        </Link>
    );
}
