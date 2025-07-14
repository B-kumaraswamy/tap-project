// src/hooks/useReverseGeocode.ts
import { useState, useEffect } from 'react';

export function useReverseGeocode(lat?: number, lon?: number) {
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (lat == null || lon == null) return;

    const controller = new AbortController();
    setLoading(true);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      {
        headers: { 'Accept-Language': 'en' },
        signal: controller.signal,
      }
    )
      .then(async (res) => {
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setName(data.display_name);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [lat, lon]);

  return { name, loading, error };
}
