export const EASINGS = {
  // Awwwards-standard cubic-beziers
  cinematic: [0.22, 1, 0.36, 1] as const,
  dramatic: [0.645, 0.045, 0.355, 1] as const,
  smoothOut: [0.16, 1, 0.3, 1] as const,
  gentle: [0.25, 0.1, 0.25, 1] as const,
};

export const SPRINGS = {
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  snappy: { stiffness: 260, damping: 20 },
  bouncy: { stiffness: 400, damping: 10 },
  magnetic: { stiffness: 150, damping: 15, mass: 0.1 },
  modal: { stiffness: 350, damping: 25 },
};

export const DURATIONS = {
  instant: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 0.8,
  epic: 1.2,
};
