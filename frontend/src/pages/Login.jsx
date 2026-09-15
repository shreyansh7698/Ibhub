import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import ApplicationLayout from '../components/application/ApplicationLayout.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';
import { setUserSession } from '../services/userAuthService.js';

/** Only ever navigate within this app — never follow an absolute/external URL from the query string. */
function safeRedirect(path) {
  return path && path.startsWith('/') && !path.startsWith('//') ? path : '/';
}

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirectTo = safeRedirect(params.get('redirect'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const session = await api.userLogin(email.trim(), password);
      setUserSession(session);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'We couldn’t sign you in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Seo title="Log in" path="/login" noindex />
      <ApplicationLayout
        title="Log in"
        subtitle="Sign in to continue your visa application"
        exitTo="/"
      >
        <div className="auth-card">
          <form onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="lg-email">Email</label>
              <input
                id="lg-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="lg-pass">Password</label>
              <input
                id="lg-pass"
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
                'Log in'
              )}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/forgot-password">Forgot password?</Link>
            <span>
              Don&rsquo;t have an account?{' '}
              <Link to={`/signup?redirect=${encodeURIComponent(redirectTo)}`}>Sign up</Link>
            </span>
          </div>
        </div>
      </ApplicationLayout>
    </>
  );
}
