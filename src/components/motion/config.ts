export const cinematicTransition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const, // Standard cinematic ease
};

export const slowCinematicTransition = {
  duration: 1.2,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const snappyTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as const,
};
