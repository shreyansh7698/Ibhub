import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnnouncementBar from './AnnouncementBar.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import BackToTop from './BackToTop.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';
import ScrollProgress from '../motion/ScrollProgress.jsx';
import CustomCursor from '../motion/CustomCursor.jsx';
import ScrollRevealSections from '../motion/ScrollRevealSections.jsx';
import SkyAtmosphere from '../motion/SkyAtmosphere.jsx';
import ClickRipple from '../motion/anime/ClickRipple.jsx';
import useLenis from '../hooks/useLenis.js';
import useMediaTier, { isReduced } from '../hooks/useMediaTier.js';
import { EASE_OUT } from '../motion/presets.js';

export default function Layout() {
  const { pathname } = useLocation();
  const tier = useMediaTier();

  // Smooth scroll everywhere except reduced-motion (native scroll stays there).
  useLenis(!isReduced(tier));

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SkyAtmosphere />
      <ScrollProgress />
      <CustomCursor />
      <ScrollRevealSections />
      <ClickRipple />
      <AnnouncementBar />
      <Header />
      {/*
        Enter-only page transition — opacity only (no transform) so it never
        creates a containing block that would break ScrollTrigger pinning inside
        a page. `key={pathname}` remounts <main> on every route change.
      */}
      <motion.main
        id="main"
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}
