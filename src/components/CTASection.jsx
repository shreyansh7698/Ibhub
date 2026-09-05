import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, MessageSquare } from 'lucide-react';
import Reveal from './Reveal.jsx';
import Magnetic from '../motion/Magnetic.jsx';
import ParticleField from '../motion/ParticleField.jsx';
import useReveal from '../motion/useReveal.js';
import ScrambleText from '../motion/ScrambleText.jsx';
import { spring } from '../motion/presets.js';

/**
 * Dark premium call-to-action band. Used on the home page and most inner pages.
 */
export default function CTASection({
  eyebrow = 'Get Started',
  title = 'Your Global Business Journey Starts Here',
  text = "Whether you're launching your first international company or expanding into new markets, our experts are ready to help.",
  primaryLabel = 'Start Your Company',
  primaryTo = '/company-formation',
  secondaryLabel = 'Talk to an Expert',
  secondaryTo = '/contact',
  bare = false
}) {
  const [ref, show] = useReveal({ amount: 0.3 });
  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: show ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { duration: 0.5, delay }
  });
  const inner = (
    <div className="cta-band" ref={ref}>
      <ParticleField color="120,160,255" linkColor="90,120,235" density="0.6" speed={0.15} />
      <motion.div
        className="bg-blob"
        style={{ width: 320, height: 320, background: '#2f6bff', top: -120, left: -60 }}
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bg-blob"
        style={{ width: 260, height: 260, background: '#d4af37', bottom: -120, right: -40, opacity: 0.28 }}
        animate={{ scale: [1, 1.15, 1], y: [0, -24, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={spring.bouncy}
        >
          <ScrambleText text={eyebrow} />
        </motion.span>
        <motion.h2 style={{ marginTop: 16 }} {...rise(0.05)}>
          {title}
        </motion.h2>
        <motion.p {...rise(0.12)}>{text}</motion.p>
        <div className="stack-btns">
          <Magnetic>
            <motion.span style={{ display: 'inline-block' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring.soft}>
              <Link to={primaryTo} className="btn btn--gold btn--lg has-sheen">
                <Rocket aria-hidden="true" />
                {primaryLabel}
              </Link>
            </motion.span>
          </Magnetic>
          <Magnetic>
            <motion.span style={{ display: 'inline-block' }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={spring.soft}>
              <Link to={secondaryTo} className="btn btn--ghost-light btn--lg">
                <MessageSquare aria-hidden="true" />
                {secondaryLabel}
              </Link>
            </motion.span>
          </Magnetic>
        </div>
      </div>
    </div>
  );

  if (bare) return inner;

  return (
    <section className="section">
      <div className="container">
        <Reveal scale={0.96}>{inner}</Reveal>
      </div>
    </section>
  );
}
