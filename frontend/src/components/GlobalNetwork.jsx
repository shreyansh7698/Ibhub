import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import useMediaTier, { isReduced, isMobile } from '../hooks/useMediaTier.js';
import useScrollScene from '../hooks/useScrollScene.js';
import { hubs } from '../data/hubs.js';
import { latLonToVec3 } from '../three/landMask.js';

const GlobeCanvas = lazy(() => import('../three/GlobeCanvas.jsx'));

// Target globe facing for each hub (bring the marker to the camera).
const facings = hubs.map((h) => {
  const [x, y, z] = latLonToVec3(h.lat, h.lon, 1);
  return { rotY: -Math.atan2(x, z), rotX: Math.asin(y) * 0.62 };
});

/**
 * Section 2 — "One network, every major economy." Pinned; scrolling steps
 * through each hub: the globe turns to face it, its marker glows, an arc draws
 * and the info panel crossfades. GSAP scrub drives everything from one timeline.
 */
export default function GlobalNetwork() {
  const tier = useMediaTier();
  const reduced = isReduced(tier);
  const mobile = isMobile(tier);
  const cinematic = !reduced && !mobile;

  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [near, setNear] = useState(false);

  const driver = useRef({
    spin: 0.03,
    camZ: 6.6,
    offsetX: 0,
    offsetY: 0,
    tilt: -0.2,
    arcProgress: 0,
    glow: 1.1,
    activeIndex: 0,
    pointerParallax: 0.15,
    bloom: 1,
    targetRotY: facings[0].rotY,
    targetRotX: facings[0].rotX
  });

  const scope = useScrollScene(
    (ctx) => {
      if (!cinematic) return;
      const setStep = (i) => {
        if (i === activeRef.current) return;
        activeRef.current = i;
        setActive(i);
        const d = driver.current;
        d.activeIndex = i;
        d.targetRotY = facings[i].rotY;
        d.targetRotX = facings[i].rotX;
      };

      gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: 'top top',
          end: `+=${hubs.length * 62}%`,
          pin: scope.current.querySelector('.gnet__sticky'),
          scrub: 0.8,
          onUpdate: (self) => {
            const i = Math.min(hubs.length - 1, Math.floor(self.progress * hubs.length));
            setStep(i);
            driver.current.arcProgress = gsap.utils.clamp(0, 1, self.progress * 1.4);
          }
        }
      });
    },
    [cinematic]
  );

  // Only keep the WebGL context alive while the section is near the viewport.
  useEffect(() => {
    const el = scope.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '700px' });
    io.observe(el);
    return () => io.disconnect();
  }, [scope]);

  return (
    <section className="gnet" id="network" ref={scope}>
      <div className="gnet__sticky">
        {!reduced && near && (
          <div className="gnet__globe" aria-hidden="true">
            <Suspense fallback={null}>
              <GlobeCanvas
                driverRef={driver}
                tier={mobile ? 'mobile' : 'full'}
                camera={{ position: [0, 0, 7], fov: 36 }}
                className="gnet__canvas"
              />
            </Suspense>
          </div>
        )}

        <div className="gnet__inner container">
          <header className="gnet__head">
            <p className="kicker">The world is your market</p>
            <h2 className="display-xl">
              One network.
              <br />
              Every major economy.
            </h2>
          </header>

          {cinematic ? (
            <div className="gnet__stage">
              <ol className="gnet__rail" aria-hidden="true">
                {hubs.map((h, i) => (
                  <li key={h.key} className={i === active ? 'is-active' : ''}>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                    {h.label}
                  </li>
                ))}
              </ol>
              <div className="gnet__panels">
                {hubs.map((h, i) => (
                  <article
                    key={h.key}
                    className={`gnet__panel ${i === active ? 'is-active' : ''}`}
                    aria-hidden={i !== active}
                  >
                    <h3>
                      {h.label}
                      <em>{h.city}</em>
                    </h3>
                    <p>{h.blurb}</p>
                    <Link to={h.to} className="gnet__link" data-cursor-label="Open">
                      Explore {h.label}
                      <ArrowUpRight aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="gnet__grid">
              {hubs.map((h, i) => (
                <article key={h.key} className="gnet__card">
                  <span className="gnet__panel-num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>
                    {h.label}
                    <em>{h.city}</em>
                  </h3>
                  <p>{h.blurb}</p>
                  <Link to={h.to} className="gnet__link">
                    Explore {h.label}
                    <ArrowUpRight aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
