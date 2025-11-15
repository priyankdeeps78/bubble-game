"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "../styles.module.scss";
import type { BubbleInstance, BurstInstance } from "../types";
import { ParticleBurst } from "./ParticleBurst";
import { Bubble } from "./Bubble";
import { maybe, randomBetweenFloat, randomId, randomInt } from "../utils/random";
import { soundManager } from "../utils/soundManager";

const MAX_BUBBLES = 70;
const BURST_LIFETIME = 450;
const DANGER_COLOR = "rgba(255, 82, 117, 0.78)";
const FALLBACK_COLOR = "hsla(200, 70%, 80%, 0.7)";

export type BubbleFieldProps = {
  bubbleColors?: string[];
  onScoreChange?: (delta: number) => void;
};

type SizeRange = {
  min: number;
  max: number;
};

export function BubbleField({ bubbleColors, onScoreChange }: BubbleFieldProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const [viewportWidth, setViewportWidth] = useState(1200);
  const [bounds, setBounds] = useState<{ width: number; height: number } | null>(null);
  const [bubbles, setBubbles] = useState<BubbleInstance[]>([]);
  const [bursts, setBursts] = useState<BurstInstance[]>([]);

  const palette = useMemo(() => (bubbleColors?.length ? bubbleColors : undefined), [bubbleColors]);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const bubbleCount = useMemo(() => {
    if (viewportWidth < 640) return 25;
    if (viewportWidth < 1024) return 38;
    return 55;
  }, [viewportWidth]);

  const sizeRange: SizeRange = useMemo(() => {
    if (viewportWidth < 640) return { min: 36, max: 120 };
    if (viewportWidth < 1024) return { min: 26, max: 110 };
    return { min: 20, max: 100 };
  }, [viewportWidth]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setBounds({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

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
    const points = isDanger ? -80 : 10;
    return {
      id: randomId(),
      size,
      x,
      y,
      color,
      floatDuration: randomBetweenFloat(8, 18),
      swayDuration: randomBetweenFloat(4, 7),
      driftX: randomBetweenFloat(-30, 30),
      opacity: isDanger ? 0.9 : randomBetweenFloat(0.6, 0.85),
      blur: isDanger ? 0 : maybe(0.35) ? randomBetweenFloat(0.8, 1.8) : 0,
      isDanger,
      points,
    };
  }, [bounds, palette, sizeRange.max, sizeRange.min]);

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
