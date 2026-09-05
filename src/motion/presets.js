import { useReducedMotion } from 'framer-motion';

/**
 * Shared motion vocabulary for the whole site.
 * Every component pulls its variants / transitions from here so the
 * animation language stays consistent across pages.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT = [0.65, 0, 0.35, 1];

export const spring = {
  soft: { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 420, damping: 30 },
  bouncy: { type: 'spring', stiffness: 500, damping: 18, mass: 0.7 },
  gentle: { type: 'spring', stiffness: 120, damping: 20 }
};

/* ---------- Scroll / entrance variants ---------- */

const offset = (dir, d) => {
  switch (dir) {
    case 'up':
      return { y: d };
    case 'down':
      return { y: -d };
    case 'left':
      return { x: d };
    case 'right':
      return { x: -d };
    default:
      return {};
  }
};

export const revealVariants = ({ dir = 'up', distance = 26, blur = true, scale = 1 } = {}) => ({
  hidden: {
    opacity: 0,
    filter: blur ? 'blur(6px)' : 'blur(0px)',
    scale,
    ...offset(dir, distance)
  },
  show: {
    opacity: 1,
    filter: 'blur(0px)',
    scale: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT }
  }
});

/* ---------- Stagger containers ---------- */

export const staggerContainer = (stagger = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren }
  }
});

export const staggerItem = {
  hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE_OUT }
  }
};

/* ---------- Page transitions ---------- */

export const pageVariants = {
  initial: { opacity: 0, y: 18, filter: 'blur(8px)' },
  enter: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: EASE_OUT, when: 'beforeChildren' }
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(8px)',
    transition: { duration: 0.28, ease: 'easeIn' }
  }
};

/* ---------- Interaction presets ---------- */

export const hoverLift = {
  whileHover: { y: -6, transition: spring.soft },
  whileTap: { scale: 0.97, transition: spring.snappy }
};

export const pressable = {
  whileHover: { scale: 1.04, transition: spring.soft },
  whileTap: { scale: 0.94, transition: spring.snappy }
};

/**
 * Returns variants that collapse to a simple fade when the user
 * prefers reduced motion.
 */
export function useMotionSafe() {
  const reduced = useReducedMotion();
  return {
    reduced,
    reveal: (opts) =>
      reduced
        ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
        : revealVariants(opts),
    item: reduced ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : staggerItem
  };
}
