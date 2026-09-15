import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { DOCUMENT_STATUS } from '../../services/types.js';

export default function DocumentVerification({ doc, onVerify, onReject, busy }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState(doc.rejectionReason || '');

  if (doc.status === DOCUMENT_STATUS.VERIFIED) {
    return (
      <button type="button" className="docverify__undo" disabled={busy} onClick={() => onReject('Re-review requested')}>
        Verified — mark for re-review
      </button>
    );
  }

  if (rejecting) {
    return (
      <div className="docverify__reject">
        <label>
          Reason (sent to the applicant)
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Passport image is unclear. Please upload a clearer colour copy."
          />
        </label>
        <div className="docverify__reject-actions">
          <button type="button" className="btn btn--sm btn--coral" disabled={busy || !reason.trim()} onClick={() => onReject(reason.trim())}>
            Confirm rejection
          </button>
          <button type="button" className="btn btn--sm btn--outline" disabled={busy} onClick={() => setRejecting(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="docverify">
      <button type="button" className="docverify__yes" disabled={busy} onClick={onVerify}>
        <Check aria-hidden="true" /> Verify
      </button>
      <button type="button" className="docverify__no" disabled={busy} onClick={() => setRejecting(true)}>
        <X aria-hidden="true" /> Reject
      </button>
    </div>
  );
}
