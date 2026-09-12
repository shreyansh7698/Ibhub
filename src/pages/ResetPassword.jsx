import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import ApplicationLayout from '../components/application/ApplicationLayout.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('This reset link is invalid or has expired.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    try {
      await api.userResetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message || 'This reset link is invalid or has expired.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Reset password" path="/reset-password" noindex />
      <ApplicationLayout title="Reset password" subtitle="Choose a new password" exitTo="/login">
        <div className="auth-card">
          {done ? (
            <div className="auth-success">
              <CheckCircle2 aria-hidden="true" />
              <h2>Password updated</h2>
              <p>Your password has been reset. You can now log in with your new password.</p>
              <Link to="/login" className="btn btn--coral btn--block">
                Go to log in
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              {!token && (
                <p className="field__error" role="alert">
                  This reset link is missing its token — please use the link from your email.
                </p>
              )}
              <div className="field">
                <label htmlFor="rp-pass">New Password</label>
                <input
                  id="rp-pass"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="rp-confirm">Confirm Password</label>
                <input
                  id="rp-confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <LoadingDots color="#fff" /> Resetting…
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </ApplicationLayout>
    </>
  );
}
