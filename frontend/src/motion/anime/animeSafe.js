// Imperative equivalent of useMotionSafe()'s `reduced` flag (presets.js) for the
// anime.js effects here, which run outside framer's render props.
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
