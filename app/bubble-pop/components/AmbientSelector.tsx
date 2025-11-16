"use client";

import { useEffect, useState } from "react";
import { soundManager } from "../utils/soundManager";

const STORAGE_KEY = "bubble-pop-ambient";

type Preset = {
  key: "rain" | "forest" | "cafe" | "space" | "bowls" | "piano" | "waves";
  label: string;
};

const PRESETS: Preset[] = [
  { key: "rain", label: "Rain" },
  { key: "forest", label: "Forest" },
  { key: "cafe", label: "Coffee" },
  { key: "space", label: "Space" },
  { key: "bowls", label: "Bowls" },
  { key: "piano", label: "Piano" },
  { key: "waves", label: "Waves" },
];

export function AmbientSelector() {
  const [value, setValue] = useState<Preset["key"]>("space");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Preset["key"] | null;
      if (saved) {
        setValue(saved);
        soundManager.setAmbientPreset(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    soundManager.setAmbientPreset(value);
  }, [value]);

  return (
    <select
      aria-label="Ambient soundscape"
      value={value}
      onChange={(e) => setValue(e.target.value as Preset["key"])}
      style={{
        appearance: "none",
        WebkitAppearance: "none",
        background: "rgba(12,16,32,0.6)",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 999,
        padding: "6px 10px",
        fontSize: "0.85rem",
        backdropFilter: "blur(6px)",
      }}
    >
      {PRESETS.map((p) => (
        <option key={p.key} value={p.key}>
          {p.label}
        </option>
      ))}
    </select>
  );
}
