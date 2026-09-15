import { motion, useReducedMotion } from 'framer-motion';

/**
 * Seamless infinite marquee. Duplicates children once and translates the
 * track by -50%. Pauses on hover.
 */
export default function Marquee({ children, speed = 32, gap = 40, className = '', reverse = false }) {
  const reduced = useReducedMotion();
  const content = (
    <div className="marquee__group" style={{ gap }}>
      {children}
    </div>
  );

  if (reduced) {
    return <div className={`marquee marquee--static ${className}`}>{content}</div>;
  }

  return (
    <div className={`marquee ${className}`}>
      <motion.div
        className="marquee__track"
        style={{ gap }}
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {content}
        {content}
      </motion.div>
    </div>
  );
}
