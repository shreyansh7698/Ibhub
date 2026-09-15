import { motion } from 'framer-motion';
import useReveal from '../motion/useReveal.js';
import { spring, EASE_OUT } from '../motion/presets.js';
import DrawPath from '../motion/anime/DrawPath.jsx';

/**
 * Numbered process steps that animate in one card at a time as the list
 * scrolls into view: each card slides up, its number badge springs in, and
 * a connector line draws down the side.
 *
 * @param {{title: string, desc: string}[]} steps
 */
export default function ProcessSteps({ steps = [] }) {
  const [ref, show] = useReveal({ amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      className="process-steps"
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      variants={{ show: { transition: { staggerChildren: 0.16 } } }}
    >
      <DrawPath
        show={show}
        className="process-steps__rail"
        d="M1,0 L1,100"
        viewBox="0 0 2 100"
        strokeColor="var(--royal-600)"
        strokeWidth={2}
        duration={900}
        delay={150}
        ease="inOutQuad"
      />
      {steps.map((step, i) => (
        <motion.div
          className="process-step"
          key={step.title}
          variants={{
            hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
            show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_OUT } }
          }}
        >
          <motion.span
            className="process-step__num"
            aria-hidden="true"
            variants={{
              hidden: { scale: 0, rotate: -120 },
              show: { scale: 1, rotate: 0, transition: spring.bouncy }
            }}
            whileHover={{ scale: 1.12 }}
          >
            {i + 1}
          </motion.span>
          <div>
            <h4>{step.title}</h4>
            <p>{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
