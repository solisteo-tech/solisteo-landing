
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Clock, Settings, CreditCard, Bug, Sparkles, Database, LayoutDashboard, FileText } from 'lucide-react';
import { Ticket } from '@/lib/types/support';
import { supportAPI } from '@/lib/api';

interface TicketSidebarProps {
    selectedTicketId: string | null;
    onSelectTicket: (ticket: Ticket) => void;
    refreshTrigger?: number;
}

const PRIORITY_COLORS: Record<string, string> = {
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    technical: <Settings className="h-4 w-4" />,
    billing: <CreditCard className="h-4 w-4" />,
    bug: <Bug className="h-4 w-4" />,
    feature: <Sparkles className="h-4 w-4" />,
    data: <Database className="h-4 w-4" />,
    dashboard: <LayoutDashboard className="h-4 w-4" />,
    other: <FileText className="h-4 w-4" />,
};

export function TicketSidebar({ selectedTicketId, onSelectTicket, refreshTrigger = 0 }: TicketSidebarProps) {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [filters, setFilters] = useState({ status: 'all', priority: 'all', category: 'all', q: '' });
    const [showFilters, setShowFilters] = useState(false);

    // Poll tickets
    useEffect(() => {
        let alive = true;
        const load = async () => {
            try {
                const res = await supportAPI.listAllTickets({
                    status: filters.status !== 'all' ? filters.status : undefined,
                    priority: filters.priority !== 'all' ? filters.priority : undefined,
                    category: filters.category !== 'all' ? filters.category : undefined,
                    q: filters.q || undefined,
                });
                if (!alive) return;
                setTickets(res.data || []);
            } catch (e) {
                // Silent fail on polling error
            }
        };
        load();
        const id = setInterval(() => {
            if (document.visibilityState === 'visible') {
                load();
            }
        }, 10000);
        return () => { alive = false; clearInterval(id); };
    }, [filters, refreshTrigger]);

    const unreadCount = useMemo(
        () => tickets.filter((t) => t.unread_count && t.unread_count > 0).length,
        [tickets]
    );

    return (
        <div className="w-full md:w-2/5 border rounded-lg bg-white dark:bg-gray-900 flex flex-col h-full">
            {/* Filters Header */}
            <div className="p-3 border-b space-y-2 flex-shrink-0">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            className="pl-8 h-9"
                            placeholder="Search tickets..."
                            value={filters.q}
                            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                        />
                    </div>
                    <Button
                        variant={showFilters ? "secondary" : "outline"}
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-3 gap-2 animate-in slide-in-from-top-2 duration-200">
                        <Select
                            value={filters.status}
                            onValueChange={(v) => setFilters({ ...filters, status: v })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="waiting">Waiting</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.priority}
                            onValueChange={(v) => setFilters({ ...filters, priority: v })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Priority</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            value={filters.category}
                            onValueChange={(v) => setFilters({ ...filters, category: v })}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="billing">Billing</SelectItem>
                                <SelectItem value="bug">Bug</SelectItem>
                                <SelectItem value="feature">Feature</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>
                        {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                    </span>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 h-4">
                            {unreadCount} unread
                        </Badge>
                    )}
                </div>
            </div>

            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto divide-y scrollbar-thin">
                {tickets.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No tickets found matching your filters.
                    </div>
                ) : (
                    tickets.map((t) => (
                        <button
                            key={t.id}
                            className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors duration-200 group ${selectedTicketId === t.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 pl-3'
                                : 'border-l-4 border-transparent pl-3'
                                }`}
                            onClick={() => onSelectTicket(t)}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-muted-foreground flex-shrink-0">
                                            {CATEGORY_ICONS[t.category] || <FileText className="h-4 w-4" />}
                                        </span>
                                        <span className={`text-sm font-medium truncate ${t.unread_count && t.unread_count > 0 ? 'text-foreground font-semibold' : 'text-foreground/90'}`}>
                                            {t.subject}
                                        </span>
                                    </div>

                                    {t.creator && (
                                        <div className="text-xs text-muted-foreground mb-2 truncate flex items-center gap-1">
                                            <span className="font-medium text-foreground/80">{t.creator.company_name}</span>
                                            <span>•</span>
                                            <span>{t.creator.full_name}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="secondary" className={`text-[10px] px-1.5 h-5 font-normal ${PRIORITY_COLORS[t.priority]}`}>
                                            {t.priority}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] px-1.5 h-5 font-normal text-muted-foreground">
                                            {t.status}
                                        </Badge>
                                        {t.unread_count && t.unread_count > 0 && (
                                            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                        )}
                                    </div>
                                </div>

                                <div className="text-[11px] text-muted-foreground flex-shrink-0 flex flex-col items-end gap-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(t.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                                        Open →
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
