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
import { getToken } from './authService.js';

async function req(path, { method = 'GET', body, isForm } = {}) {
  const headers = {};
  const token = getToken();
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

export function uploadDocument(id, type, file) {
  const form = new FormData();
  form.append('type', type);
  form.append('file', file);
  return req(`/applications/${id}/documents`, { method: 'POST', body: form, isForm: true });
}
export const removeDocument = (id, docId) =>
  req(`/applications/${id}/documents/${docId}`, { method: 'DELETE' });
export const listDocuments = (id) => req(`/applications/${id}/documents`);

/** Production: a short-lived signed URL from the backend; we fetch it into a Blob. */
export async function getDocumentBlob(docId, applicationId) {
  const { url } = await req(`/applications/${applicationId}/documents/${docId}/access`);
  const res = await fetch(url);
  return res.ok ? res.blob() : null;
}

/* payments */
export const createPaymentOrder = (id) =>
  req('/payments/create-order', { method: 'POST', body: { applicationId: id } });
export const verifyPayment = (orderId, payload) =>
  req('/payments/verify', { method: 'POST', body: { orderId, ...payload } });
export const getPayment = (paymentId) => req(`/payments/${paymentId}`);

/* admin */
export const adminLogin = (email, password) =>
  req('/admin/login', { method: 'POST', body: { email, password } });
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
