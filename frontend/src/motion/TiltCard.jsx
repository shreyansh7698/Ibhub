import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';

/**
 * 3D pointer-tilt container with a moving sheen. Used to wrap cards.
 * Keeps children fully interactive (links, buttons) underneath.
 */
export default function TiltCard({
  children,
  className,
  max = 8,
  scale = 1.02,
  glare = true,
  as = 'div',
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  const ref = useRef(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [max, -max]);
  const rotateY = useTransform(sx, [0, 1], [-max, max]);
  const sheen = useTransform(
    [sx, sy],
    ([gx, gy]) =>
      `radial-gradient(220px circle at ${gx * 100}% ${gy * 100}%, rgba(255,255,255,0.35), transparent 60%)`
  );

  const onMove = (e) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduced) {
    return (
      <div className={className} {...rest}>
        {children}
      </div>
    );
  }

  return (
    <MotionTag
      ref={ref}
      className={`${className || ''} motion-tilt`.trim()}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
        transformStyle: 'preserve-3d',
        position: 'relative'
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      {...rest}
    >
      {children}
      {glare && (
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: sheen,
            mixBlendMode: 'soft-light',
            opacity: 0.6
          }}
        />
      )}
    </MotionTag>
  );
}
