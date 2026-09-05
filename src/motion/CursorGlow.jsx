import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Site-wide soft spotlight that trails the cursor with a springy lag.
 * Purely decorative, fixed, non-interactive. Desktop + fine-pointer only.
 */
export default function CursorGlow() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useSpring(useMotionValue(-500), { stiffness: 120, damping: 20, mass: 0.6 });
  const y = useSpring(useMotionValue(-500), { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduced) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;
    setEnabled(true);
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, [reduced, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="cursor-glow"
      aria-hidden="true"
      style={{ x, y }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    />
  );
}
