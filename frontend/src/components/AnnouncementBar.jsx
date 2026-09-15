import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <motion.div
      className="announcement"
      role="region"
      aria-label="Announcement"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="announcement__inner">
        <span className="announcement__text">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-flex' }}
          >
            <Globe aria-hidden="true" />
          </motion.span>
          Build Your Business Beyond Borders — International Company Formation Made Simple.
        </span>
        <Link to="/contact" className="announcement__cta">
          Get Started{' '}
          <motion.span
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ display: 'inline-flex' }}
          >
            <ArrowRight aria-hidden="true" />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}
