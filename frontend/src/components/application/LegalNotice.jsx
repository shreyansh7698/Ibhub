import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

/** Privacy + visa disclaimer shown around the application and payment steps. */
export default function LegalNotice({ compact = false }) {
  return (
    <div className={`legal-notice ${compact ? 'legal-notice--compact' : ''}`}>
      <ShieldCheck aria-hidden="true" />
      <div>
        <p>
          Your information and documents are used only to prepare and submit your visa application.
          Documents are handled privately and accessed solely by authorised IBHUB staff for that
          purpose, in line with our{' '}
          <Link to="/privacy-policy">Privacy Policy</Link> and{' '}
          <Link to="/terms">Terms &amp; Conditions</Link>.
        </p>
        {!compact && (
          <p className="legal-notice__disclaimer">
            IBHUB provides visa application assistance and related services. Visa issuance and approval
            are decided by the relevant immigration or government authority. Payment for IBHUB services
            confirms submission of your application and does <strong>not</strong> guarantee visa
            approval.
          </p>
        )}
      </div>
    </div>
  );
}
