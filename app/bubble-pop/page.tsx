"use client";

import { useCallback, useState } from "react";
import styles from "./styles.module.scss";
import { BubbleField } from "./components/BubbleField";
import { SoundToggle } from "./components/SoundToggle";
import { ScorePanel } from "./components/ScorePanel";

const pastelPalette = [
  "#f8b4d9",
  "#f7d3ba",
  "#c8e9ff",
  "#d4c5ff",
  "#b4f8c8",
  "#ffd6e0",
];

const SCORE_KEY = "bubble-pop-high-score";

const getStoredHighScore = () => {
  if (typeof window === "undefined") return 0;
  const stored = Number(localStorage.getItem(SCORE_KEY));
  return Number.isNaN(stored) ? 0 : stored;
};

export default function BubblePopPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(getStoredHighScore);

  const handleScoreChange = useCallback((delta: number) => {
    setScore((prev) => {
      const nextScore = Math.max(0, prev + delta);
      setHighScore((current) => {
        if (nextScore > current) {
          if (typeof window !== "undefined") {
            localStorage.setItem(SCORE_KEY, String(nextScore));
          }
          return nextScore;
        }
        return current;
      });
      return nextScore;
    });
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <div className={styles.starField} aria-hidden="true" />

      <section className={styles.playfield}>
        <BubbleField bubbleColors={pastelPalette} onScoreChange={handleScoreChange} />
      </section>

      <div style={{ position: "fixed", top: 16, left: 16, right: 16, zIndex: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Bubble Pop Universe</p>
          <h1 className="text-2xl font-semibold text-white">Relax Mode</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ScorePanel score={score} highScore={highScore} />
          <SoundToggle />
        </div>
      </div>
    </div>
  );
}
