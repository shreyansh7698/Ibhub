import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './presets.js';
import useReveal from './useReveal.js';

/**
 * Wraps a group of children so they animate in one-by-one when scrolled
 * into view. Pair with <StaggerItem> (or pass `item` variants to children).
 */
export function Stagger({
  children,
  className,
  stagger = 0.09,
  delayChildren = 0,
  amount = 0.2,
  once = true,
  as = 'div',
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  const [ref, show] = useReveal({ amount, once });

  return (
    <MotionTag
      ref={ref}
      className={className}
      variants={staggerContainer(stagger, delayChildren)}
      initial="hidden"
      animate={show ? 'show' : 'hidden'}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({ children, className, as = 'div', variants = staggerItem, ...rest }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag className={className} variants={variants} {...rest}>
      {children}
    </MotionTag>
  );
}

export default Stagger;
