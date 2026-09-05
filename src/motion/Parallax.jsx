import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Scroll-linked parallax. `speed` > 0 moves the element slower than the page
 * (drifts down), `speed` < 0 moves it faster (drifts up).
 *
 * @param {number} speed  -1 … 1 (fraction of travel distance)
 */
export default function Parallax({
  children,
  speed = 0.2,
  axis = 'y',
  className,
  as = 'div',
  style,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Drive `y` straight off the scroll value — framer already samples it on rAF.
  // A spring on top of a scroll-linked value re-settles on every wheel tick,
  // which reads as judder while scrolling.
  const range = 120 * speed;
  const value = useTransform(scrollYProgress, [0, 1], [range, -range]);

  return (
    <MotionTag
      ref={ref}
      className={className}
      onViewportEnter={() => setInView(true)}
      onViewportLeave={() => setInView(false)}
      style={{ ...style, [axis]: reduced ? 0 : value, willChange: inView ? 'transform' : 'auto' }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
