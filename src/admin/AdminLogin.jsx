import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ShieldAlert } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';
import { isMock } from '../services/api.js';
import { DEMO_ADMIN } from '../services/config.js';
import { setSession } from '../services/authService.js';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await api.adminLogin(email.trim(), password);
      setSession(session);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message || 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Admin sign in" path="/admin/login" noindex />
      <div className="admin-login">
        <div className="admin-login__card">
          <div className="admin-login__brand">
            <span className="admin-login__mark">
              <Lock aria-hidden="true" />
            </span>
            <h1>IBHUB Admin</h1>
            <p>Visa applications console</p>
          </div>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="al-email">Email</label>
              <input
                id="al-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="al-pass">Password</label>
              <input
                id="al-pass"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="field__error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn--coral btn--lg btn--block" disabled={busy}>
              {busy ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <LoadingDots color="#fff" /> Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {isMock && (
            <div className="admin-login__demo">
              <ShieldAlert aria-hidden="true" />
              <div>
                <p>
                  <strong>Demo authentication.</strong> Production auth is handled entirely by the
                  backend / an identity provider with role-based access and session expiry — there is
                  no credential check in this frontend.
                </p>
                <p className="admin-login__creds">
                  Demo login: <code>{DEMO_ADMIN.email}</code> / <code>{DEMO_ADMIN.password}</code>
                </p>
              </div>
            </div>
          )}

          <Link to="/" className="admin-login__back">
            ← Back to ibhub.com
          </Link>
        </div>
      </div>
    </>
  );
}
