// src/hooks/useGeolocation.ts
import { useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeoStatus {
  coords?: Coordinates;
  error?: string;
  loading: boolean;
}

/**
 * Custom hook for the Geolocation API.
 * - Requests current position on mount
 * - Returns coords, loading state, and any error message
 */
export function useGeolocation(): GeoStatus {
  const [coords, setCoords] = useState<Coordinates>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { coords, error, loading };
}
