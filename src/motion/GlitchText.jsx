import { motion } from 'framer-motion';

/**
 * RGB-split glitch text. Renders the text three times (base + cyan + magenta
 * layers) and jitters the colour layers. `trigger`:
 *  - 'hover'    : glitches on hover (default)
 *  - 'always'   : glitches on a loop
 */
export default function GlitchText({ text, as: Tag = 'span', className = '', trigger = 'hover' }) {
  const Comp = motion[Tag] || motion.span;
  const layerAnim =
    trigger === 'always'
      ? { x: [0, -2, 2, -1, 0], transition: { duration: 0.4, repeat: Infinity, repeatDelay: 2.5 } }
      : undefined;

  return (
    <Comp
      className={`glitch ${className}`}
      data-text={text}
      whileHover={trigger === 'hover' ? 'glitch' : undefined}
      animate={trigger === 'always' ? 'glitch' : undefined}
    >
      <span className="glitch__base">{text}</span>
      <motion.span
        className="glitch__layer glitch__layer--r"
        aria-hidden="true"
        variants={{ glitch: { x: [0, -3, 2, -2, 0], opacity: [0.9, 0.7, 0.9] } }}
        animate={layerAnim}
        transition={{ duration: 0.35, repeat: trigger === 'always' ? Infinity : 0, repeatDelay: 2.5 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="glitch__layer glitch__layer--c"
        aria-hidden="true"
        variants={{ glitch: { x: [0, 3, -2, 2, 0], opacity: [0.9, 0.7, 0.9] } }}
        transition={{ duration: 0.35, repeat: trigger === 'always' ? Infinity : 0, repeatDelay: 2.5 }}
      >
        {text}
      </motion.span>
    </Comp>
  );
}
