"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import styles from "../styles.module.scss";
import type { BurstInstance } from "../types";
import { clamp, randomBetweenFloat } from "../utils/random";

type Particle = {
  id: string;
  dx: number;
  dy: number;
  delay: number;
  size: number;
};

export function ParticleBurst({ burst }: { burst: BurstInstance }) {
  const intensity = clamp(burst.size / 200, 0.5, 2);

  const particles = useMemo<Particle[]>(() => {
    const base = 8;
    const count = Math.floor(base * intensity + randomBetweenFloat(0, 6));
    return Array.from({ length: count }, (_, index) => {
      const angle = randomBetweenFloat(0, Math.PI * 2);
      const distance = randomBetweenFloat(30 * intensity, 110 * intensity);
      return {
        id: `${burst.id}-p-${index}`,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        delay: randomBetweenFloat(0, 0.06),
        size: randomBetweenFloat(3 * Math.cbrt(intensity), 8 * Math.cbrt(intensity)),
      };
    });
  }, [burst.id, intensity]);

  const showRing = intensity >= 0.9;
  const ringSize = Math.min(420, Math.max(120, burst.size * 2.2));

  return (
    <div
      className={styles.particleBurst}
      style={{
        left: burst.x - burst.size / 2,
        top: burst.y - burst.size / 2,
      }}
    >
      {showRing && (
        <motion.span
          aria-hidden
          style={{
            position: "absolute",
            left: -ringSize / 2 + burst.size / 2,
            top: -ringSize / 2 + burst.size / 2,
            width: ringSize,
            height: ringSize,
            borderRadius: 9999,
            border: "2px solid rgba(255,255,255,0.5)",
            boxShadow: "0 0 50px rgba(255,255,255,0.35)",
          }}
          initial={{ scale: 0.25, opacity: 0.45 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        />
      )}

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={styles.particle}
          style={{
            width: particle.size,
            height: particle.size,
            background: burst.color,
          }}
          initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
          animate={{
            x: particle.dx,
            y: particle.dy,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: 0.48,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
