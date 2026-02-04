import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function SupportHeader() {
    return (
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 md:p-12 mb-8 text-center space-y-4 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                How can we help you?
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base">
                Browse our documentation or submit a ticket for personalized assistance.
            </p>
            <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search help articles..."
                    className="pl-10 h-11 bg-white shadow-sm border-slate-200 focus-visible:ring-slate-900 transition-all rounded-full"
                />
            </div>
        </div>
    );
}
