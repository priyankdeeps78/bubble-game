"use client";

import styles from "../styles.module.scss";

type Mood = "sunrise" | "space" | "forest" | "arctic" | "warm";

export function Decorations({ mood }: { mood: Mood }) {
  return (
    <div className={styles.decorations} aria-hidden>
      {mood === "sunrise" || mood === "warm" ? (
        <>
          <div className={styles.sun} />
          <div className={`${styles.cloud} ${styles.cloudOne}`} />
          <div className={`${styles.cloud} ${styles.cloudTwo}`} />
          <div className={`${styles.cloud} ${styles.cloudThree}`} />
        </>
      ) : null}

      {mood === "space" ? (
        <>
          <div className={styles.planet} />
          <div className={`${styles.planet} ${styles.planetSmall}`} />
          <div className={styles.nebulaGlow} />
        </>
      ) : null}

      {mood === "forest" ? (
        <>
          <div className={`${styles.tree} ${styles.treeLeft}`} />
          <div className={`${styles.tree} ${styles.treeRight}`} />
          <div className={`${styles.leaf} ${styles.leafOne}`} />
          <div className={`${styles.leaf} ${styles.leafTwo}`} />
          <div className={`${styles.leaf} ${styles.leafThree}`} />
        </>
      ) : null}

      {mood === "arctic" ? (
        <>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className={styles.snow} style={{
              left: `${(i * 7) % 100}%`,
              animationDelay: `${(i % 10) * 0.4}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }} />
          ))}
        </>
      ) : null}
    </div>
  );
}
