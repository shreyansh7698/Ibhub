import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';
import useMediaTier, { isReduced, isMobile } from '../hooks/useMediaTier.js';
import useScrollScene from '../hooks/useScrollScene.js';
import Magnetic from '../motion/Magnetic.jsx';

const GlobeCanvas = lazy(() => import('../three/GlobeCanvas.jsx'));

const LINES = ['READY TO TAKE', 'YOUR BUSINESS', 'GLOBAL?'];

/**
 * Signature moment 3 — the closing globe. As the section enters view the globe
 * brightens, the full arc-network completes and the headline rises line by line.
 */
export default function FinalCTA() {
  const tier = useMediaTier();
  const reduced = isReduced(tier);
  const mobile = isMobile(tier);
  const [near, setNear] = useState(false);

  const driver = useRef({
    spin: 0.05,
    camZ: 6.2,
    offsetX: 0,
    offsetY: 0.15,
    tilt: -0.22,
    arcProgress: reduced ? 1 : 0,
    glow: reduced ? 1.8 : 0.35,
    activeIndex: -1,
    pointerParallax: 0.12,
    bloom: 1
  });

  const scope = useScrollScene(
    (ctx) => {
      const q = ctx.selector;
      if (reduced) {
        gsap.set(q('.fcta__line-inner'), { yPercent: 0 });
        return;
      }
      gsap.set(q('.fcta__line-inner'), { yPercent: 115 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: 'top 80%',
            end: 'bottom bottom',
            scrub: 0.8
          }
        })
        .to(driver.current, { arcProgress: 1, glow: 1.9, camZ: 5.4, ease: 'none' }, 0);

      gsap
        .timeline({
          scrollTrigger: { trigger: scope.current, start: 'top 72%', toggleActions: 'play none none reverse' }
        })
        .to(q('.fcta__line-inner'), { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' })
        .from(q('.fcta__cta'), { opacity: 0, y: 20, duration: 0.6 }, 0.3);
    },
    [reduced]
  );

  useEffect(() => {
    const el = scope.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '700px' });
    io.observe(el);
    return () => io.disconnect();
  }, [scope]);

  return (
    <section className="fcta" ref={scope}>
      <div className="fcta__night" aria-hidden="true" />
      {!reduced && near && (
        <div className="fcta__globe" aria-hidden="true">
          <Suspense fallback={null}>
            <GlobeCanvas
              driverRef={driver}
              tier={mobile ? 'mobile' : 'full'}
              camera={{ position: [0, 0, 6.6], fov: 40 }}
              className="fcta__canvas"
            />
          </Suspense>
        </div>
      )}

      <div className="fcta__inner container">
        <h2 className="fcta__title">
          {LINES.map((line) => (
            <span className="fcta__line" key={line}>
              <span className="fcta__line-inner">{line}</span>
            </span>
          ))}
        </h2>
        <div className="fcta__cta">
          <Magnetic strength={0.5}>
            <Link
              to="/company-formation"
              className="btn btn--coral btn--lg"
              data-cursor-label="Go"
            >
              Start Your Business Journey
              <ArrowRight aria-hidden="true" />
            </Link>
          </Magnetic>
          <Link to="/contact" className="fcta__secondary">
            or book a free consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
