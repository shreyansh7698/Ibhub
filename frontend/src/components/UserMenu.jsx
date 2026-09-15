import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { getUserSession, isUserAuthenticated, userLogout } from '../services/userAuthService.js';

/**
 * Auth-aware header control. Shows a "Login" link when signed out; once
 * signed in, shows the applicant's name with a dropdown to their profile
 * and sign-out. Re-reads the session on every render, so it picks up a
 * fresh login/logout as soon as the header re-renders (route change).
 */
export default function UserMenu({ dark = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const session = isUserAuthenticated() ? getUserSession() : null;

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!session) {
    return (
      <Link to="/login" className={`user-menu__login ${dark ? 'user-menu__login--dark' : ''}`}>
        Login
      </Link>
    );
  }

  const firstName = (session.fullName || session.email || 'Account').split(' ')[0];

  const signOut = () => {
    setOpen(false);
    userLogout();
    navigate('/');
  };

  return (
    <div className={`user-menu ${dark ? 'user-menu--dark' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="user-menu__trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <User aria-hidden="true" />
        <span>{firstName}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <div className="user-menu__dropdown" role="menu">
          <Link to="/profile" className="user-menu__item" role="menuitem" onClick={() => setOpen(false)}>
            <User aria-hidden="true" /> My Profile
          </Link>
          <button type="button" className="user-menu__item" role="menuitem" onClick={signOut}>
            <LogOut aria-hidden="true" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
