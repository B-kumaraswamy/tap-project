import React, { useRef, useEffect } from 'react';
import type { Expense } from '../context/DataProvider';

interface ChartCanvasProps {
  data: Expense[];
  /** maximum pixel size of the chart */
  size?: number;
}

const COLORS = ['#4F46E5', '#16A34A', '#DC2626', '#CA8A04', '#2563EB'];

export const ChartCanvas: React.FC<ChartCanvasProps> = ({
  data,
  size = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // aggregate totals by category
    const totals = data.reduce<Record<string, number>>((acc, { category, amount }) => {
      acc[category] = (acc[category] || 0) + amount;
      return acc;
    }, {});
    const entries = Object.entries(totals);
    const sum = entries.reduce((s, [, a]) => s + a, 0);

    // set up exact pixel dimensions
    canvas.width = size;
    canvas.height = size;

    // clear & draw slices
    ctx.clearRect(0, 0, size, size);
    let startAngle = 0;
    entries.forEach(([_, amt], i) => {
      const slice = (amt / sum) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(size/2, size/2);
      ctx.arc(size/2, size/2, size/2 - 16, startAngle, startAngle + slice);
      ctx.closePath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.fill();
      startAngle += slice;
    });
  }, [data, size]);

  return (
    // max-w prevents it from growing too large
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="block mx-auto w-full max-w-[300px] h-auto rounded-lg shadow"
    />
  );
};
