import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import DemoModeBanner from '../components/DemoModeBanner.jsx';
import AdminSidebar from '../components/admin/AdminSidebar.jsx';
import { getSession, logout } from '../services/authService.js';

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/applications': 'Applications'
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const session = getSession();

  const signOut = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const title =
    TITLES[location.pathname] ||
    (location.pathname.startsWith('/admin/applications/') ? 'Application detail' : 'Admin');

  return (
    <>
      <Seo title="Admin" path="/admin" noindex />
      <div className={`admin ${navOpen ? 'admin--nav-open' : ''}`}>
        <button
          type="button"
          className="admin__nav-toggle"
          onClick={() => setNavOpen((o) => !o)}
          aria-label={navOpen ? 'Close menu' : 'Open menu'}
        >
          {navOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
        {navOpen && <div className="admin__scrim" onClick={() => setNavOpen(false)} />}
        <AdminSidebar onSignOut={signOut} />
        <div className="admin__content">
          <DemoModeBanner variant="bar" />
          <div className="admin__inner">
            <Outlet context={{ title, email: session?.email }} />
          </div>
        </div>
      </div>
    </>
  );
}
