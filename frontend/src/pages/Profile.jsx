import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import { StatusBadge } from '../components/application/ApplicationStatus.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';
import { getUserSession } from '../services/userAuthService.js';

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

function ProfileInfo() {
  const cached = getUserSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.getMyProfile().then(setProfile).catch(() => {});
  }, []);

  const data = profile || { fullName: cached?.fullName, email: cached?.email, phone: null };

  return (
    <div className="profile-card">
      <h2>Account details</h2>
      <dl className="profile-card__grid">
        <div>
          <dt>Full name</dt>
          <dd>{data.fullName || '—'}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{data.email || '—'}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>{data.phone || '—'}</dd>
        </div>
      </dl>
    </div>
  );
}

function ApplicationsList() {
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .listMyApplications()
      .then(setApplications)
      .catch(() => setError(true));
  }, []);

  return (
    <div className="profile-card">
      <h2>My visa applications</h2>
      {error && <p className="profile-card__empty">We couldn't load your applications. Please try again later.</p>}
      {!error && !applications && (
        <div className="wiz-loading">
          <LoadingDots /> Loading…
        </div>
      )}
      {applications && applications.length === 0 && (
        <p className="profile-card__empty">
          You haven't started a visa application yet.{' '}
          <Link to="/visa-immigration/tourist-visa">Start a tourist visa application</Link>.
        </p>
      )}
      {applications && applications.length > 0 && (
        <ul className="profile-apps">
          {applications.map((a) => (
            <li key={a.id}>
              <Link to={`/application/${a.id}`} className="profile-apps__row">
                <div>
                  <span className="profile-apps__country">{a.countryName}</span>
                  <span className="profile-apps__visa">{a.visaTypeLabel}</span>
                </div>
                <span className="profile-apps__date">{fmtDate(a.createdAt)}</span>
                <StatusBadge status={a.status} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message || 'Could not change your password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="profile-card">
      <h2>Change password</h2>
      <form onSubmit={submit} noValidate className="profile-card__form">
        <div className="field">
          <label htmlFor="pw-current">Current password</label>
          <input
            id="pw-current"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="pw-new">New password</label>
          <input
            id="pw-new"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="pw-confirm">Confirm new password</label>
          <input
            id="pw-confirm"
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
        {success && <p className="profile-card__success">Password updated.</p>}
        <button type="submit" className="btn btn--coral" disabled={busy}>
          {busy ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

export default function Profile() {
  return (
    <>
      <Seo title="My Profile" path="/profile" noindex />
      <div className="profile-page">
        <div className="container">
          <h1>My Profile</h1>
          <div className="profile-page__grid">
            <ProfileInfo />
            <ApplicationsList />
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}
