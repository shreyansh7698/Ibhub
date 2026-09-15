import { useEffect, useRef, useState } from 'react';

/**
 * True while the referenced element is within `rootMargin` of the viewport.
 * Used to mount/unmount heavy WebGL canvases so their GL context only exists
 * when the section is actually in play.
 */
export default function useNearViewport(rootMargin = '600px') {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return [ref, near];
}
