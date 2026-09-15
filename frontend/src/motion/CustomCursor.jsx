import { useEffect, useRef } from 'react';

/**
 * Desktop custom cursor: a precise dot that tracks 1:1 and a ring that eases
 * behind it and swells over interactive targets. Pure rAF + refs — no React
 * state per frame. Disabled on touch devices and under reduced-motion (native
 * cursor stays).
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let hovering = false;
    let down = false;
    let raf = 0;
    let visible = false;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };
    // Hover state changes only when the pointer crosses an element boundary —
    // far cheaper than walking the DOM on every pointermove.
    const INTERACTIVE = 'a, button, [data-cursor], input, textarea, select, .magnetic';
    const onOver = (e) => {
      const hit = e.target?.closest?.(INTERACTIVE);
      hovering = !!hit;
      const label = hit?.closest?.('[data-cursor-label]')?.getAttribute('data-cursor-label') || '';
      ring.dataset.label = label;
      ring.classList.toggle('is-labelled', !!label);
    };
    const onOut = (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest?.(INTERACTIVE)) {
        hovering = false;
        ring.classList.remove('is-labelled');
      }
    };
    const onDown = () => { down = true; };
    const onUp = () => { down = false; };
    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    let wasHover = false;
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      const scale = (hovering ? 1.9 : 1) * (down ? 0.8 : 1);
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      if (hovering !== wasHover) {
        ring.classList.toggle('is-hover', hovering);
        wasHover = hovering;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
