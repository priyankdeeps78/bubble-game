"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles.module.scss";

const QUOTES = [
  "Breathe in, you're doing great.",
  "Let your thoughts settle like bubbles.",
  "Inhale calm, exhale worry.",
  "Float with the moment.",
  "Soft focus. Gentle mind.",
];

export function FloatingQuotes({ intervalMs = 180000, paused = false }: { intervalMs?: number; paused?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (paused) return;
    const show = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 4500);
      setIdx((i) => (i + 1) % QUOTES.length);
    };
    // initial delay a bit shorter
    const t0 = setTimeout(show, Math.min(60000, intervalMs));
    const id = setInterval(show, intervalMs);
    return () => {
      clearTimeout(t0);
      clearInterval(id);
    };
  }, [intervalMs, paused]);

  return (
    <div aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {visible && (
          <motion.div
            className={styles.quoteBar}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {QUOTES[idx]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
