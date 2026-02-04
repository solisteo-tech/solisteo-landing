import React from 'react';
import { Ticket } from '@/lib/validators/support';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface TicketListProps {
    tickets: Ticket[];
}

export default function TicketList({ tickets }: TicketListProps) {
    if (tickets.length === 0) {
        return (
            <div className="text-center py-16 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                <p className="text-slate-500 font-medium">No tickets found</p>
                <p className="text-slate-400 text-sm mt-1">Submit a new request to get started.</p>
            </div>
        );
    }

    const getStatusBadge = (status: Ticket['status']) => {
        switch (status) {
            case 'open':
                return <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100"><AlertCircle className="w-3 h-3 mr-1" /> Open</Badge>;
            case 'pending':
                return <Badge variant="outline" className="text-yellow-600 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
            case 'closed':
                return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Closed</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getPriorityColor = (priority: Ticket['priority']) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-50 border-red-100';
            case 'medium': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'low': return 'text-slate-600 bg-slate-50 border-slate-100';
            default: return '';
        }
    };

    return (
        <div className="space-y-4">
            {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-slate-900">{ticket.subject}</span>
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span className="font-mono text-xs text-slate-400">#{ticket.id}</span>
                                <span>•</span>
                                <span className="capitalize">{ticket.category}</span>
                                <span>•</span>
                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div>
                            {getStatusBadge(ticket.status)}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
