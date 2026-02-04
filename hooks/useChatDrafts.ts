// hooks/useChatDrafts.ts
/**
 * Hook to save and restore unsent messages (drafts) from localStorage
 */
import { useEffect, useState } from 'react';

export function useChatDrafts(ticketId: string | null) {
  const [draft, setDraft] = useState('');
  const key = ticketId ? `support-draft-${ticketId}` : 'support-draft-new';

  // Load draft on mount or when ticket changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(key);
    if (saved) {
      setDraft(saved);
    } else {
      setDraft('');
    }
  }, [key]);

  // Save draft to localStorage
  const saveDraft = (text: string) => {
    setDraft(text);
    if (typeof window === 'undefined') return;
    if (text.trim()) {
      localStorage.setItem(key, text);
    } else {
      localStorage.removeItem(key);
    }
  };

  // Clear draft
  const clearDraft = () => {
    setDraft('');
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  };

  return { draft, saveDraft, clearDraft };
}
