"use client";

import { useEffect, useMemo, useRef } from "react";
import styles from "../styles.module.scss";

type Fly = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
};

export function Fireflies({ enabled = true, count = 30 }: { enabled?: boolean; count?: number }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const flies = useRef<Fly[]>([]);
  const raf = useRef(0);

  const bounds = useMemo(() => ({ w: typeof window !== "undefined" ? window.innerWidth : 1200, h: typeof window !== "undefined" ? window.innerHeight : 800 }), []);

  useEffect(() => {
    if (!enabled) return;
    const arr: Fly[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: Math.random() * bounds.w,
        y: Math.random() * bounds.h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }
    flies.current = arr;

    const onPop = (ev: Event) => {
      const e = ev as CustomEvent<{ x: number; y: number }>;
      const { x, y } = e.detail || { x: bounds.w / 2, y: bounds.h / 2 };
      for (const f of flies.current) {
        const dx = f.x - x;
        const dy = f.y - y;
        const dist = Math.max(8, Math.hypot(dx, dy));
        const strength = 1.8 / (dist / 60); // closer flies scatter more
        f.vx += (dx / dist) * strength;
        f.vy += (dy / dist) * strength;
      }
    };

    window.addEventListener("bubble-pop", onPop as EventListener);

    const step = () => {
      const nodes = containerRef.current?.children || [];
      for (let i = 0; i < flies.current.length; i++) {
        const f = flies.current[i];
        // gentle drift with subtle sine wobble
        f.phase += 0.015;
        f.vx += Math.cos(f.phase) * 0.002;
        f.vy += Math.sin(f.phase * 0.9) * 0.002;
        // damping
        f.vx *= 0.992;
        f.vy *= 0.992;
        f.x += f.vx;
        f.y += f.vy;
        // wrap
        if (f.x < -10) f.x = bounds.w + 10;
        if (f.x > bounds.w + 10) f.x = -10;
        if (f.y < -10) f.y = bounds.h + 10;
        if (f.y > bounds.h + 10) f.y = -10;
        const el = nodes[i] as HTMLElement | undefined;
        if (el) {
          el.style.transform = `translate(${f.x}px, ${f.y}px)`;
          const glow = 0.6 + 0.4 * Math.sin(f.phase * 3 + i * 0.7);
          el.style.opacity = String(glow);
        }
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("bubble-pop", onPop as EventListener);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled, count, bounds.h, bounds.w]);

  if (!enabled) return null;
  return (
    <div ref={containerRef} className={styles.firefliesLayer} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className={styles.firefly} />
      ))}
    </div>
  );
}
