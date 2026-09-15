import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

/**
 * Pins a tall wrapper and translates its row of children horizontally as the
 * user scrolls past. The scroll distance and travel are measured from the actual
 * content width, so the row lands exactly on the last panel regardless of how
 * many children or how wide the viewport is. On reduced-motion / small screens
 * it degrades to a normal horizontal-scroll strip (handled in CSS).
 */
export default function HorizontalScroll({ children, className = '' }) {
  const ref = useRef(null);
  const trackRef = useRef(null);
  const reduced = useReducedMotion();
  const [distance, setDistance] = useState(0);
  const count = Children.count(children);

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = track?.parentElement;
    if (!track || !viewport) return;
    // How far the row must slide left so its right edge meets the viewport's.
    const overflow = track.scrollWidth - viewport.offsetWidth;
    setDistance(Math.max(0, Math.round(overflow)));
  }, []);

  useLayoutEffect(() => {
    if (reduced) return undefined;
    measure();
    const track = trackRef.current;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && track) {
      ro.observe(track);
      if (track.parentElement) ro.observe(track.parentElement);
    }
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, reduced, count]);

  // Re-measure once images/fonts settle.
  useEffect(() => {
    if (reduced) return undefined;
    const id = window.setTimeout(measure, 300);
    return () => window.clearTimeout(id);
  }, [measure, reduced]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const x = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.4 });

  if (reduced) {
    return (
      <div className={`hscroll hscroll--static ${className}`}>
        <div className="hscroll__track">{children}</div>
      </div>
    );
  }

  return (
    <section
      ref={ref}
      className={`hscroll ${className}`}
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="hscroll__sticky">
        <motion.div ref={trackRef} className="hscroll__track" style={{ x }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}
