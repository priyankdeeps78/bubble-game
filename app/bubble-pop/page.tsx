"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { BubbleField } from "./components/BubbleField";
import { SoundToggle } from "./components/SoundToggle";
import { ScorePanel } from "./components/ScorePanel";
import { soundManager } from "./utils/soundManager";

const pastelPalette = [
  "#f8b4d9",
  "#f7d3ba",
  "#c8e9ff",
  "#d4c5ff",
  "#b4f8c8",
  "#ffd6e0",
];

const warmPalette = [
  "#ffd1c1",
  "#ffedc2",
  "#ffe0b5",
  "#ffc6c7",
  "#ffd8a8",
  "#ffd1e8",
];

const SCORE_KEY = "bubble-pop-high-score";

export default function BubblePopPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [flowMode, setFlowMode] = useState(false);

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(SCORE_KEY));
      if (!Number.isNaN(stored)) {
        setHighScore(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    // Adjust ambient intensity in Flow Mode
    soundManager.setAmbientIntensity(flowMode ? 0.16 : 0.1);
  }, [flowMode]);

  const handleScoreChange = useCallback((delta: number) => {
    setScore((prev) => {
      const nextScore = Math.max(0, prev + delta);
      setHighScore((current) => {
        if (nextScore > current) {
          try {
            localStorage.setItem(SCORE_KEY, String(nextScore));
          } catch {}
          return nextScore;
        }
        return current;
      });
      return nextScore;
    });
  }, []);

  return (
    <div className={`${styles.page} ${flowMode ? styles.flowing : ""}`}>
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <div className={styles.starField} aria-hidden="true" />
      {flowMode && <div className={styles.flowBlur} aria-hidden="true" />}

      {!flowMode && (
        <nav className={styles.navBar} aria-label="Primary">
          <div className={styles.navContent}>
            <div className={styles.brandBlock}>
              <p className={styles.brandTagline}>Bubble Pop Universe</p>
              <h1 className={styles.brandTitle}>Relax Mode</h1>
              <p className={styles.brandDescription}>Pop, breathe, repeat — bigger bubbles reward more, red ones bite softly.</p>
            </div>
            <div className={styles.infoBlock}>
              <p className={styles.infoTitle}>Why play?</p>
              <p className={styles.infoText}>A tiny break for your brain. Gentle motion, soft sound, and satisfying pops help reset focus in 30–60 seconds.</p>
            </div>
            <div className={styles.controlsBlock}>
              <ScorePanel score={score} highScore={highScore} />
              <SoundToggle />
            </div>
          </div>
        </nav>
      )}

      {/* Minimal Flow toggle */}
      <button
        type="button"
        className={styles.flowToggle}
        aria-pressed={flowMode}
        onClick={() => setFlowMode((v) => !v)}
      >
        {flowMode ? "Exit Flow Mode" : "Flow Mode"}
      </button>

      <section className={styles.playfield}>
        <BubbleField
          bubbleColors={flowMode ? warmPalette : pastelPalette}
          onScoreChange={handleScoreChange}
          flowMode={flowMode}
        />
      </section>
    </div>
  );
}
