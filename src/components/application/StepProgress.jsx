import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * Animated wizard progress indicator.
 * @param {{key:string,label:string}[]} steps
 * @param {number} current  index of the active step
 */
export default function StepProgress({ steps, current }) {
  return (
    <ol className="stepper" aria-label="Application progress">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo';
        return (
          <li key={s.key} className={`stepper__step is-${state}`} aria-current={i === current ? 'step' : undefined}>
            <span className="stepper__dot" aria-hidden="true">
              {state === 'done' ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <Check />
                </motion.span>
              ) : (
                <span className="stepper__num">{String(i + 1).padStart(2, '0')}</span>
              )}
            </span>
            <span className="stepper__label">{s.label}</span>
            {i < steps.length - 1 && (
              <span className="stepper__bar" aria-hidden="true">
                <motion.span
                  className="stepper__bar-fill"
                  initial={false}
                  animate={{ scaleX: i < current ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
