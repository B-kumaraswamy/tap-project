// src/App.tsx
import { useState, useEffect } from 'react';
import { useData } from './context/DataProvider';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { useGeolocation } from './hooks/useGeolocation';
import { useReverseGeocode } from './hooks/useReverseGeocode';
import { AnimatedInView } from './components/AnimatedInView';
import { ChartCanvas } from './components/ChartCanvas';

export default function App() {
  const { expenses } = useData();
  const { online, effectiveType } = useNetworkStatus();
  const { coords, loading: geoLoading, error: geoError } = useGeolocation();
  const [showChart, setShowChart] = useState(false);
  const { name: locationName, loading: nameLoading, error: nameError } =
   useReverseGeocode(coords?.latitude, coords?.longitude);

  // Aggregate for legend
  const totals = expenses.reduce<Record<string, number>>((acc, { category, amount }) => {
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});
  const entries = Object.entries(totals);
  const sum = entries.reduce((s, [, a]) => s + a, 0);
  const COLORS = ['#4F46E5', '#16A34A', '#DC2626', '#CA8A04', '#2563EB'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Network status banners */}
      {!online && (
        <div className="bg-red-100 text-red-800 p-2 text-center mb-2">
          You are offline. Showing cached data.
        </div>
      )}
      {online && effectiveType?.includes('2g') && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-center mb-2">
          Slow connection ({effectiveType}). Chart updates may be delayed.
        </div>
      )}

      {/* Geolocation status */}
      {geoLoading && (
        <div className="p-2 text-center text-gray-600 mb-2">
          Fetching location…
        </div>
      )}
      {geoError && (
        <div className="p-2 text-center text-red-600 mb-2">
          {geoError}
        </div>
      )}
      {coords && (
        <div className="p-2 text-center text-sm text-gray-700 mb-4">
          Your location: {coords.latitude.toFixed(3)}, {coords.longitude.toFixed(3)}
        </div>
      )}
      {nameLoading && (
       <div className="p-2 text-center text-gray-600 mb-2">
        Looking up place name…
      </div>
     )}
     {nameError && (
       <div className="p-2 text-center text-red-600 mb-2">
         {nameError}
       </div>
     )}
     {locationName && (
       <div className="p-2 text-center text-sm text-gray-700 mb-4">
         You are near: {locationName}
       </div>
     )}

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-center">🚀 Budget Visualizer</h1>

      {/* Fullscreen spacer */}
      <div className="h-screen flex items-center justify-center mb-6">
        <p className="text-xl text-gray-600">
          Scroll down to reveal your spending chart…
        </p>
      </div>

      {/* Card with legend  animated chart */}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Legend */}
        <div className="p-4 border-b">
          <ul className="flex flex-wrap gap-4">
            {entries.map(([cat, amt], i) => (
              <li key={cat} className="flex items-center text-sm">
                <span
                  className="w-3 h-3 mr-2 rounded-sm"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {cat}{' '}
                <span className="text-gray-500">
                  ({((amt / sum) * 100).toFixed(1)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Animated chart slot */}
        <div className="p-6">
          <AnimatedInView rootMargin="0px" threshold={0.5}>
            {(inView) => {
              // Delay chart mount by 800ms after threshold met
              useEffect(() => {
                if (inView) {
                  const id = setTimeout(() => setShowChart(true), 800);
                  return () => clearTimeout(id);
                }
              }, [inView]);

              if (!inView || !showChart) {
                return (
                  <div className="h-[300px] flex items-center justify-center bg-gray-200 rounded">
                    <p className="text-lg text-gray-500">Loading chart…</p>
                  </div>
                );
              }

              return <ChartCanvas data={expenses} size={300} />;
            }}
          </AnimatedInView>
        </div>
      </div>
    </div>
  );
}
