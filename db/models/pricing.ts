// Mock Pricing Model for Landing Page Deployment
// Using static data to avoid Database/Prisma dependency on Vercel

export async function getPricingTiers(product: string = 'syncbot') {
    return [
        { id: 'alpha', name: 'Alpha', price: 39999, interval: 'mo', features: ['Up to 10k SKUs', '15min Sync Cycle', 'Standard Support'], tier: 'alpha' },
        { id: 'sigma', name: 'Sigma', price: 99999, interval: 'mo', features: ['Up to 100k SKUs', '5min Sync Cycle', 'Priority Infrastructure'], tier: 'sigma', isPopular: true },
        { id: 'omega', name: 'Omega', price: 399999, interval: 'mo', features: ['Unlimited SKUs', '14ms Reality Sync', 'Dedicated Account Node'], tier: 'omega' },
    ];
}

export async function getLiveStats() {
    return {
        totalOrders: 12450,
        activeUsers: 450,
        totalRevenue: 98500000,
        totalItems: 45600
    };
}
