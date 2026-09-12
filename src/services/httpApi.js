/**
 * Real-backend implementation. Used when VITE_USE_MOCK_API=false.
 * Same function signatures as mockApi.js so `api.js` can swap them 1:1.
 *
 * Nothing here is exercised in the demo — it exists so the frontend is ready to
 * drop onto the API contract in the plan. Auth token is read from the auth
 * service (sessionStorage) and sent as a Bearer header; document bytes are never
 * handled here beyond a multipart POST and a fetch of a server-issued URL/stream.
 */
import { API_BASE_URL } from './config.js';
import { getToken as getAdminToken } from './authService.js';
import { getUserToken } from './userAuthService.js';

async function req(path, { method = 'GET', body, isForm } = {}) {
  const headers = {};
  // Admin routes carry the admin's token; every other route carries the
  // applicant's. Neither session is ever set unless that flow's login succeeded.
  const token = path.startsWith('/admin') ? getAdminToken() : getUserToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: isForm ? body : body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.message || `Request failed (${res.status})`);
  }
  return res.status === 204 ? null : res.json();
}

/* applicant-facing */
export const createApplication = (payload) => req('/applications', { method: 'POST', body: payload });
export const getApplication = (id) => req(`/applications/${id}`);
export const updateApplication = (id, patch) => req(`/applications/${id}`, { method: 'PATCH', body: patch });

export async function uploadDocument(id, type, file) {
  const form = new FormData();
  form.append('document_type', type);
  form.append('file', file);

  const doc = await req(`/applications/${id}/documents`, {
    method: 'POST',
    body: form,
    isForm: true
  });

  return {
    id: doc.id,
    type: doc.document_type,
    fileName: doc.original_filename,
    fileSize: Number(doc.file_size),
    mimeType: doc.content_type,
    status: doc.status,
    rejectionReason: doc.rejection_reason,
    uploadedAt: doc.created_at
  };
}
export const removeDocument = (id, docId) =>
  req(`/applications/${id}/documents/${docId}`, { method: 'DELETE' });
export const listDocuments = (id) => req(`/applications/${id}/documents`);

/** Production: a short-lived signed URL from the backend; we fetch it into a Blob. */
export async function getDocumentBlob(docId, applicationId) {
  const token = getToken();

  const res = await fetch(
    `${API_BASE_URL}/applications/${applicationId}/documents/${docId}/access`,
    {
      method: 'GET',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      credentials: 'include',
    }
  );

  return res.ok ? res.blob() : null;
}

/* payments */
export const createPaymentOrder = (id) =>
  req('/payments/create-order', { method: 'POST', body: { applicationId: id } });
export const verifyPayment = (orderId, payload) =>
  req('/payments/verify', { method: 'POST', body: { orderId, ...payload } });
export const getPayment = (paymentId) => req(`/payments/${paymentId}`);

/* user auth
 * PLACEHOLDER endpoint paths — none of these exist on the backend yet. Adjust
 * the paths below to match whatever the backend actually exposes; nothing
 * else in this file needs to change since api.js/UI call through these names.
 */
export const userSignup = (payload) => req('/auth/signup', { method: 'POST', body: payload });
export const userLogin = (email, password) =>
  req('/auth/login', { method: 'POST', body: { email, password } });
export const userForgotPassword = (email) =>
  req('/auth/forgot-password', { method: 'POST', body: { email } });
export const userResetPassword = (token, password) =>
  req('/auth/reset-password', { method: 'POST', body: { token, password } });

/* admin */
export const adminLogin = (email, password) =>
  req('/admin/login', { method: 'POST', body: { email, password } });
/* PLACEHOLDER — admin/login exists on the backend already; these two do not yet. */
export const adminForgotPassword = (email) =>
  req('/admin/forgot-password', { method: 'POST', body: { email } });
export const adminResetPassword = (token, password) =>
  req('/admin/reset-password', { method: 'POST', body: { token, password } });
export const adminListApplications = (query) => {
  const qs = new URLSearchParams(
    Object.entries(query || {}).filter(([, v]) => v !== '' && v != null)
  ).toString();
  return req(`/admin/applications${qs ? `?${qs}` : ''}`);
};
export const adminGetStats = () => req('/admin/stats');
export const adminGetApplication = (id) => req(`/admin/applications/${id}`);
export const adminSetStatus = (id, status, note) =>
  req(`/admin/applications/${id}/status`, { method: 'PATCH', body: { status, note } });
export const adminSetDocumentStatus = (docId, status, reason) =>
  req(`/admin/documents/${docId}/status`, { method: 'PATCH', body: { status, reason } });
export const adminAddNote = (id, body) =>
  req(`/admin/applications/${id}/notes`, { method: 'POST', body: { body } });

export const __resetMock = () => {};
