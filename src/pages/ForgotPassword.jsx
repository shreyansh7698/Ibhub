import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import ApplicationLayout from '../components/application/ApplicationLayout.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';
import { isMock } from '../services/api.js';

export default function ForgotPassword() {
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
      const result = await api.userForgotPassword(email.trim());
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
      <Seo title="Forgot password" path="/forgot-password" noindex />
      <ApplicationLayout title="Forgot password" subtitle="We'll send you a reset link" exitTo="/login">
        <div className="auth-card">
          {sent ? (
            <div className="auth-success">
              <CheckCircle2 aria-hidden="true" />
              <h2>Check your email</h2>
              <p>
                If an account exists for <strong>{email}</strong>, we&rsquo;ve sent a link to reset
                your password.
              </p>
              {isMock && demoToken && (
                <div className="auth-note">
                  <ShieldAlert aria-hidden="true" />
                  <div>
                    <p>
                      <strong>Demo mode.</strong> There is no real email sending here — use this link
                      to continue the flow:
                    </p>
                    <Link to={`/reset-password?token=${demoToken}`}>
                      /reset-password?token={demoToken}
                    </Link>
                  </div>
                </div>
              )}
              <Link to="/login" className="btn btn--ghost-light btn--block">
                Back to log in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <p className="auth-card__intro">
                Enter the email you signed up with and we&rsquo;ll send you a link to reset your
                password.
              </p>
              <div className="field">
                <label htmlFor="fp-email">Email</label>
                <input
                  id="fp-email"
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
              <div className="auth-links">
                <Link to="/login">Back to log in</Link>
              </div>
            </form>
          )}
        </div>
      </ApplicationLayout>
    </>
  );
}
