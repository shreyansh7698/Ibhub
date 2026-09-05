import { useEffect } from 'react';
import { animate } from 'animejs';
import { prefersReducedMotion } from './animeSafe.js';

/**
 * One delegated listener that drops a material-style ripple into any `.btn`
 * the user clicks, anywhere on the site. Mounted once in Layout.jsx.
 */
export default function ClickRipple() {
  useEffect(() => {
    const onPointerDown = (e) => {
      if (e.button !== 0 || prefersReducedMotion()) return;
      const btn = e.target.closest?.('.btn');
      if (!btn) return;

      let mask = btn.querySelector(':scope > .btn-ripple-mask');
      if (!mask) {
        mask = document.createElement('span');
        mask.className = 'btn-ripple-mask';
        mask.setAttribute('aria-hidden', 'true');
        btn.appendChild(mask);
      }

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.6;
      const dot = document.createElement('span');
      dot.className = 'btn-ripple-dot';
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${e.clientX - rect.left - size / 2}px`;
      dot.style.top = `${e.clientY - rect.top - size / 2}px`;
      mask.appendChild(dot);

      animate(dot, {
        scale: [0, 1],
        opacity: [0.4, 0],
        duration: 550,
        ease: 'outQuad',
        onComplete: () => dot.remove()
      });
    };

    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  return null;
}
