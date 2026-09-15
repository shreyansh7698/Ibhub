import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { trackRafActivity } from './rafActivity.js';

/**
 * Lightweight canvas "constellation" background: drifting particles that
 * link with thin lines when close, and lean toward the cursor.
 *
 * Absolutely positioned to fill its (positioned) parent. Purely decorative.
 *
 * @param {number} density     particles per 100k px² (default 0.9)
 * @param {string} color       rgb triplet, e.g. "255,255,255"
 * @param {number} maxParticles hard cap
 */
export default function ParticleField({
  density = 0.9,
  color = '255,255,255',
  linkColor,
  maxParticles = 90,
  speed = 0.25,
  interactive = true,
  className = ''
}) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    let raf = 0;
    let particles = [];
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const link = linkColor || color;

    // Cached each resize so the animation loop never touches layout.
    let width = 0;
    let height = 0;

    const resize = () => {
      ({ width, height } = parent.getBoundingClientRect());
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(maxParticles, Math.round((width * height) / 100000 * density * 10));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 1.6 + 0.6
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        if (interactive) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 140) {
            p.vx += (dx / d) * 0.02;
            p.vy += (dy / d) * 0.02;
          }
        }
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},0.55)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${link},${0.14 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    resize();
    window.addEventListener('resize', resize);
    if (interactive) {
      parent.addEventListener('mousemove', onMove);
      parent.addEventListener('mouseleave', onLeave);
    }

    // Only animate while the field is on-screen and the tab is visible.
    const untrack = trackRafActivity(canvas, (active) => (active ? start() : stop()));

    return () => {
      untrack();
      stop();
      window.removeEventListener('resize', resize);
      if (interactive) {
        parent.removeEventListener('mousemove', onMove);
        parent.removeEventListener('mouseleave', onLeave);
      }
    };
  }, [reduced, density, color, linkColor, maxParticles, speed, interactive]);

  return <canvas ref={canvasRef} className={`particle-field ${className}`} aria-hidden="true" />;
}
