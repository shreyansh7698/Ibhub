import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TestimonialCard from './TestimonialCard.jsx';
import { testimonials } from '../data/testimonials.js';

const AUTOPLAY_MS = 6500;

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;

  const go = useCallback((dir) => setIndex((i) => (i + dir + n) % n), [n]);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, n]);

  const visible = [testimonials[index], testimonials[(index + 1) % n], testimonials[(index + 2) % n]];

  return (
    <div
      className="tcarousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <motion.div
        className="tcarousel__track"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={(e, info) => {
          if (info.offset.x < -70 || info.velocity.x < -350) go(1);
          else if (info.offset.x > 70 || info.velocity.x > 350) go(-1);
        }}
        whileDrag={{ cursor: 'grabbing' }}
        style={{ cursor: 'grab' }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((item, i) => (
            <motion.div
              key={item.name}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <TestimonialCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="tcarousel__controls">
        <button type="button" className="tcarousel__btn" onClick={() => go(-1)} aria-label="Previous testimonials">
          <ChevronLeft aria-hidden="true" />
        </button>
        <div className="tcarousel__dots" role="tablist" aria-label="Testimonial pages">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              className={`tcarousel__dot ${i === index ? 'is-active' : ''}`}
              aria-label={`Show testimonial ${i + 1}`}
              aria-selected={i === index}
              role="tab"
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
        <button type="button" className="tcarousel__btn" onClick={() => go(1)} aria-label="Next testimonials">
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
