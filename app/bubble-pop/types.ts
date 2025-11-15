export type BubbleInstance = {
  id: string;
  size: number;
  color: string;
  x: number;
  y: number;
  floatDuration: number;
  swayDuration: number;
  driftX: number;
  opacity: number;
  blur: number;
  isDanger: boolean;
  points: number;
};

export type BurstInstance = {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
};
