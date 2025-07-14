// src/components/AnimatedInView.tsx
import React, { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AnimatedInViewProps {
  /** A render-prop: receives `inView` and returns what to render */
  children: (inView: boolean) => ReactNode;
  /** How much margin around the viewport to consider “in view” */
  rootMargin?: string;
  /** Threshold(s) of intersection (0 = any pixel, 1 = fully in view) */
  threshold?: number | number[];
}

export const AnimatedInView: React.FC<AnimatedInViewProps> = ({
  children,
  rootMargin = '0px',
  threshold = 0.1,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();    // stop observing once it’s in view
        }
      },
      { rootMargin, threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [rootMargin, threshold]);

  return <div ref={ref}>{children(inView)}</div>;
};
