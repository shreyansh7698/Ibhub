import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldAlert, Loader } from 'lucide-react';
import { DOC_TYPES } from '../../services/types.js';
import * as documentService from '../../services/documentService.js';

const fmt = (iso) => new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

/**
 * Modal document viewer.
 *
 * In production the bytes come from a short-lived, admin-authorised signed URL /
 * stream from `GET /api/admin/applications/:id/documents/:documentId`. Here they
 * come from the session's in-memory store (or not at all after a reload — which
 * the "not available" panel makes explicit). The object URL is revoked on close;
 * download is a deliberate click, never automatic.
 */
export default function DocumentViewer({ doc, applicationId, onClose }) {
  const [state, setState] = useState('loading'); // loading | ready | unavailable
  const [url, setUrl] = useState(null);
  const cfg = DOC_TYPES[doc?.type] || {};

  useEffect(() => {
    if (!doc) return undefined;
    let objectUrl;
    let cancelled = false;
    setState('loading');
    documentService
      .getPreviewUrl(doc.id, applicationId)
      .then((u) => {
        if (cancelled) {
          if (u) URL.revokeObjectURL(u);
          return;
        }
        if (u) {
          objectUrl = u;
          setUrl(u);
          setState('ready');
        } else {
          setState('unavailable');
        }
      })
      .catch(() => !cancelled && setState('unavailable'));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [doc, applicationId]);

  const isImage = doc?.mimeType?.startsWith('image/');
  const isPdf = doc?.mimeType === 'application/pdf';

  return (
    <AnimatePresence>
      {doc && (
        <motion.div className="docv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="docv__scrim" onClick={onClose} />
          <motion.div
            className="docv__panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-label={`${cfg.label} viewer`}
          >
            <header className="docv__head">
              <div>
                <h3>{cfg.label || doc.type}</h3>
                <p>
                  {doc.fileName} · uploaded {fmt(doc.uploadedAt)}
                </p>
              </div>
              <div className="docv__head-actions">
                {url && (
                  <a href={url} download={doc.fileName} className="docv__dl">
                    <Download aria-hidden="true" /> Download
                  </a>
                )}
                <button type="button" onClick={onClose} aria-label="Close">
                  <X aria-hidden="true" />
                </button>
              </div>
            </header>

            <div className="docv__body">
              {state === 'loading' && (
                <div className="docv__state">
                  <Loader aria-hidden="true" className="spin" /> Retrieving document…
                </div>
              )}
              {state === 'ready' && isImage && <img src={url} alt={cfg.label} />}
              {state === 'ready' && isPdf && <object data={url} type="application/pdf" aria-label={cfg.label}>PDF preview unavailable — use Download.</object>}
              {state === 'ready' && !isImage && !isPdf && (
                <div className="docv__state">
                  Preview not supported for this file type. Use <strong>Download</strong>.
                </div>
              )}
              {state === 'unavailable' && (
                <div className="docv__state docv__state--secure">
                  <ShieldAlert aria-hidden="true" />
                  <p>
                    <strong>Document held in private storage.</strong> In production this streams from
                    the backend over a short-lived, admin-authorised URL. In this demo the file only
                    exists in the browser tab where it was uploaded, so it isn't available here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
