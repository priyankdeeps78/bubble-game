"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { BubbleField } from "./components/BubbleField";
import { SoundToggle } from "./components/SoundToggle";
import { ScorePanel } from "./components/ScorePanel";
import { soundManager } from "./utils/soundManager";
import { AmbientSelector } from "./components/AmbientSelector";
import { Fireflies } from "./components/Fireflies";

const pastelPalette = [
  "#f8b4d9",
  "#f7d3ba",
  "#c8e9ff",
  "#d4c5ff",
  "#b4f8c8",
  "#ffd6e0",
];

const SCORE_KEY = "bubble-pop-high-score";

export default function BubblePopPage() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [flow, setFlow] = useState(false);
  const [night, setNight] = useState(false);
  const [vw, setVw] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [vh, setVh] = useState<number>(typeof window !== "undefined" ? window.innerHeight : 800);

  useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Dense fill based on area, clamped
  const baseFireflies = Math.round((vw * vh) / 4500);
  const fireflyCount = Math.min(840, Math.max(240, baseFireflies * 2));

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(SCORE_KEY));
      if (!Number.isNaN(stored)) setHighScore(stored);
    } catch {}
  }, []);

  useEffect(() => {
    soundManager.setFlow(flow);
  }, [flow]);

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
    <div className={`${styles.page} ${night ? styles.night : ""}`}>
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
            <AmbientSelector />
            <SoundToggle />
          </div>
        </div>
      </nav>

      {/* Toggles */}
      <button type="button" className={styles.flowToggle} onClick={() => setFlow((f) => !f)} aria-pressed={flow}>
        {flow ? "Exit Flow" : "Flow Mode"}
      </button>
      <button
        type="button"
        className={styles.flowToggle}
        onClick={() => setNight((n) => !n)}
        aria-pressed={night}
        style={{ right: 112 }}
      >
        {night ? "Exit Night" : "Night Mode"}
      </button>

      {/* Overlays */}
      {flow && <div className={styles.flowOverlay} aria-hidden="true" />}
      {night && !flow && <Fireflies enabled count={fireflyCount} />}

      <section className={styles.playfield}>
        <BubbleField bubbleColors={pastelPalette} onScoreChange={handleScoreChange} flow={flow} />
      </section>
    </div>
  );
}
