const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

export const randomInt = (min: number, max: number) =>
  Math.floor(randomBetween(min, max + 1));

export const randomPastel = () => {
  const hue = randomInt(0, 360);
  const saturation = randomInt(60, 85);
  const lightness = randomInt(55, 75);
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
