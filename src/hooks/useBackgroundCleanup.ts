// src/hooks/useBackgroundCleanup.ts
import { useEffect } from 'react';
import type { Expense } from '../context/DataProvider';

interface CleanupOptions {
  /** Number of days after which expenses expire */
  expireDays?: number;
  /** Callback invoked with IDs of removed expenses */
  onCleanup?: (expiredIds: string[]) => void;
}

/**
 * useBackgroundCleanup
 * 
 * Uses the Background Tasks API (requestIdleCallback) to defer cleanup of
 * old expense entries until the browser is idle, improving responsiveness.
 */
export function useBackgroundCleanup(
  expenses: Expense[],
  options: CleanupOptions = {}
) {
  const { expireDays = 30, onCleanup } = options;

  useEffect(() => {
    if (typeof window.requestIdleCallback !== 'function') {
      return;
    }

    const id = (window as any).requestIdleCallback(() => {
      const cutoff = Date.now() - expireDays * 24 * 60 * 60 * 1000;
      const expired = expenses
        .filter(e => new Date(e.date).getTime() < cutoff)
        .map(e => e.id);
      if (expired.length > 0 && onCleanup) {
        onCleanup(expired);
      }
    });

    return () => {
      (window as any).cancelIdleCallback(id);
    };
  }, [expenses, expireDays, onCleanup]);
}
