import { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Footer from '@/components/landing/Footer';
import MeshBackground from '@/components/landing/MeshBackground';
import PartnerTicker from '@/components/landing/PartnerTicker';
import StatsTicker from '@/components/landing/StatsTicker';
import SyncBotFeatures from '@/components/landing/SyncBotFeatures';
import PricingSection from '@/components/landing/PricingSection';
import { getLiveStats, getPricingTiers } from '@/db/models/pricing';

export const metadata: Metadata = {
  title: 'Solisteo | India\'s Premier E-commerce Automation',
  description: 'Building the next generation of autonomous engines for India\'s rapidly evolving e-commerce landscape.',
};

export default async function Home() {
  const stats = await getLiveStats();
  const pricingTiers = await getPricingTiers('syncbot');

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      <Navbar />
      <Hero />
      <PartnerTicker />
      <StatsTicker stats={stats} />
      <SyncBotFeatures />
      <PricingSection tiers={pricingTiers} />
      <Footer />
    </main>
  );
}

