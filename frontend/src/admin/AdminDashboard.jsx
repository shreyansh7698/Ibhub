import { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader.jsx';
import DashboardCards from '../components/admin/DashboardCards.jsx';
import { StatusBadge } from '../components/application/ApplicationStatus.jsx';
import * as api from '../services/api.js';

const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short' });

export default function AdminDashboard() {
  const { email } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.adminGetStats().then(setStats).catch(() => {});
    api.adminListApplications({ page: 1, pageSize: 6, sort: 'createdAt', dir: 'desc' })
      .then((r) => setRecent(r.items))
      .catch(() => {});
  }, []);

  return (
    <>
      <AdminHeader title="Dashboard" email={email} />
      <DashboardCards stats={stats} />

      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2>Recent applications</h2>
          <Link to="/admin/applications" className="admin-link">
            View all <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="admin-empty">
            No applications yet. Complete a demo application from the{' '}
            <Link to="/visa-immigration/tourist-visa">tourist visa flow</Link> and it will appear here.
          </p>
        ) : (
          <ul className="admin-recent">
            {recent.map((a) => (
              <li key={a.id}>
                <Link to={`/admin/applications/${a.id}`}>
                  <span className="admin-recent__id">{a.id}</span>
                  <span className="admin-recent__name">
                    {a.applicant.firstName || '—'} {a.applicant.lastName || ''}
                  </span>
                  <span className="admin-recent__country">{a.countryName}</span>
                  <span className="admin-recent__date">{fmtDate(a.createdAt)}</span>
                  <StatusBadge status={a.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
