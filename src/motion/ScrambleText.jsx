import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import useReveal from './useReveal.js';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*<>/\\';

/**
 * "Decodes" its text when scrolled into view: each character churns through
 * random glyphs and then locks into place, left to right.
 *
 * Good for short punchy strings — eyebrow labels, badges, kickers.
 */
export default function ScrambleText({ text, as: Tag = 'span', className, speed = 26, lockStep = 1 }) {
  const [ref, show] = useReveal({ amount: 0.6, fallbackMs: 1200 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : '');
  const frame = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    if (reduced || !show || started.current) return undefined;
    started.current = true;
    const target = String(text);
    let raf;
    const tick = () => {
      const locked = Math.floor(frame.current / lockStep);
      const out = target
        .split('')
        .map((ch, i) => {
          if (i < locked || ch === ' ') return ch;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join('');
      setDisplay(out);
      frame.current += 1;
      if (locked <= target.length) {
        raf = setTimeout(() => requestAnimationFrame(tick), speed);
      } else {
        setDisplay(target);
      }
    };
    tick();
    return () => clearTimeout(raf);
  }, [show, reduced, text, speed, lockStep]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display || ' '}</span>
    </Tag>
  );
}
