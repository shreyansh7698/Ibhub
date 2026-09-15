import { Link } from 'react-router-dom';
import { Pencil, CheckCircle2, FileText } from 'lucide-react';
import { DOC_TYPES } from '../../services/types.js';
import { fieldsForVisa } from './ApplicantInformationForm.jsx';
import PaymentSummary from './PaymentSummary.jsx';
import LegalNotice from './LegalNotice.jsx';

const fmtSize = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

export default function ReviewApplication({
  visa,
  visaType,
  applicant,
  documents,
  confirmAccurate,
  confirmConsent,
  onToggleAccurate,
  onToggleConsent,
  onEdit
}) {
  const fields = fieldsForVisa(visa);
  const identity = fields.filter((f) => ['identity', 'passport', 'residence', 'contact'].includes(f.group));
  const travel = fields.filter((f) => f.group === 'travel');
  const showValue = (id) => applicant[id] || <span className="review__empty">—</span>;

  return (
    <div className="review">
      <section className="review__card">
        <header>
          <h3>Visa information</h3>
        </header>
        <dl className="review__grid">
          <div>
            <dt>Destination</dt>
            <dd>{visa.name}</dd>
          </div>
          <div>
            <dt>Visa type</dt>
            <dd>{visaType.label}</dd>
          </div>
          <div>
            <dt>Length of stay</dt>
            <dd>{visaType.stayDuration}</dd>
          </div>
          <div>
            <dt>Processing time</dt>
            <dd>{visaType.processingTime}</dd>
          </div>
        </dl>
      </section>

      <section className="review__card">
        <header>
          <h3>Applicant information</h3>
          <button type="button" className="review__edit" onClick={() => onEdit('applicant')}>
            <Pencil aria-hidden="true" /> Edit
          </button>
        </header>
        <dl className="review__grid">
          {identity.map((f) => (
            <div key={f.id}>
              <dt>{f.label}</dt>
              <dd>{showValue(f.id)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="review__card">
        <header>
          <h3>Travel information</h3>
          <button type="button" className="review__edit" onClick={() => onEdit('applicant')}>
            <Pencil aria-hidden="true" /> Edit
          </button>
        </header>
        <dl className="review__grid">
          {travel.map((f) => (
            <div key={f.id}>
              <dt>{f.label}</dt>
              <dd>{showValue(f.id)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="review__card">
        <header>
          <h3>Documents</h3>
          <button type="button" className="review__edit" onClick={() => onEdit('passport')}>
            <Pencil aria-hidden="true" /> Edit
          </button>
        </header>
        <ul className="review__docs">
          {documents.length === 0 && <li className="review__empty">No documents uploaded.</li>}
          {documents.map((d) => (
            <li key={d.id}>
              <CheckCircle2 aria-hidden="true" />
              <span className="review__doc-type">{DOC_TYPES[d.type]?.label || d.type}</span>
              <span className="review__doc-file">
                <FileText aria-hidden="true" /> {d.fileName} · {fmtSize(d.fileSize)}
              </span>
            </li>
          ))}
        </ul>
        <p className="review__note">
          Document contents are not shown here. They are stored privately and reviewed only by
          authorised staff.
        </p>
      </section>

      <section className="review__card review__card--pay">
        <PaymentSummary breakdown={visaType.fees} currency={visaType.fees.currency} heading="Estimated fees" muted />
      </section>

      <LegalNotice />

      <div className="review__confirm">
        <label className="checkbox">
          <input type="checkbox" checked={confirmAccurate} onChange={onToggleAccurate} />
          <span>I confirm that the information and documents provided are accurate and complete.</span>
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={confirmConsent} onChange={onToggleConsent} />
          <span>
            I have read and accept the <Link to="/privacy-policy">Privacy Policy</Link>,{' '}
            <Link to="/terms">Terms &amp; Conditions</Link> and the visa assistance disclaimer, and I
            consent to IBHUB processing my information and documents for this application.
          </span>
        </label>
      </div>
    </div>
  );
}
