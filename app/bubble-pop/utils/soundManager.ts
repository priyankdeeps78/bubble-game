"use client";

import { Howl } from "howler";

const POP_SRC = "/sounds/pop.wav";
const AMBIENT_PRESETS = {
  rain: "/sounds/rain.wav",
  forest: "/sounds/forest.wav",
  cafe: "/sounds/cafe.wav",
  space: "/sounds/space.wav",
  bowls: "/sounds/bowls.wav",
  piano: "/sounds/piano.wav",
  waves: "/sounds/waves.wav",
} as const;
type AmbientKey = keyof typeof AMBIENT_PRESETS;

class SoundManager {
  private pop?: Howl;
  private ambient?: Howl;
  private enabled = true;
  private ambientEnabled = true;
  private flow = false;
  private ambientKey: AmbientKey = "space";

  setEnabled(nextEnabled: boolean) {
    this.enabled = nextEnabled;
    if (!nextEnabled) {
      this.pop?.stop();
      if (this.ambient) {
        this.ambient.fade(this.ambient.volume(), 0, 200);
      }
      return;
    }
    if (this.ambientEnabled) {
      const ambient = this.ensureAmbient();
      if (!ambient.playing()) {
        ambient.play();
      }
      this.applyAmbientVolume();
    }
  }

  setAmbient(shouldPlay: boolean) {
    this.ambientEnabled = shouldPlay;
    if (!shouldPlay) {
      this.ambient?.stop();
      return;
    }
    if (!this.enabled) return;
    const ambient = this.ensureAmbient();
    if (!ambient.playing()) {
      ambient.play();
    }
    this.applyAmbientVolume();
  }

  setFlow(isFlow: boolean) {
    this.flow = isFlow;
    this.applyAmbientVolume();
  }

  setAmbientPreset(key: AmbientKey) {
    if (this.ambientKey === key) return;
    this.ambientKey = key;
    const wasPlaying = !!this.ambient?.playing();
    // fade out old
    if (this.ambient) this.ambient.stop();
    this.ambient = undefined;
    if (wasPlaying && this.enabled && this.ambientEnabled) {
      const a = this.ensureAmbient();
      a.play();
      this.applyAmbientVolume();
    }
  }

  private applyAmbientVolume() {
    if (!this.ambient) return;
    const target = this.flow ? 0.14 : 0.1;
    this.ambient.volume(target);
  }

  playPop() {
    if (!this.enabled) return;
    const pop = this.ensurePop();
    // gentle duck ambient briefly
    this.duckAmbient();
    // Layer 1
    const id1 = pop.play();
    pop.rate(this.flow ? 0.9 : 0.92, id1);
    pop.volume(this.flow ? 0.16 : 0.22, id1);
    // Layer 2 slight offset
    setTimeout(() => {
      const id2 = pop.play();
      pop.rate(this.flow ? 1.05 : 1.1, id2);
      pop.volume(this.flow ? 0.12 : 0.18, id2);
    }, 12);
  }

  private duckAmbient() {
    if (!this.ambient) return;
    const current = this.ambient.volume();
    const down = Math.max(0, current - 0.02);
    this.ambient.volume(down);
    setTimeout(() => {
      if (this.ambient) this.ambient.volume(current);
    }, 140);
  }

  private ensurePop() {
    if (!this.pop) {
      this.pop = new Howl({
        src: [POP_SRC],
        volume: 0.28,
      });
    }
    return this.pop;
  }

  private ensureAmbient() {
    if (!this.ambient) {
      const src = AMBIENT_PRESETS[this.ambientKey];
      this.ambient = new Howl({ src: [src], volume: 0.1, loop: true });
    }
    return this.ambient;
  }
}

export const soundManager = new SoundManager();
