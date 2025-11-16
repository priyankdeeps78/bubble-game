"use client";

import { Howl } from "howler";

const POP_SRC = "/sounds/pop.wav";
const AMBIENT_SRC = "/sounds/ambient.wav";

class SoundManager {
  private pop?: Howl;
  private ambient?: Howl;
  private enabled = true;
  private ambientEnabled = true;
  private ambientBase = 0.1;

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
      ambient.volume(this.ambientBase);
      if (!ambient.playing()) {
        ambient.play();
      }
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
    ambient.volume(this.ambientBase);
    if (!ambient.playing()) {
      ambient.play();
    }
  }

  setAmbientIntensity(volume: number) {
    this.ambientBase = volume;
    if (this.ambient) {
      this.ambient.volume(volume);
    }
  }

  playPop() {
    if (!this.enabled) return;
    const pop = this.ensurePop();
    // Layer 1
    const id1 = pop.play();
    pop.rate(0.92, id1);
    pop.volume(0.22, id1);
    // Layer 2 slight offset
    setTimeout(() => {
      const id2 = pop.play();
      pop.rate(1.1, id2);
      pop.volume(0.18, id2);
    }, 12);
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
      this.ambient = new Howl({
        src: [AMBIENT_SRC],
        volume: this.ambientBase,
        loop: true,
      });
    }
    return this.ambient;
  }
}

export const soundManager = new SoundManager();
