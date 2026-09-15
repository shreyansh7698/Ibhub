import { lazy, Suspense, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ChevronDown } from 'lucide-react';
import useMediaTier, { isReduced, isMobile } from '../hooks/useMediaTier.js';
import useScrollScene from '../hooks/useScrollScene.js';
import { scrollToTarget } from '../hooks/useLenis.js';
import Magnetic from '../motion/Magnetic.jsx';

const GlobeCanvas = lazy(() => import('../three/GlobeCanvas.jsx'));

const HEADING = ['BUILD YOUR', 'BUSINESS', 'GLOBALLY'];

/**
 * Signature moment 1 — the globe emerges from darkness, then the camera pushes
 * through it into the site as you scroll. GSAP owns both the load intro and the
 * scroll transition; the 3D scene is driven by a plain mutable `driver` object
 * so neither ever triggers a React render.
 */
export default function Hero() {
  const tier = useMediaTier();
  const reduced = isReduced(tier);
  const mobile = isMobile(tier);

  // Mutated by GSAP, read every frame by GlobeScene.
  const driver = useRef({
    spin: 0.02,
    camZ: 8.2,
    offsetX: mobile ? 0.15 : 1.5,
    offsetY: mobile ? 0.4 : -0.05,
    tilt: -0.28,
    arcProgress: 0,
    glow: 1,
    activeIndex: -1,
    pointerParallax: mobile ? 0 : 1,
    bloom: reduced ? 1 : 0.001
  });

  const scope = useScrollScene(
    (ctx) => {
      const q = ctx.selector;
      const d = driver.current;

      if (reduced) {
        gsap.set(q('.hero__line-inner'), { yPercent: 0, opacity: 1 });
        gsap.set([q('.hero__sub'), q('.hero__actions'), q('.hero__cue')], { opacity: 1, y: 0 });
        gsap.set(q('.hero__night'), { opacity: 1 });
        Object.assign(d, { bloom: 1, arcProgress: 1, spin: 0.05 });
        return;
      }

      // ---- initial states ----
      gsap.set(q('.hero__line-inner'), { yPercent: 115 });
      gsap.set([q('.hero__sub'), q('.hero__actions')], { opacity: 0, y: 26 });
      gsap.set(q('.hero__cue'), { opacity: 0 });
      gsap.set(q('.hero__keylight'), { opacity: 0, scale: 0.6 });

      // ---- load intro ----
      const intro = gsap.timeline({ delay: 0.15, defaults: { ease: 'power3.out' } });
      intro
        .to(q('.hero__keylight'), { opacity: 0.85, scale: 1, duration: 1.4 }, 0)
        .to(d, { bloom: 1, duration: 1.7, ease: 'power2.out' }, 0.1)
        .to(d, { camZ: 6.6, duration: 1.9, ease: 'power2.inOut' }, 0.1)
        .to(
          q('.hero__line-inner'),
          { yPercent: 0, duration: 1, stagger: 0.12, ease: 'expo.out' },
          0.7
        )
        .to(q('.hero__sub'), { opacity: 1, y: 0, duration: 0.8 }, 1.15)
        .to(q('.hero__actions'), { opacity: 1, y: 0, duration: 0.8 }, 1.35)
        .to(q('.hero__cue'), { opacity: 1, duration: 0.6 }, 1.7)
        .to(d, { arcProgress: 1, duration: 2.4, ease: 'power1.inOut' }, 1.2)
        .to(d, { spin: 0.055, duration: 2 }, 1.2);

      // ---- scroll transition (camera travels through the scene) ----
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: '+=95%',
          scrub: 1
        }
      });
      st.to(q('.hero__content'), { yPercent: -24, opacity: 0, ease: 'none' }, 0)
        .to(q('.hero__night'), { opacity: 0, ease: 'none' }, 0.15)
        .to(q('.hero__cue'), { opacity: 0, duration: 0.1, ease: 'none' }, 0);
      if (!mobile) {
        st.to(d, { camZ: 4.4, offsetY: -1.2, offsetX: 0.2, spin: 0.12, tilt: -0.12, ease: 'none' }, 0);
      } else {
        st.to(d, { offsetY: -0.4, ease: 'none' }, 0);
      }
    },
    [reduced, mobile]
  );

  return (
    <section className="hero" ref={scope}>
      <div className="hero__night" aria-hidden="true" />
      <div className="hero__keylight" aria-hidden="true" />

      {!reduced && (
        <Suspense fallback={null}>
          <GlobeCanvas
            driverRef={driver}
            tier={mobile ? 'mobile' : 'full'}
            camera={{ position: [0, 0, 8.2], fov: 32 }}
            className="hero__canvas"
          />
        </Suspense>
      )}

      <div className="hero__content container">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-dot" aria-hidden="true" />
          The International Business Hub
        </p>

        <h1 className="hero__title">
          {HEADING.map((line) => (
            <span className="hero__line" key={line}>
              <span className="hero__line-inner">{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero__sub">
          Company formation, banking, tax and compliance — one accountable team helps you launch
          and expand across 25+ markets worldwide.
        </p>

        <div className="hero__actions">
          <Magnetic>
            <Link
              to="/company-formation"
              className="btn btn--coral btn--lg"
              data-cursor-label="Start"
            >
              Start Your Company
            </Link>
          </Magnetic>
          <button
            type="button"
            className="btn btn--ghost-dark btn--lg"
            onClick={() => scrollToTarget('#network')}
          >
            Explore the Network
          </button>
        </div>
      </div>

      <button
        type="button"
        className="hero__cue"
        onClick={() => scrollToTarget('#markets')}
        aria-label="Scroll to explore"
      >
        <span>Scroll</span>
        <ChevronDown aria-hidden="true" />
      </button>
    </section>
  );
}
