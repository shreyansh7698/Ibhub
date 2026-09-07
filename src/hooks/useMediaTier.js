import { useEffect, useState } from 'react';

/**
 * One source of truth for "how much cinematic weight can this device take".
 *
 *  - 'reduced' : prefers-reduced-motion, or no WebGL → no timelines / no 3D loop.
 *  - 'mobile'  : small viewport or low memory → simplified scenes, no scrub camera.
 *  - 'full'    : desktop → the complete experience.
 *
 * SSR-safe default is 'full' so the first client render matches; it corrects on
 * mount before any scene work starts.
 */
function detect() {
  if (typeof window === 'undefined') return 'full';

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return 'reduced';

  // Cheap WebGL probe (cached result is fine — GPUs don't appear mid-session).
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return 'reduced';
  } catch {
    return 'reduced';
  }

  const narrow = window.matchMedia?.('(max-width: 900px)').matches;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const lowMem = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4;
  if (narrow || (coarse && lowMem)) return 'mobile';

  return 'full';
}

export default function useMediaTier() {
  const [tier, setTier] = useState('full');

  useEffect(() => {
    const update = () => setTier(detect());
    update();

    const mqs = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(max-width: 900px)')
    ];
    mqs.forEach((mq) => mq.addEventListener?.('change', update));
    return () => mqs.forEach((mq) => mq.removeEventListener?.('change', update));
  }, []);

  return tier;
}

export const isReduced = (tier) => tier === 'reduced';
export const isMobile = (tier) => tier === 'mobile';
export const isFull = (tier) => tier === 'full';
