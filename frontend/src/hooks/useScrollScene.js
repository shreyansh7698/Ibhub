import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Runs `setup` inside a `gsap.context` scoped to the returned ref, and reverts
 * everything (tweens, ScrollTriggers, inline styles) on unmount or dep change.
 * This is the only sanctioned way to create scroll timelines in this codebase —
 * it guarantees cleanup so route changes never leak triggers.
 *
 * @param {(ctx: gsap.Context) => void} setup  receives the context; use ctx.selector('.x')
 * @param {any[]} deps
 * @returns {React.MutableRefObject} attach to the scene's root element
 */
export default function useScrollScene(setup, deps = []) {
  const scope = useRef(null);
  const setupRef = useRef(setup);
  setupRef.current = setup;

  useLayoutEffect(() => {
    if (!scope.current) return undefined;
    const ctx = gsap.context((self) => setupRef.current(self), scope);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}
