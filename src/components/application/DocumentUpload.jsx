import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, Image as ImageIcon, X, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { DOC_TYPES, DOCUMENT_STATUS } from '../../services/types.js';
import * as documentService from '../../services/documentService.js';

const fmtSize = (b) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

/**
 * Secure document uploader. The File object is handed straight to the service
 * layer and never stored in component state beyond the upload call. Only
 * metadata is kept. Preview is shown only for image types the config marks
 * `previewable` (bank statements never render).
 */
export default function DocumentUpload({ applicationId, docType, doc, onUploaded, onRemoved }) {
  const cfg = DOC_TYPES[docType];
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // build/tear down the (image) preview
  useEffect(() => {
    let url;
    let cancelled = false;
    if (doc && cfg.previewable && doc.mimeType?.startsWith('image/')) {
      documentService.getPreviewUrl(doc.id, applicationId).then((u) => {
        if (cancelled) {
          if (u) URL.revokeObjectURL(u);
          return;
        }
        url = u;
        setPreviewUrl(u);
      });
    } else {
      setPreviewUrl(null);
    }
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [doc, applicationId, cfg.previewable]);

  const handleFiles = async (fileList) => {
    const file = fileList?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    setProgress(0);
    try {
      const meta = await documentService.upload(applicationId, docType, file, setProgress);
      onUploaded(meta);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally {
      setBusy(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = async () => {
    if (!doc) return;
    setBusy(true);
    try {
      await documentService.remove(applicationId, doc.id);
      onRemoved();
    } finally {
      setBusy(false);
    }
  };

  const isImage = doc?.mimeType?.startsWith('image/');

  return (
    <div className={`doc-upload ${doc ? 'is-filled' : ''} ${error ? 'is-error' : ''}`}>
      <div className="doc-upload__head">
        <div>
          <h4>{cfg.label}</h4>
          <p>{cfg.description}</p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={cfg.accept}
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <AnimatePresence mode="wait">
        {!doc && !busy && (
          <motion.button
            key="drop"
            type="button"
            className={`doc-upload__drop ${dragging ? 'is-drag' : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UploadCloud aria-hidden="true" />
            <span className="doc-upload__drop-main">
              <strong>Click to upload</strong> or drag &amp; drop
            </span>
            <span className="doc-upload__drop-sub">
              {cfg.accept.replace(/\./g, '').toUpperCase().replace(/,/g, ' · ')} · up to {cfg.maxSizeMB} MB
            </span>
          </motion.button>
        )}

        {busy && (
          <motion.div key="busy" className="doc-upload__progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="doc-upload__bar">
              <motion.span className="doc-upload__bar-fill" animate={{ width: `${progress}%` }} transition={{ ease: 'linear', duration: 0.15 }} />
            </div>
            <span>Uploading… {progress}%</span>
          </motion.div>
        )}

        {doc && !busy && (
          <motion.div key="file" className="doc-upload__file" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="doc-upload__file-icon" aria-hidden="true">
              {previewUrl ? (
                <img src={previewUrl} alt="" />
              ) : isImage ? (
                <ImageIcon />
              ) : (
                <FileText />
              )}
            </div>
            <div className="doc-upload__file-meta">
              <strong title={doc.fileName}>{doc.fileName}</strong>
              <span>{fmtSize(doc.fileSize)}</span>
              <span className={`doc-upload__status doc-upload__status--${doc.status.toLowerCase()}`}>
                {doc.status === DOCUMENT_STATUS.VERIFIED && <CheckCircle2 aria-hidden="true" />}
                {doc.status === DOCUMENT_STATUS.REJECTED && <AlertCircle aria-hidden="true" />}
                {doc.status === DOCUMENT_STATUS.PENDING ? 'Uploaded' : doc.status === DOCUMENT_STATUS.VERIFIED ? 'Verified' : 'Needs replacement'}
              </span>
              {doc.status === DOCUMENT_STATUS.REJECTED && doc.rejectionReason && (
                <span className="doc-upload__reason">{doc.rejectionReason}</span>
              )}
            </div>
            <div className="doc-upload__file-actions">
              <button type="button" onClick={() => inputRef.current?.click()} title="Replace">
                <RefreshCw aria-hidden="true" /> Replace
              </button>
              <button type="button" onClick={remove} title="Remove" className="is-danger">
                <X aria-hidden="true" /> Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="doc-upload__error" role="alert">
          <AlertCircle aria-hidden="true" /> {error}
        </p>
      )}
      {!cfg.previewable && (
        <p className="doc-upload__note">
          For your security this document is not displayed back to you after upload.
        </p>
      )}
    </div>
  );
}
