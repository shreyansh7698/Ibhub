import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import logoUrl from '../../assets/Logo.png';
import DemoModeBanner from '../DemoModeBanner.jsx';

/** Minimal, focused chrome for the application wizard — no marketing nav. */
export default function ApplicationLayout({ title, subtitle, exitTo = '/visa-immigration/tourist-visa', children }) {
  return (
    <div className="app-shell">
      <DemoModeBanner variant="bar" />
      <header className="app-shell__head">
        <div className="app-shell__head-inner">
          <Link to="/" className="app-shell__logo" aria-label="The International Business Hub — home">
            <img src={logoUrl} alt="IB Hub" />
          </Link>
          <div className="app-shell__title">
            <span className="app-shell__eyebrow">
              <Lock aria-hidden="true" /> Secure application
            </span>
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          <Link to={exitTo} className="app-shell__exit">
            Save &amp; exit
          </Link>
        </div>
      </header>
      <main className="app-shell__main">{children}</main>
      <footer className="app-shell__foot">
        <p>
          IBHUB provides visa application assistance. Visa issuance is decided by the relevant
          authority; payment does not guarantee approval.
        </p>
        <p>
          <Link to="/privacy-policy">Privacy</Link>
          <span aria-hidden="true"> · </span>
          <Link to="/terms">Terms</Link>
        </p>
      </footer>
    </div>
  );
}
