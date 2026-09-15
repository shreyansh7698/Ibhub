import { motion } from 'framer-motion';
import { spring } from './presets.js';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { delay: 0.15 + i * 0.2, duration: 0.5, ease: 'easeInOut' }, opacity: { delay: 0.15 + i * 0.2, duration: 0.01 } }
  })
};

/** Animated tick inside a popping circle — for form / payment success. */
export function SuccessCheck({ size = 64, stroke = '#067647', ring = '#abefc6' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      initial="hidden"
      animate="show"
      role="img"
      aria-label="Success"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke={ring}
        strokeWidth="3"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={spring.bouncy}
        style={{ originX: '50%', originY: '50%' }}
      />
      <motion.path
        d="M14 27 l8 8 l16 -18"
        fill="none"
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={draw}
      />
    </motion.svg>
  );
}

/** Animated cross for error states — draws in then shakes. */
export function ErrorCross({ size = 64, stroke = '#e5484d', ring = '#f8b4b7' }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 52 52"
      initial="hidden"
      animate="show"
      role="img"
      aria-label="Error"
      style={{ x: 0 }}
    >
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke={ring}
        strokeWidth="3"
        initial={{ scale: 0 }}
        animate={{ scale: 1, x: [0, -5, 5, -3, 3, 0] }}
        transition={{ scale: spring.bouncy, x: { delay: 0.5, duration: 0.4 } }}
        style={{ originX: '50%', originY: '50%' }}
      />
      <motion.path d="M18 18 L34 34" stroke={stroke} strokeWidth="4" strokeLinecap="round" variants={draw} custom={0} />
      <motion.path d="M34 18 L18 34" stroke={stroke} strokeWidth="4" strokeLinecap="round" variants={draw} custom={1} />
    </motion.svg>
  );
}

/** Three bouncing dots — inline loading indicator. */
export function LoadingDots({ color = 'currentColor', size = 8 }) {
  return (
    <span style={{ display: 'inline-flex', gap: size * 0.7, alignItems: 'center' }} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'block' }}
          animate={{ y: [0, -size, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 }}
        />
      ))}
    </span>
  );
}

/** Gently floating illustrative blob for empty / 404 states. */
export function FloatBlob({ children, className }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -14, 0], rotate: [0, 1.5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
