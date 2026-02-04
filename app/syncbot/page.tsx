import { Metadata } from 'next';
import Navbar from '@/components/landing/Navbar';
import SyncBotHero from '@/components/landing/SyncBotHero';
import PartnerTicker from '@/components/landing/PartnerTicker';
import StatsTicker from '@/components/landing/StatsTicker';
import SyncBotFeatures from '@/components/landing/SyncBotFeatures';
import PricingSection from '@/components/landing/PricingSection';
import Footer from '@/components/landing/Footer';
import MeshBackground from '@/components/landing/MeshBackground';
import { getLiveStats, getPricingTiers } from '@/db/models/pricing';

export const metadata: Metadata = {
    title: 'SyncBot | Elite E-commerce Intelligence',
    description: 'The autonomous engine for Bharat\'s e-commerce. Real-time listing health, buy-box dominance, and deep-reality inventory sync for the Indian market.',
};

export default async function SyncBotPage() {
    const stats = await getLiveStats();
    const pricingTiers = await getPricingTiers('syncbot');

    return (
        <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100 overflow-x-hidden">
            <Navbar />
            <SyncBotHero />
            <PartnerTicker />
            <StatsTicker stats={stats} />
            <SyncBotFeatures />
            <PricingSection tiers={pricingTiers} />
            <Footer />
        </main>
    );
}
