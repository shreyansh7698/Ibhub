import { useState, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { spring } from './presets.js';

/**
 * Animated tooltip. Wraps a single interactive child; shows `label` on
 * hover / focus with a spring pop.
 */
export default function Tooltip({ label, children, side = 'top' }) {
  const [open, setOpen] = useState(false);
  const id = useId();

  const pos =
    side === 'bottom'
      ? { top: '100%', marginTop: 8 }
      : side === 'left'
        ? { right: '100%', marginRight: 8, top: '50%', y: '-50%' }
        : side === 'right'
          ? { left: '100%', marginLeft: 8, top: '50%', y: '-50%' }
          : { bottom: '100%', marginBottom: 8 };

  return (
    <span
      className="tooltip-wrap"
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={() => setOpen(false)}
      aria-describedby={open ? id : undefined}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            className="tooltip"
            initial={{ opacity: 0, scale: 0.85, y: side === 'top' ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: pos.y || 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={spring.snappy}
            style={{ position: 'absolute', left: '50%', translateX: '-50%', whiteSpace: 'nowrap', ...pos }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
