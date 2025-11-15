# Bubble Pop Universe

Calming, therapy-style browser game where you pop infinite pastel bubbles, dodge pulsing red hazards, and chase a chill high-score loop with silky motion graphics and soft audio.

## Features

- Infinite bubble spawning with responsive density across desktop/tablet/mobile
- Pop animations with particle bursts, ambient + pop audio (Howler.js)
- Score & high score tracking stored in `localStorage`
- Danger bubbles (red) penalize heavy points; safe bubbles grant progress
- Minimal Relax Mode UI with sound toggle, scoreboard, and starfield backdrop

## Tech Stack

- Next.js 16 (App Router, React 19)
- TypeScript + SCSS Modules
- Framer Motion for animations
- Howler.js for audio

## Local Development

> **Node requirement:** Next.js 16 needs Node.js **≥20.9.0**.

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/bubble-pop` to play. Use `npm run lint` to verify formatting/linting.

## Deployment

Standard Next.js deploy targets (Vercel, Netlify, etc.) work out-of-the-box. Ensure the `/public/sounds/*.wav` assets are included. Continuous deployment can simply run `npm run build`.
