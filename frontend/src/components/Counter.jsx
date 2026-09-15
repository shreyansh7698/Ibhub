import { useEffect, useRef, useState } from 'react';

/**
 * Animated number that counts up once when scrolled into view.
 */
export default function Counter({ value, suffix = '', duration = 1600 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);

    // Safety net: if the observer never fires (headless capture, odd layouts),
    // run the count-up anyway after a short delay.
    const fallback = setTimeout(() => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 2600);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="stat__value">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
