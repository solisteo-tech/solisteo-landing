'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { api } from '@/lib/api';
import { Construction, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export default function MaintenanceGuard() {
    const { user } = useAuth();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        checkStatus();
        // Poll every minute
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const checkStatus = async () => {
        // Skip if no backend API is configured
        if (!api.defaults.baseURL) return;

        try {
            setIsChecking(true);
            const res = await api.get('/api/v1/auth/system-status');
            setMaintenanceMode(res.data.maintenance_mode);
        } catch (e) {
            // If check fails, assume not in maintenance to avoid locking everyone out on network error
            console.error('Failed to check system status', e);
        } finally {
            setIsChecking(false);
        }
    };

    // If user is admin, bypass
    if (user?.role === 'admin') return null;

    // Always allow authentication pages so admins can log in
    const publicPaths = ['/login', '/register', '/admin/login', '/forgot-password', '/reset-password'];
    // Check if path starts with public path (to handle /login?redirect=...)
    if (pathname && (pathname === '/' || publicPaths.some(path => pathname.startsWith(path)))) {
        return null;
    }

    if (maintenanceMode) {
        return (
            <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-4 transition-all duration-500 animate-in fade-in">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0))]" />

                <div className="relative z-10 max-w-lg text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-full bg-blue-500/20 blur-xl animate-pulse" />
                            <div className="relative rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-2xl">
                                <Construction className="h-16 w-16 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                            Under Maintenance
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            We're currently upgrading Solisteo to bring you a better experience.
                            The system will be back online shortly.
                        </p>
                    </div>

                    <div className="flex flex-col items-center gap-4 pt-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-full">
                            <Clock className="h-4 w-4" />
                            <span>Estimated duration: ~15 minutes</span>
                        </div>

                        <Button
                            onClick={checkStatus}
                            disabled={isChecking}
                            variant="outline"
                            className="mt-4 gap-2 min-w-[140px]"
                        >
                            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                            {isChecking ? 'Checking...' : 'Check Status'}
                        </Button>
                    </div>
                </div>

                <div className="absolute bottom-8 text-center text-sm text-slate-400">
                    <p>© 2025 Solisteo Analytics. All rights reserved.</p>
                </div>
            </div>
        );
    }

    return null;
}
