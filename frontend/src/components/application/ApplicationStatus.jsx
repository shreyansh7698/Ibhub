import { APPLICATION_STATUS, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_TONE } from '../../services/types.js';

/** The high-level stages an applicant sees. */
const STAGES = [
  { key: 'submitted', label: 'Application submitted', reached: (s) => s !== APPLICATION_STATUS.DRAFT && s !== APPLICATION_STATUS.DOCUMENTS_PENDING && s !== APPLICATION_STATUS.READY_FOR_PAYMENT },
  { key: 'paid', label: 'Payment completed', reached: (s, p) => p === 'PAID' },
  { key: 'review', label: 'Under review', reached: (s) => [APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.DOCUMENT_VERIFICATION, APPLICATION_STATUS.PROCESSING, APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.COMPLETED].includes(s) },
  { key: 'processing', label: 'Processing', reached: (s) => [APPLICATION_STATUS.PROCESSING, APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.COMPLETED].includes(s) },
  { key: 'outcome', label: 'Outcome', reached: (s) => [APPLICATION_STATUS.APPROVED, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.COMPLETED].includes(s) }
];

export function StatusBadge({ status }) {
  const tone = APPLICATION_STATUS_TONE[status] || 'neutral';
  return <span className={`status-badge status-badge--${tone}`}>{APPLICATION_STATUS_LABELS[status] || status}</span>;
}

export default function ApplicationStatus({ application }) {
  const s = application.status;
  const p = application.payment?.status;
  // Destinations with no payment step never create a Payment record. Once such
  // an application has moved past the pre-payment statuses, we know payment was
  // never required (rather than merely not yet reached), so drop that stage
  // instead of leaving it permanently unchecked.
  const paymentNotRequired =
    !application.payment &&
    s !== APPLICATION_STATUS.DRAFT &&
    s !== APPLICATION_STATUS.DOCUMENTS_PENDING &&
    s !== APPLICATION_STATUS.READY_FOR_PAYMENT &&
    s !== APPLICATION_STATUS.PAYMENT_PENDING;
  const stages = paymentNotRequired ? STAGES.filter((stage) => stage.key !== 'paid') : STAGES;
  return (
    <div className="app-status">
      <div className="app-status__head">
        <span className="app-status__id">Application {application.id}</span>
        <StatusBadge status={s} />
      </div>
      <ol className="app-status__track">
        {stages.map((stage) => {
          const done = stage.reached(s, p);
          return (
            <li key={stage.key} className={done ? 'is-done' : ''}>
              <span className="app-status__dot" aria-hidden="true" />
              {stage.label}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
