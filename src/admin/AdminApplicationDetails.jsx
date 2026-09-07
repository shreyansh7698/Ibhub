import { useEffect, useState } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader.jsx';
import ApplicationDetails from '../components/admin/ApplicationDetails.jsx';
import { StatusBadge } from '../components/application/ApplicationStatus.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';

export default function AdminApplicationDetails() {
  const { applicationId } = useParams();
  const { email } = useOutletContext();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setApplication(null);
    setError(false);
    api
      .adminGetApplication(applicationId)
      .then(setApplication)
      .catch(() => setError(true));
  }, [applicationId]);

  return (
    <>
      <AdminHeader title="Application detail" email={email} />

      <Link to="/admin/applications" className="admin-link admin-link--back">
        <ArrowLeft aria-hidden="true" /> All applications
      </Link>

      {error && <p className="admin-empty">Application {applicationId} was not found.</p>}
      {!error && !application && (
        <p className="admin-panel__loading">
          <LoadingDots /> loading application…
        </p>
      )}

      {application && (
        <>
          <div className="app-detail__banner">
            <div>
              <span className="app-detail__id">{application.id}</span>
              <h2>
                {application.applicant.firstName || '—'} {application.applicant.lastName || ''} ·{' '}
                {application.countryName}
              </h2>
            </div>
            <StatusBadge status={application.status} />
          </div>
          <ApplicationDetails application={application} onChange={setApplication} />
        </>
      )}
    </>
  );
}
