"use client";

import { useEffect, useState } from "react";
import { soundManager } from "../utils/soundManager";
import styles from "../styles.module.scss";

const STORAGE_KEY = "bubble-pop-sound";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate persisted sound preference once on mount
      setEnabled(saved === "on");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    soundManager.setEnabled(enabled);
    soundManager.setAmbient(enabled);
  }, [enabled, mounted]);

  return (
    <button
      type="button"
      className={styles.soundToggle}
      aria-pressed={enabled}
      onClick={() => setEnabled((prev) => !prev)}
    >
      <span className="text-lg" role="img" aria-hidden>
        {enabled ? "🔊" : "🔇"}
      </span>
      <span className="text-sm font-semibold tracking-wide uppercase">
        {enabled ? "Sound on" : "Sound off"}
      </span>
    </button>
  );
}
