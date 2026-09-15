import DocumentUpload from './DocumentUpload.jsx';

/**
 * Passport step. Always collects the passport copy; also the passport photograph
 * when the destination requires one.
 */
export default function PassportUpload({ applicationId, visa, documents, onChange }) {
  const needsPhoto = visa.requiredDocuments.includes('photograph');
  const byType = (t) => documents.find((d) => d.type === t) || null;

  return (
    <div className="wiz-docs">
      <DocumentUpload
        applicationId={applicationId}
        docType="passport"
        doc={byType('passport')}
        onUploaded={(meta) => onChange('passport', meta)}
        onRemoved={() => onChange('passport', null)}
      />
      {needsPhoto && (
        <DocumentUpload
          applicationId={applicationId}
          docType="photograph"
          doc={byType('photograph')}
          onUploaded={(meta) => onChange('photograph', meta)}
          onRemoved={() => onChange('photograph', null)}
        />
      )}
    </div>
  );
}
