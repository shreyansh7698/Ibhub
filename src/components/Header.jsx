import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { navItems } from '../data/navigation.js';
import logoUrl from '../assets/Logo.png';

function Logo({ onClick }) {
  return (
    <Link to="/" className="logo" onClick={onClick} aria-label="The International Business Hub — home">
      <motion.span
        className="logo"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <img src={logoUrl} alt="IB Hub" />
      </motion.span>

      {/* <img
            src={Logo}
            alt="IB Hub"
            className="logo__text"
          /> */}
    </Link>
  );
}

function DesktopDropdown({ item }) {
  return (
    <div className="dropdown" role="menu">
      {item.menu.map((entry) => (
        <Link key={entry.to + entry.label} to={entry.to} className="dropdown__link" role="menuitem">
          {item.menuKind === 'flag' && entry.flag && (
            <img
              className="dropdown__flag"
              src={entry.flag}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
              }}
            />
          )}
          {item.menuKind === 'icon' && entry.icon && (
            <span className="dropdown__ico" aria-hidden="true">
              <entry.icon />
            </span>
          )}
          <span>
            {entry.label}
            {entry.hint && <small>{entry.hint}</small>}
          </span>
        </Link>
      ))}
    </div>
  );
}

function DesktopNav() {
  return (
    <nav className="nav" aria-label="Primary">
      {navItems.map((item) =>
        item.type === 'dropdown' ? (
          <div key={item.label} className="nav__item">
            <NavLink
              to={item.to}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
              aria-haspopup="true"
            >
              {item.label}
              <ChevronDown aria-hidden="true" />
            </NavLink>
            <DesktopDropdown item={item} />
          </div>
        ) : (
          <div key={item.label} className="nav__item">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          </div>
        )
      )}
    </nav>
  );
}

function MobileDrawer({ open, onClose }) {
  const [openGroup, setOpenGroup] = useState(null);

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawer-overlay"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className="drawer"
            role="dialog"
            aria-label="Menu"
            aria-modal="true"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="drawer__head">
              <Logo onClick={onClose} />
              <button type="button" className="drawer__close" onClick={onClose} aria-label="Close menu">
                <X aria-hidden="true" />
              </button>
            </div>
            <motion.div
              className="drawer__body"
              variants={{ show: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } } }}
              initial="hidden"
              animate="show"
            >
              {navItems.map((item) =>
                item.type === 'dropdown' ? (
                  <motion.div
                    className="drawer__group"
                    key={item.label}
                    variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0 } }}
                  >
                    <button
                      type="button"
                      className="drawer__toggle"
                      aria-expanded={openGroup === item.label}
                      onClick={() => setOpenGroup(openGroup === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown aria-hidden="true" />
                    </button>
                    <AnimatePresence initial={false}>
                      {openGroup === item.label && (
                        <motion.div
                          className="drawer__sub"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                        >
                          <Link to={item.to} className="drawer__sublink" onClick={onClose}>
                            All {item.label}
                          </Link>
                          {item.menu.map((entry) => (
                            <Link
                              key={entry.to + entry.label}
                              to={entry.to}
                              className="drawer__sublink"
                              onClick={onClose}
                            >
                              {entry.flag && (
                                <img
                                  src={entry.flag}
                                  alt=""
                                  loading="lazy"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              )}
                              {entry.icon && <entry.icon size={16} aria-hidden="true" />}
                              {entry.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div
                    className="drawer__group"
                    key={item.label}
                    variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0 } }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) => `drawer__link ${isActive ? 'is-active' : ''}`}
                      onClick={onClose}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                )
              )}
              <motion.div variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0 } }}>
                <Link to="/contact" className="btn btn--primary btn--block drawer__cta" onClick={onClose}>
                  Book Consultation
                </Link>
              </motion.div>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <motion.header
      className={`header ${scrolled ? 'header--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 26 }}
    >
      <div className="container header__inner">
        <Logo />
        <DesktopNav />
        <div className="header__actions">
          <motion.span
            style={{ display: 'inline-block' }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/contact" className="btn btn--primary btn--sm has-sheen">
              Book Consultation
            </Link>
          </motion.span>
          <motion.button
            type="button"
            className="hamburger"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            whileTap={{ scale: 0.88 }}
            whileHover={{ rotate: 6 }}
          >
            <Menu aria-hidden="true" />
          </motion.button>
        </div>
      </div>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </motion.header>
  );
}
