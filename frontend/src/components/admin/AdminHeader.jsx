import { isMock } from '../../services/api.js';

export default function AdminHeader({ title, email }) {
  return (
    <header className="admin-head">
      <h1>{title}</h1>
      <div className="admin-head__right">
        {isMock && <span className="admin-head__demo">Demo mode</span>}
        <span className="admin-head__user">{email || 'Admin'}</span>
      </div>
    </header>
  );
}
