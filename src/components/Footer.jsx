import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import { site } from '../data/site.js';
import useReveal from '../motion/useReveal.js';
import Tooltip from '../motion/Tooltip.jsx';
import darkLogoUrl from '../assets/Dark logo.png';

const colReveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const formationLinks = [
  { label: 'USA', to: '/company-formation/usa' },
  { label: 'UK', to: '/company-formation/uk' },
  { label: 'UAE', to: '/company-formation/uae' },
  { label: 'Singapore', to: '/company-formation/singapore' },
  { label: 'Hong Kong', to: '/company-formation/hong-kong' },
  { label: 'Europe', to: '/company-formation/europe' }
];

const serviceLinks = [
  { label: 'Banking Assistance', to: '/services/bank-account-assistance' },
  // { label: 'Accounting', to: '/services/accounting-tax' },
  // { label: 'Tax', to: '/services/accounting-tax' },
  { label: 'Virtual Office', to: '/services/virtual-office' },
  { label: 'Visa Services', to: '/visa-immigration' },
  // { label: 'Compliance', to: '/services/corporate-compliance' },
  { label: 'Trademark Registration', to: '/services/trademark-registration' },
  { label: 'Buy a Business', to: '/services/buy-a-business' }
];

const companyLinks = [
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  // { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms' }
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [topRef, topShow] = useReveal({ amount: 0.15 });
  const [botRef, botShow] = useReveal({ amount: 0.4 });

  return (
    <footer className="footer">
      <motion.div
        className="bg-blob"
        style={{ width: 380, height: 380, background: '#2f6bff', top: -120, right: -80 }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.55, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="container">
        <motion.div
          ref={topRef}
          className="footer__top"
          initial="hidden"
          animate={topShow ? 'show' : 'hidden'}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div className="footer__brand" variants={colReveal}>
            <Link to="/" className="logo" aria-label="The International Business Hub — home">
              <span className="footerlogo">
                        <img src={darkLogoUrl} alt="IB Hub" />
              </span>
            </Link>
            <p className="footer__desc">
              Helping entrepreneurs establish, manage and expand businesses across international markets.
            </p>
            <div className="footer__social">
              {[
                { label: 'LinkedIn', href: site.social.linkedin, Icon: FaLinkedinIn },
                { label: 'Facebook', href: site.social.facebook, Icon: FaFacebookF },
                { label: 'Instagram', href: site.social.instagram, Icon: FaInstagram },
                { label: 'YouTube', href: site.social.youtube, Icon: FaYoutube }
              ].map(({ label, href, Icon }) => (
                <Tooltip key={label} label={label}>
                  <motion.a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    whileHover={{ y: -4, scale: 1.12 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <Icon aria-hidden="true" />
                  </motion.a>
                </Tooltip>
              ))}
            </div>
          </motion.div>

          <motion.div className="footer__col" variants={colReveal}>
            <h4>Company Formation</h4>
            <ul>
              {formationLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="footer__col" variants={colReveal}>
            <h4>Services</h4>
            <ul>
              {serviceLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="footer__col" variants={colReveal}>
            <h4>Company</h4>
            <ul>
              {companyLinks.map((l) => (
                <li key={l.to + l.label}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="footer__col" variants={colReveal}>
            <h4>Contact</h4>
            <ul className="footer__contact">
              <li>
                <Mail aria-hidden="true" />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <MapPin aria-hidden="true" />
                <span>{site.address}</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          ref={botRef}
          className="footer__bottom"
          initial={{ opacity: 0 }}
          animate={{ opacity: botShow ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <p>© {year} The International Business Hub. All rights reserved.</p>
          <nav aria-label="Legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/terms">Disclaimer</Link>
          </nav>
        </motion.div>

        <p className="footer__disclaimer">
          The International Business Hub provides business setup and administrative assistance. We are not a law firm,
          bank, or licensed tax or immigration adviser, and nothing on this website is legal, tax, or
          investment advice. Company registration, bank account opening, visa issuance, and other outcomes
          are subject to eligibility criteria and the approval of the relevant authority or institution.
          Where regulated advice is required, we coordinate with licensed partners. All names, testimonials,
          and figures shown are illustrative examples.
        </p>
      </div>
    </footer>
  );
}
