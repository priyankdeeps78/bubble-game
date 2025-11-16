"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles.module.scss";
import type { BubbleInstance, BurstInstance } from "../types";
import { ParticleBurst } from "./ParticleBurst";
import { Bubble } from "./Bubble";
import { maybe, randomBetweenFloat, randomId, randomInt } from "../utils/random";
import { soundManager } from "../utils/soundManager";

const MAX_BUBBLES = 110;
const BURST_LIFETIME = 450;
const DANGER_COLOR = "rgba(255, 82, 117, 0.78)";
const FALLBACK_COLOR = "hsla(200, 70%, 80%, 0.7)";

export type BubbleFieldProps = {
  bubbleColors?: string[];
  onScoreChange?: (delta: number) => void;
  flowMode?: boolean;
};

type SizeRange = {
  min: number;
  max: number;
};

export function BubbleField({ bubbleColors, onScoreChange, flowMode = false }: BubbleFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [bounds, setBounds] = useState<{ width: number; height: number } | null>(null);
  const [bubbles, setBubbles] = useState<BubbleInstance[]>([]);
  const [bursts, setBursts] = useState<BurstInstance[]>([]);

  const palette = useMemo(() => (bubbleColors?.length ? bubbleColors : undefined), [bubbleColors]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const bubbleCount = useMemo(() => {
    if (!bounds) return 60;
    const area = bounds.width * bounds.height;
    // Roughly 1 bubble per 18-22k px², clamp for sanity
    return Math.min(
      MAX_BUBBLES,
      Math.max(35, Math.round(area / 20000))
    );
  }, [bounds]);

  const sizeRange: SizeRange = useMemo(() => {
    if (!bounds) return { min: 20, max: 180 };
    const isMobile = bounds.width < 640;
    // Allow tiny (12px) up to very big (240-280px)
    return isMobile ? { min: 18, max: 260 } : { min: 12, max: 240 };
  }, [bounds]);

  const createBubble = useCallback((): BubbleInstance | null => {
    if (!bounds) return null;
    const size = randomBetweenFloat(sizeRange.min, sizeRange.max);
    const x = randomBetweenFloat(0, Math.max(0, bounds.width - size));
    const y = randomBetweenFloat(0, Math.max(0, bounds.height - size));
    const isDanger = maybe(0.12);
    const color = isDanger
      ? DANGER_COLOR
      : palette
        ? palette[randomInt(0, palette.length - 1)]
        : FALLBACK_COLOR;
    // Speed profile
    const floatDuration = flowMode ? randomBetweenFloat(9, 18) : randomBetweenFloat(4.5, 10.5);
    const swayDuration = flowMode ? randomBetweenFloat(5.5, 9) : randomBetweenFloat(3, 6);
    const driftX = flowMode ? randomBetweenFloat(-25, 25) : randomBetweenFloat(-45, 45);
    // Size-based scoring (unchanged)
    const basePoints = Math.max(1, Math.round(size / 7));
    const points = isDanger ? -basePoints * 8 : basePoints;

    return {
      id: randomId(),
      size,
      x,
      y,
      color,
      floatDuration,
      swayDuration,
      driftX,
      opacity: isDanger ? 0.92 : randomBetweenFloat(0.6, 0.85),
      blur: isDanger ? 0 : maybe(0.35) ? randomBetweenFloat(0.6, 1.6) : 0,
      isDanger,
      points,
    };
  }, [bounds, palette, sizeRange.max, sizeRange.min, flowMode]);

  useEffect(() => {
    if (!bounds) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- rebalance the bubble pool when layout bounds change
    setBubbles((prev) => {
      if (prev.length === bubbleCount) return prev;
      const next = prev.slice(0, bubbleCount);
      while (next.length < bubbleCount && next.length < MAX_BUBBLES) {
        const bubble = createBubble();
        if (bubble) next.push(bubble);
      }
      return next;
    });
  }, [bounds, bubbleCount, createBubble]);

  const scheduleBurstRemoval = useCallback((id: string) => {
    const timeout = setTimeout(() => {
      setBursts((prev) => prev.filter((burst) => burst.id !== id));
      timeouts.current.delete(id);
    }, BURST_LIFETIME);
    timeouts.current.set(id, timeout);
  }, []);

  useEffect(() => () => {
    timeouts.current.forEach((timeout) => clearTimeout(timeout));
    timeouts.current.clear();
  }, []);

  const addBurst = useCallback(
    (bubble: BubbleInstance) => {
      if (!bounds) return;
      const burst: BurstInstance = {
        id: randomId(),
        x: bubble.x + bubble.size / 2,
        y: bubble.y + bubble.size / 2,
        color: bubble.color,
        size: bubble.size,
      };
      setBursts((prev) => [...prev, burst]);
      scheduleBurstRemoval(burst.id);
    },
    [bounds, scheduleBurstRemoval],
  );

  const handlePopStart = useCallback(
    (bubble: BubbleInstance) => {
      soundManager.playPop();
      // Tiny haptic for mobile
      try {
        if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          // @ts-ignore - Vibrate exists on Navigator in browsers
          navigator.vibrate(10);
        }
      } catch {}
      addBurst(bubble);
      onScoreChange?.(bubble.points);
    },
    [addBurst, onScoreChange],
  );

  const handlePopComplete = useCallback(
    (id: string) => {
      setBubbles((prev) =>
        prev.map((bubble) => (bubble.id === id ? createBubble() ?? bubble : bubble)),
      );
    },
    [createBubble],
  );

  return (
    <div className={styles.fieldSurface}>
      <div ref={containerRef} className={styles.bubbleField}>
        <AnimatePresence>
          {bubbles.map((bubble) => (
            <Bubble
              key={bubble.id}
              data={bubble}
              onPopStart={handlePopStart}
              onPopComplete={handlePopComplete}
              gentlePop={flowMode}
            />
          ))}
        </AnimatePresence>
        {bursts.map((burst) => (
          <ParticleBurst key={burst.id} burst={burst} />
        ))}
      </div>
    </div>
  );
}
