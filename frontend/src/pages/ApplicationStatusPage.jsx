import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import ApplicationLayout from '../components/application/ApplicationLayout.jsx';
import ApplicationStatus from '../components/application/ApplicationStatus.jsx';
import ApplicationTimeline from '../components/application/ApplicationTimeline.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';
import { DOC_TYPES, DOCUMENT_STATUS } from '../services/types.js';

/** Public-ish status lookup by application ID (non-sensitive identifier). */
export default function ApplicationStatusPage() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .getApplication(applicationId)
      .then(setApplication)
      .catch(() => setError(true));
  }, [applicationId]);

  return (
    <>
      <Seo title={`Application ${applicationId}`} path={`/application/${applicationId}`} noindex />
      <ApplicationLayout title="Application status" exitTo="/visa-immigration/tourist-visa">
        <div className="status-page">
          {error && (
            <div className="confirm-page__empty">
              <h2>Application not found</h2>
              <p>That application reference didn't match anything available in this browser session.</p>
              <Link to="/visa-immigration/tourist-visa" className="btn btn--coral">
                Back to tourist visas
              </Link>
            </div>
          )}
          {!error && !application && (
            <div className="wiz-loading">
              <LoadingDots /> Loading…
            </div>
          )}
          {application && (
            <div className="status-page__grid">
              <div>
                <ApplicationStatus application={application} />
                <div className="status-page__docs">
                  <h3>Documents</h3>
                  <ul>
                    {application.documents.map((d) => (
                      <li key={d.id} className={`is-${d.status.toLowerCase()}`}>
                        <span>{DOC_TYPES[d.type]?.label || d.type}</span>
                        <span className="status-page__doc-state">
                          {d.status === DOCUMENT_STATUS.VERIFIED
                            ? 'Verified'
                            : d.status === DOCUMENT_STATUS.REJECTED
                              ? `Action needed${d.rejectionReason ? ` — ${d.rejectionReason}` : ''}`
                              : 'Received'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <aside>
                <h3>Timeline</h3>
                <ApplicationTimeline timeline={application.timeline} />
              </aside>
            </div>
          )}
        </div>
      </ApplicationLayout>
    </>
  );
}
