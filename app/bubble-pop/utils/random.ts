const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number) =>
  Math.floor(randomBetween(min, max + 1));

export const randomPastel = () => {
  const hue = randomInt(0, 360);
  const saturation = randomInt(60, 85);
  const lightness = randomInt(55, 75);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

export const randomWarmPastel = () => {
  // Prefer reds/oranges/pinks: 350-20 and 20-60 ranges
  const ranges = [
    [350, 360],
    [0, 20],
    [20, 60],
  ] as const;
  const r = ranges[randomInt(0, ranges.length - 1)];
  const hue = r[0] <= r[1] ? randomInt(r[0], r[1]) : randomInt(0, 20);
  const saturation = randomInt(60, 85);
  const lightness = randomInt(60, 78);
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
};

export const randomId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const randomSign = () => (Math.random() > 0.5 ? 1 : -1);

export const maybe = (probability: number) => Math.random() < probability;

export const randomBetweenFloat = randomBetween;
