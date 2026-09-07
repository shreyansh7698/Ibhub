import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let instance = null;

/** Access the live Lenis instance from anywhere (e.g. anchor-link scrolling). */
export function getLenis() {
  return instance;
}

/** Smoothly scroll to a target (number | selector | element). No-op without Lenis. */
export function scrollToTarget(target, opts) {
  if (instance) instance.scrollTo(target, { offset: -80, duration: 1.1, ...opts });
  else if (typeof target === 'string') {
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Mounts one Lenis smooth-scroll instance and wires it into the GSAP ticker so
 * ScrollTrigger stays in sync. Pass `enabled={false}` (reduced-motion) to keep
 * native scrolling — ScrollTrigger still works off the real scroll position.
 */
export default function useLenis(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      // Make sure any triggers created before this decision recalc against native scroll.
      ScrollTrigger.refresh();
      return undefined;
    }

    const lenis = new Lenis({
      duration: 0.95,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      lerp: undefined
    });
    instance = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Recalculate positions once late-loading fonts / images settle the layout.
    const refresh = () => ScrollTrigger.refresh();
    const t1 = window.setTimeout(refresh, 400);
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      window.clearTimeout(t1);
      window.removeEventListener('load', refresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      instance = null;
    };
  }, [enabled]);
}
