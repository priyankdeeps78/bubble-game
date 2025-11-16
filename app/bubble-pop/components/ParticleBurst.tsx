"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import styles from "../styles.module.scss";
import type { BurstInstance } from "../types";
import { randomBetweenFloat, randomPastel, randomWarmPastel } from "../utils/random";

type Particle = {
  id: string;
  dx: number;
  dy: number;
  delay: number;
  size: number;
  color: string;
};

export function ParticleBurst({ burst, flow = false }: { burst: BurstInstance; flow?: boolean }) {
  // Normalized size factor: ~1.0 around 60px bubbles, larger > 1, tiny < 1
  const magnitude = Math.max(0.6, Math.min(3, burst.size / 60));

  const particles = useMemo<Particle[]>(() => {
    const baseCount = randomBetweenFloat(6, 10) * (flow ? 0.9 : 1);
    const count = Math.floor(baseCount * (0.8 + magnitude * 0.6));
    return Array.from({ length: count }, (_, index) => {
      const angle = randomBetweenFloat(0, Math.PI * 2);
      const distance = (randomBetweenFloat(28, 70) * (0.8 + magnitude * 0.8)) * (flow ? 0.85 : 1);
      return {
        id: `${burst.id}-p-${index}`,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        delay: randomBetweenFloat(0, 0.05 * Math.min(1.5, magnitude)),
        size: randomBetweenFloat(3, 8) * (0.8 + magnitude * 0.5),
        color: flow ? randomWarmPastel() : randomPastel(),
      };
    });
  }, [burst.id, magnitude, flow]);

  const duration = Math.min(0.65, 0.35 + magnitude * 0.15) * (flow ? 1.05 : 1);

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
            background: particle.color,
          }}
          initial={{ x: 0, y: 0, opacity: 0.95, scale: 1 }}
          animate={{
            x: particle.dx,
            y: particle.dy,
            opacity: 0,
            scale: 0.3,
          }}
          transition={{
            duration,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
