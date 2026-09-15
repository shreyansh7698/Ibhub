import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';

/**
 * Shared R3F canvas wrapper for every decorative scene on the site.
 *
 *  - Render loop runs ONLY while the canvas is on-screen and the tab is visible
 *    (`frameloop` flips between 'always' and 'never') — a scene scrolled out of
 *    view costs nothing.
 *  - DPR clamped to 2, high-performance context, transparent.
 *  - `aria-hidden` + non-interactive by default; scenes are pure atmosphere and
 *    the page must read fine without them.
 *  - WebGL context-loss is swallowed and reported via `onContextLost` so callers
 *    can drop in a poster image.
 */
export default function Canvas3D({
  children,
  className = '',
  camera,
  dpr,
  interactive = false,
  rootMargin = '160px',
  onContextLost,
  ...props
}) {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
      { rootMargin }
    );
    io.observe(el);

    const onVisibility = () => {
      if (document.hidden) setVisible(false);
      else setVisible(el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [rootMargin]);

  const maxDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1.5;

  return (
    <div ref={wrapRef} className={`canvas3d ${className}`} aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={dpr ?? [1, maxDpr]}
        camera={camera ?? { position: [0, 0, 6], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false, depth: true }}
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener(
            'webglcontextlost',
            (e) => {
              e.preventDefault();
              onContextLost?.();
            },
            { once: true }
          );
        }}
        {...props}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
