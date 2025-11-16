"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles.module.scss";

export function FlowerBloom({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.flowerLayer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={styles.flower}
            initial={{ scale: 0.2, rotate: -20, opacity: 0.8 }}
            animate={{ scale: 1.1, rotate: 5, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
