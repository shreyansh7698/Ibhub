import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { spring } from './presets.js';

/**
 * Wrapper that makes its child gently follow the cursor while hovered,
 * then springs back on leave. Great for hero CTAs and icon buttons.
 *
 * Renders a <motion.span> by default (inline). Pass `as="div"` for blocks.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  radius = 120,
  as = 'span',
  className,
  ...rest
}) {
  const MotionTag = motion[as] || motion.span;
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const x = useSpring(useMotionValue(0), spring.gentle);
  const y = useSpring(useMotionValue(0), spring.gentle);

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.hypot(relX, relY);
    const falloff = Math.max(0, 1 - dist / (radius + rect.width / 2));
    x.set(relX * strength * falloff);
    y.set(relY * strength * falloff);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionTag
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y, display: as === 'span' ? 'inline-block' : undefined }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
