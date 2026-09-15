import { STANDARD_FIELDS } from '../../services/types.js';
import { getVisaType } from '../../data/touristVisas.js';
import ApplicationTimeline from '../application/ApplicationTimeline.jsx';
import PaymentDetails from './PaymentDetails.jsx';
import DocumentList from './DocumentList.jsx';
import StatusSelector from './StatusSelector.jsx';
import AdminNotes from './AdminNotes.jsx';

const labelFor = (id) => STANDARD_FIELDS.find((f) => f.id === id)?.label || id;

function DlGrid({ entries }) {
  return (
    <dl className="review__grid">
      {entries.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v || '—'}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function ApplicationDetails({ application, onChange }) {
  const a = application.applicant || {};
  const t = application.travel || {};
  const vt = getVisaType(application.countrySlug, application.visaTypeId);

  const identityIds = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'nationality'];
  const passportIds = ['passportNumber', 'passportIssueDate', 'passportExpiryDate'];
  const residenceIds = ['countryOfResidence', 'address', 'city', 'state', 'postalCode', 'phone', 'email'];

  return (
    <div className="app-detail">
      <div className="app-detail__main">
        <section className="admin-panel">
          <h2>Applicant information</h2>
          <h3 className="app-detail__sub">Personal</h3>
          <DlGrid entries={identityIds.map((id) => [labelFor(id), a[id]])} />
          <h3 className="app-detail__sub">Passport</h3>
          <DlGrid entries={passportIds.map((id) => [labelFor(id), a[id]])} />
          <h3 className="app-detail__sub">Residence &amp; contact</h3>
          <DlGrid entries={residenceIds.map((id) => [labelFor(id), a[id]])} />
        </section>

        <section className="admin-panel">
          <h2>Travel &amp; visa</h2>
          <DlGrid
            entries={[
              ['Destination', application.countryName],
              ['Visa type', application.visaTypeLabel],
              ['Length of stay', vt?.stayDuration],
              ['Entry type', vt?.entryType],
              ['Travel start', t.travelStartDate],
              ['Travel end', t.travelEndDate]
            ]}
          />
        </section>

        <section className="admin-panel">
          <h2>Payment information</h2>
          <PaymentDetails payment={application.payment} />
        </section>

        <section className="admin-panel">
          <h2>Documents</h2>
          <DocumentList application={application} onChange={onChange} />
        </section>
      </div>

      <aside className="app-detail__aside">
        <section className="admin-panel">
          <h2>Status</h2>
          <StatusSelector application={application} onChange={onChange} />
        </section>
        <section className="admin-panel">
          <h2>Timeline</h2>
          <ApplicationTimeline timeline={application.timeline} showInternal />
        </section>
        <section className="admin-panel">
          <h2>Internal notes</h2>
          <AdminNotes application={application} onChange={onChange} />
        </section>
      </aside>
    </div>
  );
}
