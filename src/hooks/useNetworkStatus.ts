// src/hooks/useNetworkStatus.ts
import { useState, useEffect } from 'react';

/**
 * Represents the user's current network status.
 */
export interface NetworkStatus {
  /** true if the browser is online */
  online: boolean;
  /** Effective connection type: 'slow-2g' | '2g' | '3g' | '4g' | undefined */
  effectiveType?: string;
  /** Downlink speed in megabits per second */
  downlink?: number;
  /** Round-trip time estimate in milliseconds */
  rtt?: number;
  /** true if the user has set a reduced-data preference */
  saveData?: boolean;
}

/**
 * Custom hook wrapping the Network Information API and online/offline events.
 */
export function useNetworkStatus(): NetworkStatus {
  const connection = (navigator as any).connection;

  const getStatus = (): NetworkStatus => ({
    online: navigator.onLine,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
  });

  const [status, setStatus] = useState<NetworkStatus>(getStatus);

  useEffect(() => {
    const update = () => setStatus(getStatus());

    // Listen for online/offline events
    window.addEventListener('online', update);
    window.addEventListener('offline', update);

    // If supported, listen for connection property changes
    if (connection && typeof connection.addEventListener === 'function') {
      connection.addEventListener('change', update);
    }

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      if (connection && typeof connection.removeEventListener === 'function') {
        connection.removeEventListener('change', update);
      }
    };
  }, [connection]);

  return status;
}
