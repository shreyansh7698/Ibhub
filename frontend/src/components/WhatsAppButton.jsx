import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { site } from '../data/site.js';
import { spring } from '../motion/presets.js';

// Replace `whatsapp` in src/data/site.js with a real number (digits only, incl. country code).
const WHATSAPP_NUMBER = String(site.whatsapp).replace(/[^\d]/g, '');
const MESSAGE = encodeURIComponent(
  "Hi The International Business Hub, I'd like to talk about starting an international business."
);

export default function WhatsAppButton() {
  return (
    <motion.a
      className="wa-btn pulse-fab"
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${MESSAGE}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...spring.bouncy, delay: 1 }}
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.94 }}
    >
      <motion.span
        animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
        transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        style={{ display: 'inline-flex' }}
      >
        <FaWhatsapp aria-hidden="true" />
      </motion.span>
      <span className="wa-btn__label">Chat with us</span>
    </motion.a>
  );
}
