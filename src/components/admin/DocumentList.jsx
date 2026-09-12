import { useState } from 'react';
import { Eye, FileText, ShieldCheck } from 'lucide-react';
import { DOC_TYPES, DOCUMENT_STATUS } from '../../services/types.js';
import DocumentViewer from './DocumentViewer.jsx';
import DocumentVerification from './DocumentVerification.jsx';
import * as api from '../../services/api.js';

const fmt = (iso) => new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
const fmtSize = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

export default function DocumentList({ application, onChange }) {
  const [viewing, setViewing] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const act = async (docId, status, reason) => {
  setBusyId(docId);

  try {
    const updated = await api.adminSetDocumentStatus(docId, status, reason);

    const updatedApplication = {
      ...application,
      documents: application.documents.map((doc) =>
        doc.id === updated.id
          ? {
              ...doc,
              status: updated.status,
              rejectionReason: updated.rejectionReason,
              updatedAt: updated.updatedAt,
            }
          : doc
      ),
    };

    onChange(updatedApplication);
  } finally {
    setBusyId(null);
  }
};

  return (
    <div className="doc-list">
      <p className="doc-list__notice">
        <ShieldCheck aria-hidden="true" />
        Documents are retrieved over an authorised, short-lived link and are never exposed at a public
        URL.
      </p>
      <ul>
        {application.documents.length === 0 && <li className="admin-empty">No documents uploaded.</li>}
        {application.documents.map((d) => (
          <li key={d.id} className={`doc-list__item is-${d.status.toLowerCase()}`}>
            <span className="doc-list__icon" aria-hidden="true">
              <FileText />
            </span>
            <div className="doc-list__meta">
              <strong>{DOC_TYPES[d.type]?.label || d.type}</strong>
              <span>
                {d.fileName} · {fmtSize(d.fileSize)} · {fmt(d.uploadedAt)}
              </span>
              <span className={`doc-list__status doc-list__status--${d.status.toLowerCase()}`}>
                {d.status === DOCUMENT_STATUS.PENDING ? 'Pending verification' : d.status === DOCUMENT_STATUS.VERIFIED ? 'Verified' : `Rejected${d.rejectionReason ? ` — ${d.rejectionReason}` : ''}`}
              </span>
            </div>
            <div className="doc-list__actions">
              <button type="button" className="doc-list__view" onClick={() => setViewing(d)}>
                <Eye aria-hidden="true" /> View
              </button>
              <DocumentVerification
                doc={d}
                busy={busyId === d.id}
                onVerify={() => act(d.id, DOCUMENT_STATUS.VERIFIED)}
                onReject={(reason) => act(d.id, DOCUMENT_STATUS.REJECTED, reason)}
              />
            </div>
          </li>
        ))}
      </ul>

      <DocumentViewer doc={viewing} applicationId={application.id} onClose={() => setViewing(null)} />
    </div>
  );
}
