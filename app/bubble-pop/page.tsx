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
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 sm:px-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              Bubble Pop Universe
            </p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Relax Mode
            </h1>
            <p className="text-sm text-white/70">
              Tap, click, and breathe. New bubbles appear the instant you pop.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ScorePanel score={score} highScore={highScore} />
            <SoundToggle />
          </div>
        </header>
        <section className={styles.playfield}>
          <BubbleField bubbleColors={pastelPalette} onScoreChange={handleScoreChange} />
        </section>
      </main>
    </div>
  );
}
