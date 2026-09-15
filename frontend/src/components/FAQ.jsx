import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Stagger } from '../motion/index.js';
import { EASE_OUT } from '../motion/presets.js';

/**
 * Accordion FAQ. @param {{q: string, a: string}[]} items
 */
export default function FAQ({ items, allowMultiple = false }) {
  const [open, setOpen] = useState(() => new Set());

  const toggle = (i) => {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <Stagger className="faq" stagger={0.06}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        return (
          <motion.div
            className={`faq__item ${isOpen ? 'is-open' : ''}`}
            key={item.q}
            layout
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } }
            }}
            transition={{ layout: { duration: 0.35, ease: EASE_OUT } }}
          >
            <motion.button
              type="button"
              className="faq__q"
              aria-expanded={isOpen}
              onClick={() => toggle(i)}
              layout="position"
              whileTap={{ scale: 0.99 }}
            >
              <span>{item.q}</span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 135 : 0, color: isOpen ? '#2f6bff' : '#64748b' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ display: 'inline-flex', flexShrink: 0 }}
              >
                <Plus />
              </motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="faq__a"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                >
                  <motion.p
                    className="faq__a-inner"
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                  >
                    {item.a}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </Stagger>
  );
}
