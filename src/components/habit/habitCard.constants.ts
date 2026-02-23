export const SWIPE_COMPLETE_THRESHOLD_RATIO = 0.4;
export const MAX_SWIPE_RATIO = 0.72;

export const PRESS_SCALE_ACTIVE = 0.97;

export const SWIPE_SPRING_CONFIG = {
  damping: 20,
  stiffness: 210,
  mass: 0.6,
} as const;

export const PRESS_SPRING_CONFIG = {
  damping: 18,
  stiffness: 260,
  mass: 0.5,
} as const;

export const COMPLETION_SPRING_CONFIG = {
  damping: 16,
  stiffness: 190,
  mass: 0.7,
} as const;
