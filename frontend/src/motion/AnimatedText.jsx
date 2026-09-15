import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_OUT } from './presets.js';
import useReveal from './useReveal.js';

/**
 * Reveals text word-by-word (rising + un-blurring) when it scrolls into view.
 * Falls back to a plain fade for reduced-motion users, and to visible after a
 * short timeout if it is never observed entering the viewport.
 *
 * @param {string} text
 * @param {string} as   heading/'p'/'span' tag to render
 */
export default function AnimatedText({
  text,
  as = 'span',
  className,
  delay = 0,
  stagger = 0.045,
  once = true
}) {
  const MotionTag = motion[as] || motion.span;
  const [ref, show] = useReveal({ amount: 0.4, once, fallbackMs: 1600 });
  const reduced = useReducedMotion();
  const words = String(text).split(' ');

  if (reduced) {
    const Tag = as;
    return (
      <Tag ref={ref} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      style={{ display: 'inline-block' }}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } }
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
            aria-hidden="true"
          >
            <motion.span
              style={{ display: 'inline-block', willChange: 'transform' }}
              variants={{
                hidden: { y: '115%', opacity: 0, filter: 'blur(8px)' },
                show: {
                  y: 0,
                  opacity: 1,
                  filter: 'blur(0px)',
                  transition: { duration: 0.55, ease: EASE_OUT }
                }
              }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
