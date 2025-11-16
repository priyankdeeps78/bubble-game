"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import styles from "../styles.module.scss";
import type { BubbleInstance } from "../types";

export type BubbleProps = {
  data: BubbleInstance;
  onPopStart: (bubble: BubbleInstance) => void;
  onPopComplete: (id: string) => void;
};

export function Bubble({ data, onPopStart, onPopComplete }: BubbleProps) {
  const [isPopping, setIsPopping] = useState(false);

  const bubbleStyle = useMemo(
    () =>
      ({
        width: data.size,
        height: data.size,
        left: data.x,
        top: data.y,
        opacity: data.opacity,
        boxShadow: "0 8px 30px rgba(14, 25, 44, 0.45)",
        background:
          "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.85), rgba(255,255,255,0))",
        backgroundColor: data.color,
        filter: `blur(${data.blur}px)`,
        "--float-duration": `${data.floatDuration}s`,
        "--sway-duration": `${data.swayDuration}s`,
        "--drift-x": `${data.driftX}px`,
        "--bubble-color": data.color,
        "--blur-amount": `${data.blur}px`,
      } satisfies CSSProperties & Record<string, string | number>),
    [data],
  );

  const handlePop = useCallback(() => {
    if (isPopping) return;
    setIsPopping(true);
    onPopStart(data);
  }, [data, isPopping, onPopStart]);

  const handleComplete = useCallback(() => {
    if (isPopping) {
      onPopComplete(data.id);
    }
  }, [data.id, isPopping, onPopComplete]);

  const animateValue = isPopping
    ? data.isDanger
      ? {
          x: [0, -8, 8, -6, 6, -3, 3, 0],
          scale: [1, 1.06, 1.06, 1.02, 1, 0.15],
          opacity: [data.opacity, data.opacity, data.opacity, data.opacity, 1, 0],
        }
      : { scale: 0.15, opacity: 0 }
    : { scale: 1, opacity: data.opacity };

  const transitionValue = isPopping
    ? data.isDanger
      ? {
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1] as const,
          times: [0, 0.15, 0.3, 0.45, 0.6, 1],
        }
      : { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] as const }
    : { duration: data.floatDuration, ease: [0, 0, 1, 1] as const };

  return (
    <motion.button
      type="button"
      className={styles.bubble}
      data-danger={data.isDanger}
      aria-label={data.isDanger ? "Avoid danger bubble" : "Pop bubble"}
      onPointerDown={handlePop}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handlePop();
        }
      }}
      style={bubbleStyle}
      animate={animateValue}
      transition={transitionValue}
      onAnimationComplete={handleComplete}
      whileHover={isPopping ? undefined : { scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    >
      {/* Shape layer */}
      <span
        className={
          data.shape === "jelly"
            ? `${styles.shape} ${styles.shapeJelly}`
            : data.shape === "triangle"
            ? `${styles.shape} ${styles.shapeTriangle}`
            : data.shape === "orb"
            ? `${styles.shape} ${styles.shapeOrb}`
            : data.shape === "petal"
            ? `${styles.shape} ${styles.shapePetal}`
            : data.shape === "splash"
            ? `${styles.shape} ${styles.shapeSplash}`
            : data.shape === "heart"
            ? `${styles.shape} ${styles.shapeHeart}`
            : `${styles.shape}`
        }
      />

      {/* Inner layer collapses fast */}
      <motion.span
        className={styles.bubbleInner}
        initial={false}
        animate={isPopping ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={isPopping ? { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] as const } : { duration: 0 }}
      />
      {/* Outer halo expands and fades */}
      <motion.span
        className={styles.bubbleHalo}
        initial={false}
        animate={isPopping ? { scale: 1.8, opacity: 0 } : { scale: 1, opacity: 0 }}
        transition={isPopping ? { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] as const } : { duration: 0 }}
      />
      {/* Tiny glimmer at highlight spot when popping */}
      {isPopping ? (
        <motion.span
          className={styles.glimmer}
          style={{ left: "28%", top: "24%" }}
          initial={{ opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.1, 0.2], rotate: [0, 25, -10] }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      ) : null}
    </motion.button>
  );
}
