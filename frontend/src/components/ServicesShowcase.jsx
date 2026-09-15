import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { services } from '../data/services.js';
import useMediaTier, { isReduced, isMobile } from '../hooks/useMediaTier.js';

const ServiceCanvas = lazy(() => import('../three/ServiceCanvas.jsx'));

/**
 * Section 3 — services as 3D storytelling. A sticky 3D stage shows the object
 * for whichever service is crossing the viewport centre; the list scrolls past
 * it. One WebGL context for all services. Degrades to a plain icon list on
 * mobile / reduced-motion.
 */
export default function ServicesShowcase() {
  const tier = useMediaTier();
  const cinematic = !isReduced(tier) && !isMobile(tier);

  const sectionRef = useRef(null);
  const itemsRef = useRef([]);
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !cinematic) return undefined;

    const nearIo = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '700px' });
    nearIo.observe(el);

    // active = the item whose middle is nearest the viewport centre
    const activeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i));
        });
      },
      { rootMargin: '-48% 0px -48% 0px' }
    );
    itemsRef.current.forEach((n) => n && activeIo.observe(n));

    return () => {
      nearIo.disconnect();
      activeIo.disconnect();
    };
  }, [cinematic]);

  return (
    <section className="svc" id="services" ref={sectionRef}>
      <div className="svc__inner container">
        <header className="svc__head">
          <p className="kicker">What we handle</p>
          <h2 className="display-xl">
            One team.
            <br />
            Every moving part.
          </h2>
        </header>

        <div className={`svc__body ${cinematic ? '' : 'svc__body--plain'}`}>
          {cinematic && (
            <div className="svc__stage" aria-hidden="true">
              {near && (
                <Suspense fallback={null}>
                  <ServiceCanvas slug={services[active].slug} />
                </Suspense>
              )}
              <span className="svc__stage-num">{String(active + 1).padStart(2, '0')}</span>
            </div>
          )}

          <ol className="svc__list">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.slug}
                  data-i={i}
                  ref={(n) => {
                    itemsRef.current[i] = n;
                  }}
                  className={`svc__item ${i === active ? 'is-active' : ''}`}
                >
                  <div className="svc__item-inner">
                    <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
                    <div className="svc__item-text">
                      <h3>{s.title}</h3>
                      <p>{s.short}</p>
                      <Link to={s.to} className="svc__link" data-cursor-label="Open">
                        Explore
                        <ArrowUpRight aria-hidden="true" />
                      </Link>
                    </div>
                    {!cinematic && (
                      <span className="svc__ico" aria-hidden="true">
                        <Icon />
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="svc__foot">
          <Link to="/services" className="btn btn--ghost-dark btn--lg">
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
