import { useEffect, useRef } from 'react';
import { animate, svg } from 'animejs';
import { prefersReducedMotion } from './animeSafe.js';

/**
 * SVG path that draws itself in (stroke-dashoffset via anime.js's svg.createDrawable)
 * once `show` goes true. Under prefers-reduced-motion it just renders fully visible.
 */
export default function DrawPath({
  show,
  d,
  viewBox,
  preserveAspectRatio = 'none',
  className = '',
  strokeColor = 'currentColor',
  strokeWidth = 2,
  duration = 900,
  delay = 150,
  ease = 'inOutQuad',
  style
}) {
  const pathRef = useRef(null);

  useEffect(() => {
    if (!show || !pathRef.current || prefersReducedMotion()) return;

    const [drawable] = svg.createDrawable(pathRef.current);
    const anim = animate(drawable, { draw: ['0 0', '0 1'], duration, delay, ease });
    return () => anim.pause();
  }, [show, duration, delay, ease]);

  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      viewBox={viewBox}
      preserveAspectRatio={preserveAspectRatio}
      style={style}
    >
      <path ref={pathRef} d={d} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}
