import { motion } from 'framer-motion';
import AnimatedText from '../motion/AnimatedText.jsx';
import ScrambleText from '../motion/ScrambleText.jsx';
import useReveal from '../motion/useReveal.js';
import { spring, EASE_OUT } from '../motion/presets.js';
import DrawPath from '../motion/anime/DrawPath.jsx';

/**
 * Standard eyebrow + title + optional subtitle block for sections.
 */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', as: As = 'h2' }) {
  const [ref, show] = useReveal({ amount: 0.3 });

  return (
    <div ref={ref} className={`section-head ${align === 'left' ? 'section-head--left' : ''}`}>
      {eyebrow && (
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={spring.bouncy}
        >
          <ScrambleText text={eyebrow} />
        </motion.span>
      )}
      {typeof title === 'string' ? (
        <>
          <AnimatedText as={As} text={title} className="section-head__title" delay={0.05} />
          <DrawPath
            show={show}
            className={`section-head__underline ${align === 'left' ? 'section-head__underline--left' : ''}`}
            d="M2,6 C 20,1 40,11 60,6 C 80,1 100,11 118,6"
            viewBox="0 0 120 12"
            strokeColor="var(--gold-500, #d4af37)"
            strokeWidth={3}
            duration={700}
            delay={550}
            ease="inOutSine"
          />
        </>
      ) : (
        <As style={{ marginTop: eyebrow ? '16px' : 0 }}>{title}</As>
      )}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.15, ease: EASE_OUT }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
