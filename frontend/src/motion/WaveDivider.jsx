import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated SVG wave used as a section divider (e.g. bottom of dark heroes).
 * Two layered paths drift horizontally at different speeds.
 */
export default function WaveDivider({ fill = '#ffffff', flip = false, height = 70, className = '' }) {
  const reduced = useReducedMotion();

  const Path = ({ d, opacity, dur, delay = 0 }) => (
    <motion.path
      d={d}
      fill={fill}
      fillOpacity={opacity}
      animate={reduced ? undefined : { x: [0, -160, 0] }}
      transition={reduced ? undefined : { duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
    />
  );

  return (
    <div
      className={`wave-divider ${className}`}
      style={{ transform: flip ? 'rotate(180deg)' : undefined, height }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" width="100%" height="100%">
        <Path
          d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,45 L1440,80 L0,80 Z"
          opacity={0.5}
          dur={12}
        />
        <Path
          d="M0,52 C280,20 520,80 760,50 C1000,20 1240,70 1440,44 L1440,80 L0,80 Z"
          opacity={1}
          dur={9}
        />
      </svg>
    </div>
  );
}
