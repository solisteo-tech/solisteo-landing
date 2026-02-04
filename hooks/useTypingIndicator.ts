// hooks/useTypingIndicator.ts
/**
 * Hook to manage typing indicators for support chat
 */
import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '@/lib/api';

export function useTypingIndicator(ticketId: string | null) {
  const [remoteTyping, setRemoteTyping] = useState<{
    is_typing: boolean;
    user_name?: string;
    user_role?: string;
  }>({ is_typing: false });
  
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  // Poll for remote typing indicator
  useEffect(() => {
    if (!ticketId) return;

    const poll = async () => {
      try {
        const res = await api.get(`/api/v1/support/tickets/${ticketId}/typing`);
        setRemoteTyping(res.data || { is_typing: false });
      } catch (e: any) {
        // Silently ignore errors including rate limits
        if (e?.response?.status !== 429) {
          console.warn('Typing indicator poll failed:', e?.message);
        }
      }
    };

    poll();
    const interval = setInterval(poll, 8000); // Increased from 2s to 8s
    return () => clearInterval(interval);
  }, [ticketId]);

  // Send typing indicator
  const setTyping = useCallback(async (typing: boolean) => {
    if (!ticketId) return;

    try {
      await api.post(`/api/v1/support/tickets/${ticketId}/typing`, {
        is_typing: typing,
      });
      isTypingRef.current = typing;
    } catch (e) {
      // ignore
    }
  }, [ticketId]);

  // Auto-stop typing after 3 seconds of no input
  const notifyTyping = useCallback(() => {
    if (!isTypingRef.current) {
      setTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 3000);
  }, [setTyping]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTyping(false);
  }, [setTyping]);

  return { remoteTyping, notifyTyping, stopTyping };
}
