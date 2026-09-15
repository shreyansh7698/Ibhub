import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { spring } from './presets.js';

/**
 * Accessible animated modal. Spring pop-in, blurred backdrop, Esc to close,
 * scroll lock, focus moved into the dialog and restored on close.
 */
export default function Modal({ open, onClose, title, children, size = 'md' }) {
  const ref = useRef(null);
  const prevFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    prevFocus.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const t = setTimeout(() => ref.current?.focus(), 40);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
      prevFocus.current?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            ref={ref}
            tabIndex={-1}
            className={`modal modal--${size}`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={spring.soft}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__head">
              {title && <h3>{title}</h3>}
              <button type="button" className="modal__close" onClick={onClose} aria-label="Close">
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
