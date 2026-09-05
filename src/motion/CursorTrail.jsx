import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const DOTS = 3;

/**
 * A short string of dots that chase the cursor, each lagging a little more
 * than the last. Desktop + fine-pointer only, off for reduced-motion.
 */
export default function CursorTrail() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return undefined;
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
    <>
      {Array.from({ length: DOTS }).map((_, i) => (
        <TrailDot key={i} x={x} y={y} index={i} />
      ))}
    </>
  );
}

function TrailDot({ x, y, index }) {
  const stiffness = 380 - index * 55;
  const dx = useSpring(x, { stiffness, damping: 22, mass: 0.5 });
  const dy = useSpring(y, { stiffness, damping: 22, mass: 0.5 });
  const scale = 1 - index * 0.16;
  return (
    <motion.div
      className="cursor-dot"
      aria-hidden="true"
      style={{ x: dx, y: dy, scale, opacity: 0.5 - index * 0.08 }}
    />
  );
}
