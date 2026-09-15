/**
 * Thin wrapper around document upload/preview so components don't touch the
 * transport directly. Client-side validation here is a UX convenience only — the
 * production backend MUST re-validate the actual file bytes and type.
 */
import * as api from './api.js';
import { DOC_TYPES } from './types.js';

export function validateFile(file, docType) {
  const cfg = DOC_TYPES[docType];
  if (!cfg) return 'Unknown document type.';
  const ext = `.${(file.name.split('.').pop() || '').toLowerCase()}`;
  const extOk = cfg.accept.split(',').includes(ext);
  const mimeOk = !file.type || cfg.acceptMimes.includes(file.type);
  if (!extOk && !mimeOk) return `Accepted formats: ${cfg.accept}`;
  if (file.size > cfg.maxSizeMB * 1024 * 1024) {
    return `File is too large. Maximum ${cfg.maxSizeMB} MB.`;
  }
  if (file.size === 0) return 'That file appears to be empty.';
  return null;
}

export async function upload(applicationId, docType, file, onProgress) {
  const err = validateFile(file, docType);
  if (err) throw new Error(err);
  // simulated progress for the demo; real uploads use XHR/fetch progress events
  if (onProgress) {
    for (let p = 12; p < 100; p += 22) {
      onProgress(p);
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 120));
    }
  }
  const meta = await api.uploadDocument(applicationId, docType, file);
  onProgress?.(100);
  return meta;
}

export const remove = (applicationId, docId) => api.removeDocument(applicationId, docId);

/**
 * Returns an object URL for previewing a document, or null if the bytes aren't
 * available (production: not authorised / expired signed URL; demo: uploaded in
 * a different tab session). Caller MUST revoke the URL when done.
 */
export async function getPreviewUrl(docId, applicationId) {
  const blob = await api.getDocumentBlob(docId, applicationId);
  return blob ? URL.createObjectURL(blob) : null;
}
