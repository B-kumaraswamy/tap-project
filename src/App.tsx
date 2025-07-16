// src/App.tsx
import { useState, useEffect } from "react";
import { useData } from "./context/DataProvider";
import { useNetworkStatus } from "./hooks/useNetworkStatus";
import { useGeolocation } from "./hooks/useGeolocation";
import { useReverseGeocode } from "./hooks/useReverseGeocode";
import { AnimatedInView } from "./components/AnimatedInView";
import { ChartCanvas } from "./components/ChartCanvas";
import { toast } from "sonner";
import { Spinner } from "./components/ui/spinner";

export default function App() {
  const { expenses } = useData();
  const { online, effectiveType } = useNetworkStatus();
  const { coords, loading: geoLoading, error: geoError } = useGeolocation();
  const [showChart, setShowChart] = useState(false);
  const [offToastFired, setOffToastFired] = useState(false);
  const [slowToastFired, setSlowToastFired] = useState(false);
  const {
    name: locationName,
    loading: nameLoading,
    error: nameError,
  } = useReverseGeocode(coords?.latitude, coords?.longitude);

  useEffect(() => {
    if (!online && !offToastFired) {
      toast.warning("You are offline. Check your connection", {
        duration: 1000,
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        },
      });
      setOffToastFired(true);
    }
    // reset when back online
    if (online) {
      setOffToastFired(false);
    }
  }, [online, offToastFired, toast]);

  // 2️⃣ Slow‑2G toast
  useEffect(() => {
    const isSlow2G = online && effectiveType?.includes("2g");
    if (isSlow2G && !slowToastFired) {
      toast.warning(`Slow network. Chart may load slowly.`, {
        duration: 1000,
        style: {
          backgroundColor: "#fee2e2",
          color: "#991b1b",
        },
      });
      setSlowToastFired(true);
    }
    // reset when not 2G
    if (!isSlow2G) {
      setSlowToastFired(false);
    }
  }, [online, effectiveType, slowToastFired, toast]);

  // Aggregate for legend
  const totals = expenses.reduce<Record<string, number>>(
    (acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    },
    {}
  );
  const entries = Object.entries(totals);
  const sum = entries.reduce((s, [, a]) => s + a, 0);
  const COLORS = ["#4F46E5", "#16A34A", "#DC2626", "#CA8A04", "#2563EB"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-center">
      {/* Hero card */}
      <div className="max-w-2xl mx-auto mt-4 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-gray-200 mb-8">
        {/* Location badge */}
        {!online && (
          <div className="bg-red-100 text-red-800 p-2 text-center mb-2">
            You are offline. Check your connection.
          </div>
        )}
        {online && effectiveType?.includes("2g") && (
          <div className="bg-yellow-100 text-yellow-800 p-2 text-center mb-2">
            Slow connection. Chart may load slowly.
          </div>
        )}

        {locationName && (
          <div className="inline-flex items-center px-3 py-1  text-gray-700 rounded-full text-sm  mb-4">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0C6.686 0 4 2.686 4 6c0 7 6 14 6 14s6-7 6-14c0-3.314-2.686-6-6-6z" />
            </svg>
            You are near: {locationName}
          </div>
        )}
        {geoLoading && (
          <div className="p-2 text-center text-gray-600 mb-2">
            Fetching location…
          </div>
        )}
        {geoError && (
          <div className="p-2 text-center text-red-600 mb-2">{geoError}</div>
        )}
        {coords && (
          <div className="p-2 text-center text-sm  text-gray-700 mb-4">
            Your location: {coords.latitude.toFixed(3)},{" "}
            {coords.longitude.toFixed(3)}
          </div>
        )}
        {nameLoading && (
          <div className="p-2 text-center text-gray-600 mb-2">
            Looking up place name…
          </div>
        )}

        {/* Title & subtitle */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Budget Visualizer
        </h1>

        {/* Call‑to‑action button */}
        <div className="flex justify-center">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
            Scroll down to see chart ⬇️
          </button>
        </div>
      </div>

      {nameError && (
        <div className="p-2 text-center text-red-600 mb-2">{nameError}</div>
      )}

      {/* Spacer to push chart off-screen */}
      <div className="h-screen" />

      {/* Legend & chart card */}
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Legend */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap gap-4">
            {entries.map(([cat, amt], i) => (
              <li key={cat} className="flex items-center text-sm">
                <span
                  className="w-3 h-3 mr-2 rounded-sm"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                {cat}{" "}
                <span className="text-gray-500 dark:text-gray-400">
                  ({((amt / sum) * 100).toFixed(1)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Animated chart slot */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900">
          <AnimatedInView rootMargin="0px" threshold={0.1}>
            {(inView) => {
              useEffect(() => {
                if (inView) {
                  const id = setTimeout(() => setShowChart(true), 800);
                  return () => clearTimeout(id);
                }
              }, [inView]);

              if (!inView || !showChart) {
                return (
                  <div className="h-[300px] flex items-center justify-center">
                    <Spinner className="w-12 h-12 text-gray-500" />
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
