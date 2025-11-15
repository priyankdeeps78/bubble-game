"use client";

import styles from "../styles.module.scss";

type ScorePanelProps = {
  score: number;
  highScore: number;
};

export function ScorePanel({ score, highScore }: ScorePanelProps) {
  return (
    <div className={styles.scorePanel}>
      <div>
        <p className={styles.scoreLabel}>Score</p>
        <p className={styles.scoreValue}>{score.toLocaleString()}</p>
      </div>
      <div>
        <p className={styles.scoreLabel}>High</p>
        <p className={styles.scoreValue}>{highScore.toLocaleString()}</p>
      </div>
    </div>
  );
}
