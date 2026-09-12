import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';

export default function AdminResetPassword() {
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
      await api.adminResetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message || 'This reset link is invalid or has expired.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Admin reset password" path="/admin/reset-password" noindex />
      <div className="admin-login">
        <div className="admin-login__card">
          <div className="admin-login__brand">
            <span className="admin-login__mark">
              <Lock aria-hidden="true" />
            </span>
            <h1>Reset admin password</h1>
            <p>IBHUB Admin console</p>
          </div>

          {done ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle2 aria-hidden="true" style={{ width: 36, height: 36, color: '#1c7c4a' }} />
              <p style={{ margin: '12px 0 20px' }}>
                Your admin password has been reset. You can now sign in with your new password.
              </p>
              <Link to="/admin/login" className="btn btn--coral btn--block">
                Go to admin sign in
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
                <label htmlFor="arp-pass">New Password</label>
                <input
                  id="arp-pass"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="arp-confirm">Confirm Password</label>
                <input
                  id="arp-confirm"
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

          <Link to="/admin/login" className="admin-login__back">
            ← Back to admin sign in
          </Link>
        </div>
      </div>
    </>
  );
}
