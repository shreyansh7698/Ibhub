import { motion, useReducedMotion } from 'framer-motion';

const BLOB = 'M0,-70 C40,-70 70,-40 70,0 C70,40 40,70 0,70 C-40,70 -70,40 -70,0 C-70,-40 -40,-70 0,-70 Z';

/**
 * Organic SVG blob for a "liquid" background accent. It's already heavily
 * blurred, so instead of morphing the path each frame (which re-rasterizes the
 * blurred region and costs real frames) we slowly rotate + breathe a static
 * shape — a compositor-only transform that looks the same through 40px of blur.
 */
export default function MorphBlob({ color = '#2f6bff', size = 420, opacity = 0.5, style, className = '' }) {
  const reduced = useReducedMotion();
  return (
    <svg
      className={`morph-blob ${className}`}
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      style={{ position: 'absolute', filter: 'blur(40px)', opacity, pointerEvents: 'none', zIndex: 0, ...style }}
      aria-hidden="true"
    >
      <motion.path
        fill={color}
        d={BLOB}
        style={{ originX: '0px', originY: '0px' }}
        animate={reduced ? undefined : { rotate: 360, scale: [1, 1.08, 0.96, 1] }}
        transition={
          reduced
            ? undefined
            : {
                rotate: { duration: 60, repeat: Infinity, ease: 'linear' },
                scale: { duration: 16, repeat: Infinity, ease: 'easeInOut' }
              }
        }
      />
    </svg>
  );
}
