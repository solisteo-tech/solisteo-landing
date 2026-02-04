'use client';

import { ReactNode } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

export interface ConnectionStatusData {
    status: 'connected' | 'error' | null;
    message: string;
}

interface IntegrationCardProps {
    title: string;
    description: string;
    isEnabled: boolean;
    onToggle: (v: boolean) => void;
    onTest: () => void;
    isTesting: boolean;
    connectionStatus?: ConnectionStatusData;
    children?: ReactNode;
}

export default function IntegrationCard({
    title,
    description,
    isEnabled,
    onToggle,
    onTest,
    isTesting,
    connectionStatus,
    children
}: IntegrationCardProps) {
    return (
        <div className="space-y-4 p-5 rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-gray-300">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base text-gray-900 font-semibold">{title}</Label>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Switch checked={isEnabled} onCheckedChange={onToggle} />
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onTest}
                        disabled={!isEnabled || isTesting}
                        className="h-8 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className={`mr-2 h-3.5 w-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                        {isTesting ? 'Testing…' : 'Test Connection'}
                    </Button>
                </div>
            </div>

            {connectionStatus && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                    {connectionStatus.status === 'connected' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-1">
                            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Connected
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-2 py-1">
                            <XCircle className="mr-1.5 h-3.5 w-3.5" /> {connectionStatus.message}
                        </Badge>
                    )}
                </div>
            )}

            {isEnabled && children && (
                <div className="grid gap-6 md:grid-cols-3 pt-4 border-t border-gray-100 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {children}
                </div>
            )}
        </div>
    );
}
