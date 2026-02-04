'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import { useChatPagination } from '@/hooks/useChatPagination';
import { useChatDrafts } from '@/hooks/useChatDrafts';
import { supportAPI } from '@/lib/api';
import { Message, Ticket, SellerProfile } from '@/lib/types/support';
import {
    Search, Send, Paperclip, Download, Upload, X, Check, CheckCheck,
    Clock, AlertCircle, MessageCircle
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ----------------------------------------------------------------------------
// Utility: Safe Text Highlighting (XSS Prevention)
// ----------------------------------------------------------------------------
function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query || !query.trim()) return <span className="leading-relaxed whitespace-pre-wrap">{text}</span>;

    // Use simple splitting. This is safe because we render parts as React nodes, 
    // not innerHTML.
    const parts = text.split(new RegExp(`(${query})`, 'gi'));

    return (
        <span className="leading-relaxed whitespace-pre-wrap">
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 rounded px-0.5 text-inherit font-medium border border-yellow-300 dark:border-yellow-700">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </span>
    );
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
interface SupportChatAreaProps {
    ticket: Ticket | null;
    onUpdateTicket: (updated: Ticket) => void;
    onTicketRead?: () => void;
}

export function SupportChatArea({ ticket, onUpdateTicket, onTicketRead }: SupportChatAreaProps) {
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [seller, setSeller] = useState<SellerProfile | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [reply, setReply] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    const listRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const prevSellerMsgCount = useRef(0);

    // Custom Hooks
    const { draft, saveDraft, clearDraft } = useChatDrafts(ticket?.id || null);
    const { remoteTyping, notifyTyping, stopTyping } = useTypingIndicator(ticket?.id || null);
    const { offset, hasMore, loadMore, reset, updateHasMore } = useChatPagination();

    // Sync Draft
    useEffect(() => {
        setReply(draft);
    }, [draft]);

    // Mark Read on Open
    useEffect(() => {
        if (ticket?.id && (ticket.unread_count || 0) > 0) {
            supportAPI.markRead(ticket.id)
                .then(() => {
                    if (onTicketRead) onTicketRead();
                })
                .catch(() => { }); // silent fail
        }
    }, [ticket?.id, ticket?.unread_count, onTicketRead]);

    // Load Messages & Poll
    useEffect(() => {
        if (!ticket) return;

        let alive = true;
        const load = async () => {
            try {
                const res = await supportAPI.getTicketAdmin(ticket.id, {
                    limit: 50,
                    offset,
                    include_internal: true,
                });
                if (!alive) return;

                const msgs = res.data?.messages || [];
                const sellerMsgs = msgs.filter((m: Message) => m.sender_role === 'seller' && !m.is_read);

                // Notify on new message
                if (sellerMsgs.length > prevSellerMsgCount.current) {
                    toast({ title: 'New Message', description: 'Seller replied to the ticket.' });
                    // Auto Mark Read
                    supportAPI.markRead(ticket.id).catch(() => { });
                }
                prevSellerMsgCount.current = sellerMsgs.length;

                // Merge messages logic implementation for pagination
                if (offset === 0) {
                    setMessages(msgs);
                    // Scroll to bottom on initial load
                    setTimeout(() => {
                        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
                    }, 100);
                } else {
                    setMessages((prev) => [...msgs, ...prev]);
                }

                setSeller(res.data?.seller || null);
                updateHasMore(res.data?.has_more || false);

            } catch (e: any) {
                if (alive && e?.response?.status !== 429) {
                    console.error("Failed to load chat", e);
                }
            }
        };

        load();
        const id = setInterval(() => {
            if (document.visibilityState === 'visible') {
                load();
            }
        }, 10000); // 10s poll only when visible

        return () => {
            alive = false;
            clearInterval(id);
        };
    }, [ticket, offset, updateHasMore, toast]);

    // Filter Search
    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return messages;
        return messages.filter((m) => m.message.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [messages, searchQuery]);

    // Action: Send Reply
    const sendReply = async () => {
        if (!ticket || !reply.trim()) return;
        stopTyping();

        try {
            await supportAPI.replyTicketAdmin(ticket.id, {
                message: reply,
                attachments: uploadedFiles,
                is_internal: isInternal,
            });

            setReply('');
            clearDraft();
            setUploadedFiles([]);
            setIsInternal(false);
            reset(); // Reset pagination to fetch latest

            // Immediate refresh manually to feel responsive
            const res = await supportAPI.getTicketAdmin(ticket.id, { limit: 50, offset: 0 });
            setMessages(res.data?.messages || []);

            toast({
                title: isInternal ? 'Note added' : 'Reply sent',
                description: isInternal ? 'Visible only to team.' : 'Sent to seller.',
            });
        } catch (e) {
            toast({ title: 'Failed to send', variant: 'destructive' });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !ticket) return;

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({ title: 'File too large', description: 'Max size is 5MB', variant: 'destructive' });
            return;
        }

        setUploading(true);
        try {
            const res = await supportAPI.uploadFile(ticket.id, file);
            setUploadedFiles((prev) => [...prev, res.data]);
            toast({ title: 'Attached', description: file.name });
        } catch (e: any) {
            toast({ title: 'Upload failed', variant: 'destructive' });
        } finally {
            setUploading(false);
        }
    };

    const updateStatus = async (status: string) => {
        if (!ticket) return;
        await supportAPI.updateStatus(ticket.id, { status });
        onUpdateTicket({ ...ticket, status });
        toast({ title: 'Status updated' });
    };

    const updatePriority = async (priority: string) => {
        if (!ticket) return;
        await supportAPI.updatePriority(ticket.id, { priority });
        onUpdateTicket({ ...ticket, priority });
        toast({ title: 'Priority updated' });
    };

    // Scroll handler for pagination
    const handleScroll = useCallback(() => {
        if (!listRef.current) return;
        const { scrollTop } = listRef.current;
        if (scrollTop < 50 && hasMore) {
            loadMore();
        }
    }, [hasMore, loadMore]);

    if (!ticket) {
        return (
            <div className="flex-1 border rounded-lg bg-white dark:bg-gray-900 flex flex-col items-center justify-center text-muted-foreground">
                <div className="bg-muted p-6 rounded-full mb-4">
                    <MessageCircle className="h-12 w-12 opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No Ticket Selected</h3>
                <p className="text-sm">Select a ticket from the sidebar to view conversation.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 border rounded-lg bg-white dark:bg-gray-900 flex flex-col h-full overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-3 border-b bg-gray-50/50 dark:bg-gray-900/50 flex flex-col gap-3 flex-shrink-0">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-offset-background ring-purple-500/20">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold">
                                {seller?.company_name?.[0] || ticket.creator?.company_name?.[0] || 'S'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold text-sm">{ticket.subject}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                {seller?.full_name || ticket.creator?.full_name}
                                {seller?.email && <span className="opacity-50">&lt;{seller.email}&gt;</span>}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <select
                            className="h-8 px-2 rounded-md border bg-background text-xs font-medium focus:ring-2 focus:ring-ring"
                            value={ticket.status}
                            onChange={(e) => updateStatus(e.target.value)}
                        >
                            <option value="open">Open</option>
                            <option value="waiting">Waiting</option>
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                        </select>
                        <select
                            className="h-8 px-2 rounded-md border bg-background text-xs font-medium focus:ring-2 focus:ring-ring"
                            value={ticket.priority}
                            onChange={(e) => updatePriority(e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                </div>

                {/* In-Chat Search */}
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 h-9 bg-background"
                        placeholder="Search in conversation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Message List */}
            <div
                ref={listRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-50/30 dark:bg-gray-900/10"
            >
                {hasMore && (
                    <div className="flex justify-center py-2">
                        <Button variant="ghost" size="sm" onClick={loadMore} className="text-xs">
                            Load older messages
                        </Button>
                    </div>
                )}

                {filteredMessages.map((m) => {
                    const isAdmin = m.sender_role === 'admin';
                    const isInternalNote = m.is_internal;

                    return (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 max-w-[85%] ${isAdmin ? 'ml-auto flex-row-reverse' : ''} group`}
                        >
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarFallback className={`text-[10px] text-white ${isAdmin ? 'bg-blue-600' : 'bg-purple-600'}`}>
                                    {isAdmin ? 'A' : 'S'}
                                </AvatarFallback>
                            </Avatar>

                            <div className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[11px] font-medium text-muted-foreground">
                                        {isAdmin ? 'You' : 'Seller'}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground/60">
                                        {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    {isInternalNote && (
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-medium border border-yellow-200 dark:border-yellow-800 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            Internal Note
                                        </span>
                                    )}
                                </div>

                                <div className={`rounded-xl px-4 py-3 text-sm shadow-sm relative ${isInternalNote
                                    ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 text-foreground'
                                    : isAdmin
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-bl-none text-foreground'
                                    }`}>
                                    <HighlightText text={m.message} query={searchQuery} />

                                    {m.attachments && m.attachments.length > 0 && (
                                        <div className="mt-3 space-y-2 pt-3 border-t border-black/10 dark:border-white/10">
                                            {m.attachments.map((att, i) => (
                                                <a
                                                    key={i}
                                                    href={att.url.startsWith('http') ? att.url : `${API_BASE_URL}${att.url}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className={`block text-xs p-2 rounded flex items-center gap-2 transition-colors ${isAdmin
                                                        ? 'bg-blue-700/50 hover:bg-blue-700'
                                                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <Download className="h-3 w-3 opacity-70" />
                                                    <span className="truncate max-w-[200px]">{att.filename}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Read receipts */}
                                {isAdmin && (
                                    <div className="mt-1 mr-1">
                                        {m.is_read ? (
                                            <CheckCheck className="h-3 w-3 text-blue-500" />
                                        ) : (
                                            <Check className="h-3 w-3 text-muted-foreground" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}

                {remoteTyping.is_typing && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground ml-12 animate-pulse">
                        <span>Seller is typing...</span>
                    </div>
                )}
            </div>

            {/* Composer */}
            <div className="p-4 border-t bg-background flex-shrink-0">
                {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {uploadedFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 bg-muted px-2.5 py-1.5 rounded-md text-xs border">
                                <Paperclip className="h-3 w-3" />
                                <span className="truncate max-w-[150px]">{file.filename}</span>
                                <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} className="hover:text-destructive">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <Tabs value={isInternal ? 'internal' : 'reply'} onValueChange={(v) => setIsInternal(v === 'internal')} className="mb-2">
                    <TabsList className="h-8 w-64 grid grid-cols-2">
                        <TabsTrigger value="reply" className="text-xs">Public Reply</TabsTrigger>
                        <TabsTrigger value="internal" className="text-xs data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-900">Internal Note</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className={`relative rounded-lg border shadow-sm transition-colors ${isInternal ? 'bg-yellow-50/50 border-yellow-200' : 'bg-background hover:border-primary/50'}`}>
                    <textarea
                        value={reply}
                        onChange={(e) => {
                            setReply(e.target.value);
                            saveDraft(e.target.value);
                            if (!isInternal) e.target.value ? notifyTyping() : stopTyping();
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendReply();
                            }
                        }}
                        placeholder={isInternal ? "Add an internal note visible only to admins..." : "Type your reply to the seller..."}
                        className="w-full min-h-[80px] p-3 text-sm bg-transparent resize-none focus:outline-none"
                    />

                    <div className="flex items-center justify-between p-2 border-t bg-transparent">
                        <div className="flex items-center gap-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                onChange={handleFileUpload}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? <Upload className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                            </Button>
                        </div>
                        <Button
                            size="sm"
                            onClick={sendReply}
                            disabled={!reply.trim() && uploadedFiles.length === 0}
                            className={isInternal ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
                        >
                            <Send className="h-3.5 w-3.5 mr-2" />
                            {isInternal ? 'Post Note' : 'Send'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
