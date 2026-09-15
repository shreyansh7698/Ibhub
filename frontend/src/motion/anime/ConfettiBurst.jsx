import { useEffect, useRef } from 'react';
import { animate, stagger, utils } from 'animejs';
import { prefersReducedMotion } from './animeSafe.js';

const COLORS = ['#4d82ff', '#d4af37', '#2fbf71'];

/**
 * Small celebratory particle burst radiating from its own position. Fires once
 * when `trigger` goes true (used next to SuccessCheck on consultation form success).
 */
export default function ConfettiBurst({ trigger, count = 14 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!trigger || !containerRef.current || prefersReducedMotion()) return;

    const dots = containerRef.current.querySelectorAll('.confetti-burst__dot');
    const anim = animate(dots, {
      translateX: () => utils.random(-46, 46),
      translateY: () => utils.random(-46, 46),
      scale: [
        { to: 1, duration: 200 },
        { to: 0, duration: 400 }
      ],
      opacity: [
        { to: 1, duration: 150 },
        { to: 0, duration: 450, delay: 150 }
      ],
      duration: 650,
      delay: stagger(18),
      ease: 'outCubic'
    });
    return () => anim.pause();
  }, [trigger]);

  return (
    <span className="confetti-burst" ref={containerRef} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="confetti-burst__dot" style={{ background: COLORS[i % COLORS.length] }} />
      ))}
    </span>
  );
}
