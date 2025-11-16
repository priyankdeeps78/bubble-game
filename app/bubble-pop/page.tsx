"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.scss";
import { BubbleField } from "./components/BubbleField";
import { SoundToggle } from "./components/SoundToggle";
import { ScorePanel } from "./components/ScorePanel";
import { soundManager } from "./utils/soundManager";
import { Decorations } from "./components/Decorations";

const sunrisePalette = ["#ffd6d1", "#ffc8a2", "#ffe6b3", "#ffb3c1", "#ffe0c2"]; // Calm Sunrise
const spacePalette = ["#a38cff", "#7b6cff", "#4f3fcf", "#b096ff", "#9f86ff"]; // Deep Space Zen
const forestPalette = ["#a8e6cf", "#b7d7a8", "#cde6a8", "#8bcf9b", "#e5f2cc"]; // Forest Breeze
const arcticPalette = ["#d0f7ff", "#c2f1ff", "#e9fdff", "#bfe7f5", "#e2f9ff"]; // Arctic Mist
const warmPalette = ["#ffc6c7", "#ffadad", "#ffd6a5", "#ffd1c1", "#ffcad4"]; // Warm Glow

const SCORE_KEY = "bubble-pop-high-score";

type Mood = "sunrise" | "space" | "forest" | "arctic" | "warm";

export default function BubblePopPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [flow, setFlow] = useState(false);
  const [mood, setMood] = useState<Mood>("sunrise");
  const [showThemeOverlay, setShowThemeOverlay] = useState(false);

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(SCORE_KEY));
      if (!Number.isNaN(stored)) setHighScore(stored);
    } catch {}
  }, []);

  useEffect(() => {
    soundManager.setFlow(flow);
  }, [flow]);

  const themedPalette = useMemo(() => {
    switch (mood) {
      case "sunrise":
        return sunrisePalette;
      case "space":
        return spacePalette;
      case "forest":
        return forestPalette;
      case "arctic":
        return arcticPalette;
      case "warm":
        return warmPalette;
      default:
        return sunrisePalette;
    }
  }, [mood]);

  const handleMoodChange = useCallback((next: Mood) => {
    setMood(next);
    setShowThemeOverlay(true);
    setTimeout(() => setShowThemeOverlay(false), 500);
  }, []);

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

  const themeClass = useMemo(() => {
    switch (mood) {
      case "sunrise":
        return styles.themeSunrise;
      case "space":
        return styles.themeSpace;
      case "forest":
        return styles.themeForest;
      case "arctic":
        return styles.themeArctic;
      case "warm":
        return styles.themeWarm;
    }
  }, [mood]);

  return (
    <div className={`${styles.page} ${themeClass}`}>
      <div className={styles.backgroundGlow} aria-hidden="true" />
      <div className={styles.starField} aria-hidden="true" />

      <nav className={`${styles.navBar} ${flow ? styles.navHidden : ""}`} aria-label="Primary">
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

      {/* Flow toggle */}
      <button
        type="button"
        className={styles.flowToggle}
        onClick={() => setFlow((f) => !f)}
        aria-pressed={flow}
      >
        {flow ? "Exit Flow" : "Flow Mode"}
      </button>

      {/* Theme overlay fade */}
      <div
        className={`${styles.themeOverlay} ${showThemeOverlay ? styles.themeOverlayVisible : ""}`}
        aria-hidden
        style={{ background: mood === "space" ? "rgba(88, 66, 255, 0.12)" : mood === "forest" ? "rgba(94, 179, 126, 0.12)" : mood === "arctic" ? "rgba(173, 232, 244, 0.12)" : mood === "warm" ? "rgba(248, 145, 145, 0.12)" : "rgba(255, 204, 153, 0.12)" }}
      />

      {/* Mood decorations (hidden in Flow Mode) */}
      {!flow && <Decorations mood={mood} />}

      {/* Mood bar (hidden in flow to reduce UI) */}
      {!flow && (
        <div className={styles.moodBar} role="group" aria-label="Select mood">
          <button className={styles.moodButton} aria-pressed={mood === "sunrise"} onClick={() => handleMoodChange("sunrise")}>🌅 Sunrise</button>
          <button className={styles.moodButton} aria-pressed={mood === "space"} onClick={() => handleMoodChange("space")}>🌌 Space</button>
          <button className={styles.moodButton} aria-pressed={mood === "forest"} onClick={() => handleMoodChange("forest")}>🌿 Forest</button>
          <button className={styles.moodButton} aria-pressed={mood === "arctic"} onClick={() => handleMoodChange("arctic")}>❄ Arctic</button>
          <button className={styles.moodButton} aria-pressed={mood === "warm"} onClick={() => handleMoodChange("warm")}>🔥 Warm</button>
        </div>
      )}

      <section className={styles.playfield}>
        <BubbleField bubbleColors={themedPalette} onScoreChange={handleScoreChange} flow={flow} />
      </section>
    </div>
  );
}
