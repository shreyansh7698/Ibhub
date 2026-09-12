import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import ApplicationLayout from '../components/application/ApplicationLayout.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';
import { setUserSession } from '../services/userAuthService.js';

function safeRedirect(path) {
  return path && path.startsWith('/') && !path.startsWith('//') ? path : '/';
}

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = safeRedirect(params.get('redirect'));

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);

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
      const session = await api.userSignup({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password
      });
      setUserSession(session);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'We couldn’t create your account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Create an account" path="/signup" noindex />
      <ApplicationLayout
        title="Create an account"
        subtitle="Sign up to start your visa application"
        exitTo="/"
      >
        <div className="auth-card">
          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="su-name">Full Name</label>
              <input
                id="su-name"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="su-email">Email</label>
              <input
                id="su-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="su-phone">Phone Number</label>
              <input
                id="su-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="su-pass">Password</label>
              <input
                id="su-pass"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="su-confirm">Confirm Password</label>
              <input
                id="su-confirm"
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
                  <LoadingDots color="#fff" /> Creating account…
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="auth-links">
            <span>
              Already have an account?{' '}
              <Link to={`/login?redirect=${encodeURIComponent(redirectTo)}`}>Log in</Link>
            </span>
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}
