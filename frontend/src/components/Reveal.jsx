import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from '../motion/presets.js';

/**
 * Scroll-reveal wrapper used across every page. Fades + lifts (or slides /
 * un-blurs / scales) children into view once.
 *
 * A safety timer forces the visible state after a few seconds so content can
 * never stay permanently hidden if IntersectionObserver behaves unexpectedly
 * (headless screenshots, disabled observers, etc).
 *
 * @param {'up'|'down'|'left'|'right'|'none'} dir  entrance direction
 * @param {number} y         legacy distance prop (maps to `distance`)
 * @param {boolean} blur     un-blur on entrance
 * @param {number} scale     starting scale (e.g. 0.94 for a pop)
 */
export default function Reveal({
  children,
  delay = 0,
  y,
  distance = 24,
  dir = 'up',
  blur = true,
  scale = 1,
  duration = 0.6,
  once = true,
  amount = 0.15,
  as = 'div',
  className
}) {
  const MotionTag = motion[as] || motion.div;
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount });
  const reduced = useReducedMotion();
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setForced(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const show = inView || forced;
  const d = typeof y === 'number' ? y : distance;

  const offset = () => {
    if (reduced || dir === 'none') return {};
    if (dir === 'down') return { y: -d };
    if (dir === 'left') return { x: d };
    if (dir === 'right') return { x: -d };
    return { y: d };
  };

  const hidden = {
    opacity: 0,
    scale: reduced ? 1 : scale,
    filter: blur && !reduced ? 'blur(6px)' : 'blur(0px)',
    ...offset()
  };
  const visible = { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' };

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={hidden}
      animate={show ? visible : hidden}
      transition={{ duration: reduced ? 0.2 : duration, delay: inView ? delay : 0, ease: EASE_OUT }}
    >
      {children}
    </MotionTag>
  );
}
