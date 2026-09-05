import { Link } from 'react-router-dom';
import { color, motion } from 'framer-motion';
import { Rocket, CalendarClock, Globe2, Building2, Headphones } from 'lucide-react';
import WorldMap from './WorldMap.jsx';
import { media } from '../data/images.js';
import heroVideo from '../assets/Ibhub video.mp4';
import AnimatedText from '../motion/AnimatedText.jsx';
import ScrambleText from '../motion/ScrambleText.jsx';
import Typewriter from '../motion/Typewriter.jsx';
import Magnetic from '../motion/Magnetic.jsx';
import Parallax from '../motion/Parallax.jsx';
import ParticleField from '../motion/ParticleField.jsx';
import MorphBlob from '../motion/MorphBlob.jsx';
import ThreeGlobe from '../motion/ThreeGlobeLazy.jsx';
import { staggerContainer, staggerItem, spring } from '../motion/presets.js';

const taglines = [
  'International company formation, done right.',
  'Banking introductions across 25+ markets.',
  'Accounting, tax and compliance — handled.',
  'One accountable team, every jurisdiction.'
];

const floatCards = [
  { className: 'float-card--1', icon: Globe2, strong: '25+', span: 'Countries' },
  { className: 'float-card--2', icon: Building2, strong: '1,500+', span: 'Businesses assisted' },
  { className: 'float-card--3', icon: Headphones, strong: 'Global', span: 'Support, all time zones' }
];

export default function Hero() {
  return (
    <section className="hero">
      <motion.video
        className="hero__bg-video"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
      <div className="hero__bg-scrim" aria-hidden="true" />
      <ParticleField color="47,107,255" linkColor="120,150,235" density="0.5" speed={0.16} maxParticles={60} />
      <MorphBlob color="#4d82ff" size={460} opacity={0.5} style={{ top: -160, right: -80 }} />
      <MorphBlob color="#d4af37" size={340} opacity={0.22} style={{ bottom: -140, left: -90 }} />
      <div className="container hero__grid">
        <motion.div
          className="hero__content"
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="show"
        >
          <motion.span className="eyebrow" variants={staggerItem}>
            <ScrambleText text="International Business Consultancy" />
          </motion.span>
          <h1>
            <AnimatedText text="Build Your Business" delay={0.1} />{' '}
            <motion.span
              className="accent"
              style={{ display: 'inline-block' }}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              Anywhere in the World
            </motion.span>
          </h1>
          <motion.p className="hero__sub" variants={staggerItem}>
            From international company formation to banking, compliance, accounting and visa assistance,
            we help entrepreneurs build and expand their businesses globally.
          </motion.p>
          <motion.div className="hero__ticker" variants={staggerItem}>
            <Typewriter text={taglines} as="span" />
          </motion.div>
          <motion.div className="stack-btns" variants={staggerItem}>
            <Magnetic>
              <motion.span
                style={{ display: 'inline-block' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={spring.soft}
              >
                <Link to="/company-formation" className="btn btn--primary btn--lg has-sheen">
                  <Rocket aria-hidden="true" />
                  Start Your Company
                </Link>
              </motion.span>
            </Magnetic>
            <Magnetic>
              <motion.span
                style={{ display: 'inline-block' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                transition={spring.soft}
              >
                <Link to="/contact" className="btn btn--outline btn--lg">
                  <CalendarClock aria-hidden="true" />
                 Book Free Consultation
                </Link>
              </motion.span>
            </Magnetic>
          </motion.div>
          <motion.div className="hero__trust" variants={staggerItem}>
            <div className="hero__trust-avatars" aria-hidden="true">
              {['PN', 'DO', 'SR', 'ML'].map((a, i) => (
                <motion.span
                  key={a}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ ...spring.bouncy, delay: 0.9 + i * 0.08 }}
                >
                  {a}
                </motion.span>
              ))}
            </div>
            <span>Trusted by founders expanding into 25+ markets worldwide.</span>
          </motion.div>
        </motion.div>

        <Parallax speed={0.12} className="hero__visual-wrap">
          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.9, rotateY: 12 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            <img
              className="hero__photo"
              src={media.teamCollaboration}
              alt="An international advisory team working together"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="hero__visual-scrim" aria-hidden="true" />
            <ThreeGlobe className="hero__globe" color="#5b8bff" />
            <WorldMap />
            {floatCards.map((card, i) => (
              <motion.div
                key={card.className}
                className={`float-card ${card.className}`}
                initial={{ opacity: 0, y: 24, scale: 0.8 }}
                animate={{ opacity: 1, y: [0, -10, 0], scale: 1 }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.7 + i * 0.2 },
                  scale: { ...spring.bouncy, delay: 0.7 + i * 0.2 },
                  y: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: 0.7 + i * 0.2 }
                }}
                whileHover={{ scale: 1.06, rotate: i % 2 ? 2 : -2 }}
              >
                <span className="float-card__ico" aria-hidden="true">
                  <card.icon />
                </span>
                <div>
                  <strong>{card.strong}</strong>
                  <span>{card.span}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Parallax>
      </div>
    </section>
  );
}
