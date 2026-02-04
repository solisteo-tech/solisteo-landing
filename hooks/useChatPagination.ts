// hooks/useChatPagination.ts
/**
 * Hook to manage infinite scroll pagination for chat messages
 */
import { useState, useCallback } from 'react';

export function useChatPagination() {
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    setIsLoadingMore(true);
    setOffset((prev) => prev + 20);
  }, [hasMore, isLoadingMore]);

  const reset = useCallback(() => {
    setOffset(0);
    setHasMore(true);
    setIsLoadingMore(false);
  }, []);

  const updateHasMore = useCallback((more: boolean) => {
    setHasMore(more);
    setIsLoadingMore(false);
  }, []);

  return {
    offset,
    hasMore,
    isLoadingMore,
    loadMore,
    reset,
    updateHasMore,
  };
}
