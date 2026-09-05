import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Scroll-into-view detector with a safety net.
 *
 * Returns `[ref, show]`. `show` flips true when the element scrolls into view,
 * OR after `fallbackMs` no matter what — so content can never stay stuck
 * hidden if IntersectionObserver misbehaves (headless capture, disabled
 * observers, elements already on-screen before observe, …).
 */
export default function useReveal({ amount = 0.15, once = true, fallbackMs = 2000 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, amount });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setForced(true), fallbackMs);
    return () => clearTimeout(t);
  }, [fallbackMs]);

  return [ref, inView || forced];
}
