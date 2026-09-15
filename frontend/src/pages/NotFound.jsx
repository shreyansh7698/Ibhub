import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import ParticleField from '../motion/ParticleField.jsx';
import GlitchText from '../motion/GlitchText.jsx';
import { FloatBlob } from '../motion/feedback.jsx';
import { staggerContainer, staggerItem, spring } from '../motion/presets.js';

export default function NotFound() {
  return (
    <div className="page">
      <Seo title="Page Not Found" description="The page you are looking for could not be found." path="/404" />
      <div className="notfound container" style={{ position: 'relative', overflow: 'hidden' }}>
        <ParticleField color="47,107,255" linkColor="120,150,235" density="0.5" />
        <motion.div variants={staggerContainer(0.12)} initial="hidden" animate="show" style={{ position: 'relative', zIndex: 1 }}>
          <FloatBlob className="notfound__badge">
            <motion.span
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ ...spring.bouncy, delay: 0.1 }}
              style={{ display: 'inline-flex' }}
            >
              <Compass size={52} aria-hidden="true" />
            </motion.span>
          </FloatBlob>

          <motion.h1
            variants={staggerItem}
            style={{ fontSize: 'clamp(4rem, 14vw, 8rem)', lineHeight: 1 }}
          >
            <GlitchText text="404" as="span" trigger="always" />
          </motion.h1>
          <motion.p variants={staggerItem}>
            The page you’re looking for doesn’t exist or has moved.
          </motion.p>
          <motion.div className="stack-btns" style={{ justifyContent: 'center' }} variants={staggerItem}>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
              <Link to="/" className="btn btn--primary btn--lg">
                Back to Home
              </Link>
            </motion.span>
            <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
              <Link to="/contact" className="btn btn--outline btn--lg">
                Contact Us
              </Link>
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
