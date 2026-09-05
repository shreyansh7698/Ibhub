import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import AnimatedText from '../motion/AnimatedText.jsx';
import ScrambleText from '../motion/ScrambleText.jsx';
import Parallax from '../motion/Parallax.jsx';
import Magnetic from '../motion/Magnetic.jsx';
import ParticleField from '../motion/ParticleField.jsx';
import WaveDivider from '../motion/WaveDivider.jsx';
import MorphBlob from '../motion/MorphBlob.jsx';
import ThreeGlobe from '../motion/ThreeGlobeLazy.jsx';
import { staggerContainer, staggerItem, spring } from '../motion/presets.js';

/**
 * Reusable dark hero for inner pages.
 * @param {{label: string, to?: string}[]} breadcrumbs
 * @param {{label: string, to: string, variant?: string, external?: boolean}[]} actions
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs = [],
  actions = [],
  flag,
  image,
  center = false
}) {
  return (
    <section className={`page-hero ${center ? 'page-hero--center' : ''}`}>
      {image && (
        <Parallax
          speed={-0.15}
          className="page-hero__bg"
          aria-hidden="true"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="starfield" aria-hidden="true" />
      <ThreeGlobe className="page-hero__globe" color="#4f83ff" />
      <ParticleField color="120,160,255" linkColor="90,130,255" density="0.7" speed={0.18} />
      <Parallax speed={0.25} className="bg-grid" as="div" />
      <MorphBlob color="#2f6bff" size={380} opacity={0.5} style={{ top: -150, right: -50 }} />
      <div className="container">
        <motion.div
          className="page-hero__inner"
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="show"
        >
          {breadcrumbs.length > 0 && (
            <motion.nav className="breadcrumbs" aria-label="Breadcrumb" variants={staggerItem}>
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  {i > 0 && <ChevronRight aria-hidden="true" />}
                  {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                </span>
              ))}
            </motion.nav>
          )}

          {flag && (
            <motion.img
              className="page-hero__flag"
              src={flag}
              alt=""
              style={{ marginBottom: 16 }}
              initial={{ opacity: 0, rotateY: 90, scale: 0.6 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{ ...spring.bouncy, delay: 0.2 }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {eyebrow && (
            <motion.span className="eyebrow" variants={staggerItem}>
              <ScrambleText text={eyebrow} />
            </motion.span>
          )}
          <AnimatedText as="h1" text={title} delay={0.15} />
          {subtitle && (
            <motion.p variants={staggerItem}>
              {subtitle}
            </motion.p>
          )}

          {actions.length > 0 && (
            <motion.div className="stack-btns" variants={staggerItem}>
              {actions.map((a) =>
                a.external ? (
                  <Magnetic key={a.label}>
                    <motion.a
                      href={a.to}
                      className={`btn ${a.variant || 'btn--primary'} btn--lg`}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={spring.soft}
                    >
                      {a.label}
                    </motion.a>
                  </Magnetic>
                ) : (
                  <Magnetic key={a.label}>
                    <motion.span
                      style={{ display: 'inline-block' }}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      transition={spring.soft}
                    >
                      <Link to={a.to} className={`btn ${a.variant || 'btn--primary'} btn--lg`}>
                        {a.label}
                      </Link>
                    </motion.span>
                  </Magnetic>
                )
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
      <WaveDivider fill="#ffffff" height={64} />
    </section>
  );
}
