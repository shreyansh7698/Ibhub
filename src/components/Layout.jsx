import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnnouncementBar from './AnnouncementBar.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import BackToTop from './BackToTop.jsx';
import WhatsAppButton from './WhatsAppButton.jsx';
import ScrollProgress from '../motion/ScrollProgress.jsx';
import CursorGlow from '../motion/CursorGlow.jsx';
import CursorTrail from '../motion/CursorTrail.jsx';
import ScrollRevealSections from '../motion/ScrollRevealSections.jsx';
import ClickRipple from '../motion/anime/ClickRipple.jsx';
import { EASE_OUT } from '../motion/presets.js';

export default function Layout() {
  const { pathname } = useLocation();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollProgress />
      <CursorGlow />
      <CursorTrail />
      <ScrollRevealSections />
      <ClickRipple />
      <AnnouncementBar />
      <Header />
      {/*
        Enter-only page transition. `key={pathname}` remounts <main> on every
        route change so the animation replays. We deliberately do NOT use
        AnimatePresence "exit" here: <Outlet/> is not location-aware, so an
        exit pass can strand the incoming page on the exit target styles
        (blank page until reload).
      */}
      <motion.main
        id="main"
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </>
  );
}
