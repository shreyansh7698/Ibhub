import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileStack, LogOut } from 'lucide-react';
import logoUrl from '../../assets/Logo.png';

export default function AdminSidebar({ onSignOut }) {
  return (
    <aside className="admin-nav">
      <div className="admin-nav__brand">
        <img src={logoUrl} alt="IB Hub" />
        <span>Admin</span>
      </div>
      <nav>
        <NavLink to="/admin" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
          <LayoutDashboard aria-hidden="true" /> Dashboard
        </NavLink>
        <NavLink to="/admin/applications" className={({ isActive }) => (isActive ? 'is-active' : '')}>
          <FileStack aria-hidden="true" /> Applications
        </NavLink>
      </nav>
      <button type="button" className="admin-nav__signout" onClick={onSignOut}>
        <LogOut aria-hidden="true" /> Sign out
      </button>
    </aside>
  );
}
