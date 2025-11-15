"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import styles from "../styles.module.scss";
import type { BurstInstance } from "../types";
import { randomBetweenFloat } from "../utils/random";

type Particle = {
  id: string;
  dx: number;
  dy: number;
  delay: number;
  size: number;
};

export function ParticleBurst({ burst }: { burst: BurstInstance }) {
  const particles = useMemo<Particle[]>(() => {
    const count = Math.floor(randomBetweenFloat(5, 10));
    return Array.from({ length: count }, (_, index) => {
      const angle = randomBetweenFloat(0, Math.PI * 2);
      const distance = randomBetweenFloat(20, 60);
      return {
        id: `${burst.id}-p-${index}`,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        delay: randomBetweenFloat(0, 0.05),
        size: randomBetweenFloat(4, 9),
      };
    });
  }, [burst.id]);

  return (
    <div
      className={styles.particleBurst}
      style={{
        left: burst.x - burst.size / 2,
        top: burst.y - burst.size / 2,
      }}
    >
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={styles.particle}
          style={{
            width: particle.size,
            height: particle.size,
            background: burst.color,
          }}
          initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
          animate={{
            x: particle.dx,
            y: particle.dy,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
