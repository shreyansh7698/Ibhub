import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';
import { isMock } from '../services/api.js';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);
  const [demoToken, setDemoToken] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const result = await api.adminForgotPassword(email.trim());
      setDemoToken(result?.demoToken || null);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Admin forgot password" path="/admin/forgot-password" noindex />
      <div className="admin-login">
        <div className="admin-login__card">
          <div className="admin-login__brand">
            <span className="admin-login__mark">
              <KeyRound aria-hidden="true" />
            </span>
            <h1>Reset admin password</h1>
            <p>IBHUB Admin console</p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle2 aria-hidden="true" style={{ width: 36, height: 36, color: '#1c7c4a' }} />
              <p style={{ marginTop: 12 }}>
                If that email matches an admin account, we&rsquo;ve sent a link to reset the password.
              </p>
              {isMock && demoToken && (
                <div className="admin-login__demo">
                  <ShieldAlert aria-hidden="true" />
                  <div>
                    <p>
                      <strong>Demo mode.</strong> There is no real email sending here — use this link
                      to continue the flow:
                    </p>
                    <Link to={`/admin/reset-password?token=${demoToken}`}>
                      /admin/reset-password?token={demoToken}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="afp-email">Admin Email</label>
                <input
                  id="afp-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    <LoadingDots color="#fff" /> Sending…
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          )}

          <Link to="/admin/login" className="admin-login__back">
            ← Back to admin sign in
          </Link>
        </div>
      </div>
    </>
  );
}
