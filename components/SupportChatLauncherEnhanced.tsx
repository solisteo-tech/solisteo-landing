"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Paperclip, Search, Upload, Download, Check, CheckCheck } from "lucide-react";
import { supportAPI } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useChatDrafts } from "@/hooks/useChatDrafts";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useChatPagination } from "@/hooks/useChatPagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface Message {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  attachments?: Array<{ filename: string; url: string; size: number; type: string }>;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  unread_count?: number;
  last_message?: Message;
}

export default function SupportChatLauncher() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("technical");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const listRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevMsgCount = useRef(0);
  const { draft, saveDraft, clearDraft } = useChatDrafts(activeTicket?.id || null);
  const { remoteTyping, notifyTyping, stopTyping } = useTypingIndicator(activeTicket?.id || null);
  const { offset, hasMore, loadMore, reset, updateHasMore } = useChatPagination();

  // Message text state (use draft)
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    setMessageText(draft);
  }, [draft]);

  // Get initial character for avatar
  const getAvatarInitial = (role: string) => {
    return role === "admin" ? "A" : "S";
  };

  // Calculate unread count
  const totalUnread = useMemo(() => {
    return tickets.reduce((sum, t) => sum + (t.unread_count || 0), 0);
  }, [tickets]);

  // Handle file download with authentication
  const handleFileDownload = async (url: string, filename: string) => {
    try {
      const fileUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
      const urlObj = new URL(fileUrl);
      const filenameFromPath = urlObj.pathname.split('/').pop() || filename;

      const response = await supportAPI.downloadFile(filenameFromPath);
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error?.response?.data?.detail || 'Could not download file',
        variant: 'destructive',
      });
    }
  };

  // Fetch tickets
  useEffect(() => {
    if (!open) return;
    let alive = true;

    const fetchTickets = async () => {
      try {
        const res = await supportAPI.listMyTickets();
        if (!alive) return;
        setTickets(res.data || []);
      } catch (e: any) {
        if (alive && e?.response?.status !== 429) {
          console.warn('Failed to fetch tickets:', e?.message);
        }
      }
    };

    fetchTickets();
    const id = setInterval(fetchTickets, 10000); // Increased from 5s to 10s
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [open]);

  // Fetch messages for active ticket
  useEffect(() => {
    if (!open || !activeTicket) return;
    let alive = true;

    const fetchMessages = async () => {
      try {
        const res = await supportAPI.getTicket(activeTicket.id, { limit: 20, offset });
        if (!alive) return;
        const msgs = res.data?.messages || [];

        // Notify on new admin reply
        if (msgs.length > prevMsgCount.current) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg.sender_role === "admin" && !lastMsg.is_read) {
            toast({
              title: "New Reply",
              description: "Support responded to your ticket.",
            });

            // Mark as read
            try {
              await supportAPI.markRead(activeTicket.id);
            } catch (e) {
              // Ignore mark-read errors
            }
          }
        }
        prevMsgCount.current = msgs.length;

        if (offset === 0) {
          setMessages(msgs);
        } else {
          setMessages((prev) => [...msgs, ...prev]);
        }

        updateHasMore(res.data?.has_more || false);

        // Scroll to bottom on initial load
        if (offset === 0 && listRef.current) {
          setTimeout(() => {
            if (listRef.current) {
              listRef.current.scrollTop = listRef.current.scrollHeight;
            }
          }, 100);
        }
      } catch (e: any) {
        if (alive && e?.response?.status !== 429) {
          console.warn('Failed to fetch messages:', e?.message);
        }
      }
    };

    fetchMessages();
    const id = setInterval(fetchMessages, 10000); // Increased from 5s to 10s
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [open, activeTicket, offset, toast, updateHasMore]);

  // Filter messages by search
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const query = searchQuery.toLowerCase();
    return messages.filter((m) => m.message.toLowerCase().includes(query));
  }, [messages, searchQuery]);

  const createTicket = async () => {
    if (!subject.trim() || !messageText.trim()) return;
    setLoading(true);
    try {
      const res = await supportAPI.createTicket({
        subject,
        category,
        priority,
        message: messageText,
        attachments: uploadedFiles,
      });
      setSubject("");
      setMessageText("");
      clearDraft();
      setUploadedFiles([]);
      setActiveTicket(res.data);
      reset();
      toast({ title: "Ticket created", description: "We'll respond soon!" });

      // Refresh list
      const list = await supportAPI.listMyTickets();
      setTickets(list.data || []);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!activeTicket || !messageText.trim()) return;
    setLoading(true);
    stopTyping();
    try {
      const res = await supportAPI.sendMessage(activeTicket.id, {
        message: messageText,
        attachments: uploadedFiles,
      });
      setMessageText("");
      clearDraft();
      setUploadedFiles([]);
      setMessages((prev) => [...prev, res.data]);

      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTicket) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 2MB", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const res = await supportAPI.uploadFile(activeTicket.id, file);
      setUploadedFiles((prev) => [...prev, res.data]);
      toast({ title: "File uploaded", description: file.name });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.response?.data?.detail || "Error", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleMessageChange = (text: string) => {
    setMessageText(text);
    saveDraft(text);
    if (text.trim()) {
      notifyTyping();
    } else {
      stopTyping();
    }
  };

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop } = listRef.current;

    // Load more when scrolled to top
    if (scrollTop < 50 && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  if (!user || (user.role !== "seller" && user.role !== "owner" && user.role !== "viewer" && user.role !== "editor")) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="relative h-12 w-12 rounded-full shadow-lg flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
        animate={totalUnread > 0 ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: totalUnread > 0 ? Infinity : 0, duration: 1.5 }}
        aria-label="Support Chat"
      >
        <MessageCircle className="h-6 w-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
            {totalUnread > 9 ? '9+' : totalUnread}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800 z-[60] flex flex-col"
          >
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-semibold">Support</div>
                  <div className="text-xs text-gray-500">Chat with our team</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {user?.support_wa_number && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/20"
                    onClick={() => window.open(`https://wa.me/${user.support_wa_number?.replace(/[^0-9]/g, '')}`, '_blank')}
                  >
                    <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                    WhatsApp
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Ticket selector / creator */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-800 space-y-2 flex-shrink-0">
              <div className="flex gap-2 items-center">
                <select
                  className="flex-1 px-2 py-2 rounded border bg-transparent text-sm"
                  value={activeTicket?.id || ""}
                  onChange={(e) => {
                    const t = tickets.find((x) => x.id === e.target.value) || null;
                    setActiveTicket(t);
                    reset();
                    setSearchQuery("");
                  }}
                >
                  <option value="">New Ticket…</option>
                  {tickets.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.subject} ({t.status}) {t.unread_count ? `• ${t.unread_count}` : ''}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">{tickets.length}</span>
              </div>

              {!activeTicket && (
                <div className="grid grid-cols-1 gap-2">
                  <Input
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <select
                      className="flex-1 px-2 py-2 rounded border bg-transparent text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="technical">Technical</option>
                      <option value="dashboard">Dashboard</option>
                      <option value="data">Data Issue</option>
                      <option value="billing">Billing</option>
                      <option value="bug">Bug</option>
                      <option value="feature">Feature Request</option>
                      <option value="other">Other</option>
                    </select>
                    <select
                      className="w-28 px-2 py-2 rounded border bg-transparent text-sm"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTicket && (
                <>
                  {activeTicket.status === "closed" && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-2 text-xs text-yellow-800 dark:text-yellow-200">
                      ⚠️ This ticket is closed. You cannot send new messages.
                    </div>
                  )}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      className="pl-8"
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div
              ref={listRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-3 space-y-3"
            >
              {hasMore && activeTicket && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" onClick={loadMore}>
                    Load older messages
                  </Button>
                </div>
              )}

              {activeTicket ? (
                filteredMessages.length ? (
                  filteredMessages.map((m) => {
                    const isAdmin = m.sender_role === "admin";
                    const senderName = isAdmin ? "Support Admin" : "You";
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 items-start mb-4 group"
                      >
                        <Avatar className={`h-10 w-10 flex-shrink-0 ring-2 ring-offset-2 ${isAdmin
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 ring-blue-200 dark:ring-blue-900"
                          : "bg-gradient-to-br from-purple-500 to-purple-600 ring-purple-200 dark:ring-purple-900"
                          }`}>
                          <AvatarFallback className="text-white font-semibold">{isAdmin ? "A" : "S"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 max-w-[75%]">
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            {senderName}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm hover:shadow-md transition-shadow duration-200 ${isAdmin
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                            }`}>
                            {searchQuery && m.message.toLowerCase().includes(searchQuery.toLowerCase()) ? (
                              <div className="leading-relaxed" dangerouslySetInnerHTML={{
                                __html: m.message.replace(
                                  new RegExp(searchQuery, 'gi'),
                                  (match) => `<mark class="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">${match}</mark>`
                                )
                              }} />
                            ) : (
                              <div className="leading-relaxed">{m.message}</div>
                            )}
                            {m.attachments && m.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {m.attachments.map((att, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleFileDownload(att.url, att.filename)}
                                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-colors w-full text-left ${isAdmin
                                      ? "bg-blue-600/30 hover:bg-blue-600/50 backdrop-blur-sm"
                                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                                      }`}
                                  >
                                    <Download className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span className="truncate">{att.filename}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                            <span className="font-medium">{new Date(m.created_at).toLocaleTimeString()}</span>
                            {isAdmin && (
                              m.is_read ? (
                                <CheckCheck className="h-3.5 w-3.5 text-blue-500" />
                              ) : (
                                <Check className="h-3.5 w-3.5 text-gray-400" />
                              )
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-xs text-gray-500 text-center">
                    {searchQuery ? 'No messages found' : 'No messages yet.'}
                  </div>
                )
              ) : (
                <div className="text-xs text-gray-500 text-center">Create a new ticket to begin chatting.</div>
              )}

              {/* Typing indicator */}
              {remoteTyping.is_typing && (
                <div className="flex gap-2 items-center text-xs text-gray-500 italic">
                  <div className="flex gap-1">
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    />
                  </div>
                  <span>{remoteTyping.user_name} is typing...</span>
                </div>
              )}
            </div>

            {/* Composer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2 flex-shrink-0">
              {uploadedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                      <Paperclip className="h-3 w-3" />
                      <span className="max-w-[100px] truncate">{file.filename}</span>
                      <button onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <textarea
                rows={2}
                className="w-full px-2 py-2 rounded border bg-transparent resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={activeTicket?.status === "closed" ? "This ticket is closed" : (activeTicket ? "Type your message…" : "Describe your issue…")}
                value={messageText}
                onChange={(e) => handleMessageChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    (activeTicket ? sendMessage() : createTicket());
                  }
                }}
                disabled={activeTicket?.status === "closed"}
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {activeTicket && (
                    <>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || activeTicket?.status === "closed"}
                      >
                        {uploading ? (
                          <Upload className="h-4 w-4 animate-spin" />
                        ) : (
                          <Paperclip className="h-4 w-4" />
                        )}
                      </Button>
                    </>
                  )}
                </div>

                {activeTicket ? (
                  <Button
                    size="sm"
                    disabled={loading || !messageText.trim() || activeTicket.status === "closed"}
                    onClick={sendMessage}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {activeTicket.status === "closed" ? "Closed" : "Send"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={loading || !subject.trim() || !messageText.trim()}
                    onClick={createTicket}
                  >
                    Create Ticket
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
