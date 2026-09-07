import DocumentUpload from './DocumentUpload.jsx';
import LegalNotice from './LegalNotice.jsx';

/**
 * "Documents" step — every required document that isn't the passport /
 * photograph (bank statement, flight itinerary, accommodation, insurance).
 * The whole step is skipped by the wizard when this list is empty.
 */
const HANDLED_ELSEWHERE = ['passport', 'photograph'];

export default function FinancialDocumentUpload({ applicationId, visa, documents, onChange }) {
  const types = visa.requiredDocuments.filter((t) => !HANDLED_ELSEWHERE.includes(t));
  const byType = (t) => documents.find((d) => d.type === t) || null;

  return (
    <div className="wiz-docs">
      {types.map((t) => (
        <DocumentUpload
          key={t}
          applicationId={applicationId}
          docType={t}
          doc={byType(t)}
          onUploaded={(meta) => onChange(t, meta)}
          onRemoved={() => onChange(t, null)}
        />
      ))}
      <LegalNotice compact />
    </div>
  );
}
