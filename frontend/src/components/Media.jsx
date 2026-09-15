import { useState } from 'react';
import { motion } from 'framer-motion';
import useReveal from '../motion/useReveal.js';

/**
 * Framed feature image with a shimmering skeleton while it loads and a
 * gradient fallback if it fails. Reveals with a wipe + zoom-settle when
 * scrolled into view, and gently zooms the photo on hover.
 */
export default function Media({ src, alt = '', label, className = '', ratio = '4 / 3' }) {
  const [ref, inView] = useReveal({ amount: 0.3 });
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      ref={ref}
      className={`split__media ${className}`}
      style={{ aspectRatio: ratio }}
      initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0 round 22px)' }}
      animate={
        inView
          ? { opacity: 1, clipPath: 'inset(0 0% 0 0 round 22px)' }
          : { opacity: 0, clipPath: 'inset(0 100% 0 0 round 22px)' }
      }
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
    >
      {src && !loaded && <span className="skeleton skeleton--fill" aria-hidden="true" />}
      {src && (
        <motion.img
          className="split__media-img"
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          initial={{ scale: 1.2 }}
          animate={inView ? { scale: 1 } : { scale: 1.2 }}
          variants={{ hover: { scale: 1.06 } }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      {label && (
        <motion.span
          className="split__media-label"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}
