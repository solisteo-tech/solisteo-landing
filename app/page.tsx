import { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import BentoGrid from '@/components/landing/BentoGrid';
import Footer from '@/components/landing/Footer';
import MeshBackground from '@/components/landing/MeshBackground';

export const metadata: Metadata = {
  title: 'Solisteo | India\'s Premier E-commerce Automation',
  description: 'Building the next generation of autonomous engines for India\'s rapidly evolving e-commerce landscape.',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      <Navbar />
      <Hero />
      <BentoGrid />
      <Footer />
    </main>
  );
}

