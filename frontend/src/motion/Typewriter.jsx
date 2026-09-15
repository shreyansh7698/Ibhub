import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import useReveal from './useReveal.js';

/**
 * Typewriter effect. Types `text` (string) once on view, or cycles through an
 * array of strings (type → pause → delete → next), with a blinking caret.
 */
export default function Typewriter({
  text,
  as: Tag = 'span',
  className,
  speed = 45,
  pause = 1400,
  loop = true,
  caret = true
}) {
  const phrases = Array.isArray(text) ? text : [text];
  const [ref, show] = useReveal({ amount: 0.5, fallbackMs: 1200 });
  const reduced = useReducedMotion();
  const [out, setOut] = useState('');
  const state = useRef({ p: 0, i: 0, del: false });

  useEffect(() => {
    if (reduced) {
      setOut(phrases[0]);
      return undefined;
    }
    if (!show) return undefined;
    let t;
    const step = () => {
      const s = state.current;
      const full = phrases[s.p % phrases.length];
      if (!s.del) {
        s.i += 1;
        setOut(full.slice(0, s.i));
        if (s.i === full.length) {
          if (phrases.length === 1 && !loop) return;
          t = setTimeout(() => {
            s.del = true;
            step();
          }, pause);
          return;
        }
      } else {
        s.i -= 1;
        setOut(full.slice(0, s.i));
        if (s.i === 0) {
          s.del = false;
          s.p += 1;
        }
      }
      t = setTimeout(step, s.del ? speed / 2 : speed);
    };
    step();
    return () => clearTimeout(t);
  }, [show, reduced]);

  return (
    <Tag ref={ref} className={className} aria-label={phrases.join(' / ')}>
      <span aria-hidden="true">{out}</span>
      {caret && !reduced && <span className="tw-caret" aria-hidden="true" />}
    </Tag>
  );
}
