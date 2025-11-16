"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles.module.scss";

export function RippleOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.rippleOverlay}
          style={{
            // could parametrize x/y in future
            // @ts-expect-error custom css var
            "--ripple-x": "50%",
            // @ts-expect-error custom css var
            "--ripple-y": "50%",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1.3 }}
          exit={{ opacity: 0, scale: 1.6 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </AnimatePresence>
  );
}
