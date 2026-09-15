import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global scroll-reveal. After every route change it finds the main content
 * blocks on the page and reveals them (fade + rise) as they scroll into
 * view — so every page animates its content in, without each page having to
 * opt in element by element.
 *
 * Works alongside the framer-based <Reveal>/<Stagger> components: those handle
 * fine-grained item choreography, this handles the section-level entrance.
 *
 * Pure IntersectionObserver + CSS classes (`.sr` / `.sr-in`), with a timed
 * fallback so nothing can stay hidden if the observer misbehaves.
 */
/*
 * Only target blocks that don't already run their own framer entrance.
 * `.section` is a plain wrapper on every page; `.prose > *` are the legal-page
 * paragraphs; `.aside-card` is the formation sidebar. Everything else on the
 * site is already handled by <Reveal>/<Stagger>/<SectionHeading>.
 */
const SELECTOR = ['main .section', 'main .prose > *', 'main .aside-card'].join(', ');

export default function ScrollRevealSections() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let io;
    let fallback;
    let els = [];

    // Let the new route paint first, then wire everything up.
    const raf = requestAnimationFrame(() => {
      els = Array.from(document.querySelectorAll(SELECTOR)).filter(
        (el) => !el.classList.contains('sr')
      );
      els.forEach((el) => el.classList.add('sr'));

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('sr-in');
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.04 }
      );
      els.forEach((el) => io.observe(el));

      fallback = setTimeout(() => {
        els.forEach((el) => el.classList.add('sr-in'));
        io.disconnect();
      }, 2600);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      if (io) io.disconnect();
      els.forEach((el) => el.classList.remove('sr', 'sr-in'));
    };
  }, [pathname]);

  return null;
}
