import { useEffect, useState } from 'react';
import { useLocation, useParams, useSearchParams, Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import ApplicationLayout from '../components/application/ApplicationLayout.jsx';
import ApplicationConfirmationCard from '../components/application/ApplicationConfirmationCard.jsx';
import ApplicationTimeline from '../components/application/ApplicationTimeline.jsx';
import { LoadingDots } from '../motion/feedback.jsx';
import * as api from '../services/api.js';

export default function ApplicationConfirmation() {
  const { countrySlug } = useParams();
  const location = useLocation();
  const [params] = useSearchParams();
  const applicationId = location.state?.applicationId || params.get('id');

  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!applicationId) {
      setError('missing');
      return;
    }
    api
      .getApplication(applicationId)
      .then(setApplication)
      .catch(() => setError('notfound'));
  }, [applicationId]);

  return (
    <>
      <Seo title="Application submitted" path={`/visa-application/${countrySlug}/confirmation`} noindex />
      <ApplicationLayout title="Application submitted" exitTo="/visa-immigration/tourist-visa">
        <div className="confirm-page">
          {error && (
            <div className="confirm-page__empty">
              <h2>We couldn't find that application</h2>
              <p>
                {error === 'missing'
                  ? 'This page needs an application reference. If you completed a payment, check your email for your application ID.'
                  : 'That application reference did not match anything in this session.'}
              </p>
              <Link to="/visa-immigration/tourist-visa" className="btn btn--coral">
                Back to tourist visas
              </Link>
            </div>
          )}

          {!error && !application && (
            <div className="wiz-loading">
              <LoadingDots /> Loading your confirmation…
            </div>
          )}

          {application && (
            <div className="confirm-page__grid">
              <ApplicationConfirmationCard application={application} />
              <aside className="confirm-page__timeline">
                <h3>What happens next</h3>
                <ApplicationTimeline timeline={application.timeline} />
              </aside>
            </div>
          )}
        </div>
      </ApplicationLayout>
    </>
  );
}
