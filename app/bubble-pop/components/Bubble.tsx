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
      animate={
        isPopping
          ? { scale: 0.15, opacity: 0 }
          : { scale: 1, opacity: data.opacity }
      }
      transition={{
        duration: isPopping ? 0.18 : data.floatDuration,
        ease: isPopping ? [0.2, 0.8, 0.2, 1] : "linear",
      }}
      onAnimationComplete={handleComplete}
      whileHover={isPopping ? undefined : { scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
    />
  );
}
