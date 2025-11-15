"use client";

import { Howl } from "howler";

const POP_SRC = "/sounds/pop.wav";
const AMBIENT_SRC = "/sounds/ambient.wav";

class SoundManager {
  private pop?: Howl;
  private ambient?: Howl;
  private enabled = true;
  private ambientEnabled = true;

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
  }

  playPop() {
    if (!this.enabled) return;
    this.ensurePop().play();
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
        volume: 0.1,
        loop: true,
      });
    }
    return this.ambient;
  }
}

export const soundManager = new SoundManager();
