import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './presets.js';
import useReveal from './useReveal.js';

const REEL = Array.from({ length: 30 }, (_, i) => i % 10); // 0-9 x3
const SPIN = 20; // full rotations before landing

/**
 * Rolling-digit odometer. When it scrolls into view each digit reel spins
 * up from 0 to its target value, cascading left to right.
 *
 * Drop-in for the old <Counter>: same `value` / `suffix` props.
 */
export default function Odometer({ value, suffix = '', prefix = '', className = 'stat__value' }) {
  const [ref, show] = useReveal({ amount: 0.5 });
  const reduced = useReducedMotion();
  const chars = value.toLocaleString().split('');

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value.toLocaleString()}${suffix}`}>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      <span
        aria-hidden="true"
        style={{ display: 'inline-flex', alignItems: 'flex-end', verticalAlign: 'bottom' }}
      >
        {chars.map((ch, i) => {
          if (!/\d/.test(ch)) {
            return (
              <span key={i} style={{ display: 'inline-block' }}>
                {ch}
              </span>
            );
          }
          const digit = Number(ch);
          const offset = show ? SPIN + digit : 0;
          return (
            <span key={i} style={{ display: 'inline-block', height: '1em', overflow: 'hidden', lineHeight: 1 }}>
              <motion.span
                style={{ display: 'flex', flexDirection: 'column' }}
                initial={{ y: '0em' }}
                animate={{ y: `${-offset}em` }}
                transition={
                  reduced ? { duration: 0 } : { duration: 1.1 + i * 0.15, ease: EASE_OUT, delay: 0.1 }
                }
              >
                {REEL.map((n, k) => (
                  <span key={k} style={{ height: '1em' }}>
                    {n}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
      </span>
      {suffix && <span aria-hidden="true">{suffix}</span>}
    </span>
  );
}
