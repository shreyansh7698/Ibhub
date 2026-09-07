/**
 * In-browser stand-in for the backend, used when VITE_USE_MOCK_API is on.
 *
 * WHAT IT PERSISTS (localStorage, key prefix `ibhub.mock.`):
 *   - application records: applicant fields, travel dates, document *metadata*,
 *     payment refs, status, timeline, notes, the fee sequence counter.
 *   This is the demo "database" so the admin dashboard survives a reload.
 *   In production this lives in an encrypted backend DB — never the browser.
 *
 * WHAT IT NEVER PERSISTS:
 *   - the actual uploaded files. Passport / bank-statement / other document
 *     blobs are kept ONLY in the module-level `blobStore` Map for the current
 *     tab session. They are never written to localStorage / sessionStorage /
 *     IndexedDB / cookies / URLs. Reloading the tab drops them — which is
 *     exactly what a private backend store would prevent, and the admin viewer
 *     says so.
 *
 * The frontend never decides payment success or application status — those come
 * back from these functions, standing in for server-verified responses.
 */
import { MOCK_LATENCY_MS, DEMO_ADMIN } from './config.js';
import { APPLICATION_STATUS, DOCUMENT_STATUS, PAYMENT_STATUS } from './types.js';
import { getTouristVisa, getVisaType, getTouristVisaSummary } from '../data/touristVisas.js';

const LS_APPS = 'ibhub.mock.applications';
const LS_SEQ = 'ibhub.mock.seq';

/* ---------------- non-persistent file store (session only) ---------------- */
const blobStore = new Map(); // documentId -> File/Blob

/* ---------------- helpers ---------------- */
const wait = (ms = MOCK_LATENCY_MS) => new Promise((r) => setTimeout(r, ms + Math.random() * 250));
const now = () => new Date().toISOString();
const rid = (p) => `${p}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

function readApps() {
  try {
    return JSON.parse(localStorage.getItem(LS_APPS) || '[]');
  } catch {
    return [];
  }
}
function writeApps(apps) {
  try {
    localStorage.setItem(LS_APPS, JSON.stringify(apps));
  } catch {
    /* quota / private mode — demo degrades to in-memory for this tab */
  }
}
function nextApplicationId() {
  let seq = 0;
  try {
    seq = parseInt(localStorage.getItem(LS_SEQ) || '0', 10) || 0;
  } catch {
    seq = 0;
  }
  seq += 1;
  try {
    localStorage.setItem(LS_SEQ, String(seq));
  } catch {
    /* ignore */
  }
  return `IBH-${new Date().getFullYear()}-${String(seq).padStart(6, '0')}`;
}

function event(type, label, extra = {}) {
  return { id: rid('EVT'), type, label, at: now(), ...extra };
}
function pushEvent(app, ev) {
  app.timeline = [...(app.timeline || []), ev];
  app.updatedAt = now();
}
function save(app) {
  const apps = readApps();
  const i = apps.findIndex((a) => a.id === app.id);
  if (i >= 0) apps[i] = app;
  else apps.unshift(app);
  writeApps(apps);
  return app;
}
function find(id) {
  return readApps().find((a) => a.id === id) || null;
}
const notFound = (what) => Promise.reject(new Error(`${what} not found`));

/* ---------------- applicant-facing ---------------- */

export async function createApplication({ countrySlug, visaTypeId }) {
  await wait(300);
  const visa = getTouristVisa(countrySlug);
  const summary = getTouristVisaSummary(countrySlug);
  if (!visa || !summary) return notFound('Destination');
  const vt = getVisaType(countrySlug, visaTypeId);
  const app = {
    id: nextApplicationId(),
    countrySlug,
    countryName: summary.name,
    countryCode: summary.code,
    visaTypeId: vt.id,
    visaTypeLabel: vt.label,
    applicant: {},
    travel: {},
    documents: [],
    payment: null,
    status: APPLICATION_STATUS.DRAFT,
    timeline: [event('application_created', 'Application created')],
    notes: [],
    createdAt: now(),
    updatedAt: now()
  };
  return save(app);
}

export async function getApplication(id) {
  await wait(250);
  return find(id) || notFound('Application');
}

export async function updateApplication(id, patch) {
  await wait();
  const app = find(id);
  if (!app) return notFound('Application');
  if (patch.visaTypeId && patch.visaTypeId !== app.visaTypeId) {
    const vt = getVisaType(app.countrySlug, patch.visaTypeId);
    app.visaTypeId = vt.id;
    app.visaTypeLabel = vt.label;
  }
  if (patch.applicant) app.applicant = { ...app.applicant, ...patch.applicant };
  if (patch.travel) app.travel = { ...app.travel, ...patch.travel };
  if (patch.step === 'applicant' && app.status === APPLICATION_STATUS.DRAFT) {
    app.status = APPLICATION_STATUS.DOCUMENTS_PENDING;
    pushEvent(app, event('applicant_submitted', 'Applicant information submitted'));
  }
  app.updatedAt = now();
  return save(app);
}

export async function uploadDocument(id, type, file) {
  await wait(700);
  const app = find(id);
  if (!app) return notFound('Application');
  const docId = rid('DOC');
  blobStore.set(docId, file); // session memory only — never persisted
  const meta = {
    id: docId,
    type,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || 'application/octet-stream',
    status: DOCUMENT_STATUS.PENDING,
    uploadedAt: now()
  };
  const prev = app.documents.find((d) => d.type === type);
  if (prev) {
    blobStore.delete(prev.id);
    app.documents = app.documents.map((d) => (d.type === type ? meta : d));
  } else {
    app.documents = [...app.documents, meta];
  }
  pushEvent(
    app,
    event(
      'document_uploaded',
      `${labelForDoc(type)} ${prev ? 'replaced' : 'uploaded'}`,
      { documentId: docId, fileName: file.name }
    )
  );
  save(app);
  return meta;
}

export async function removeDocument(id, docId) {
  await wait(300);
  const app = find(id);
  if (!app) return notFound('Application');
  blobStore.delete(docId);
  app.documents = app.documents.filter((d) => d.id !== docId);
  app.updatedAt = now();
  return save(app);
}

export async function listDocuments(id) {
  await wait(200);
  const app = find(id);
  if (!app) return notFound('Application');
  return app.documents;
}

/** Returns the in-session blob for a document, or null (production: signed URL / stream). */
export async function getDocumentBlob(docId) {
  await wait(120);
  return blobStore.has(docId) ? blobStore.get(docId) : null;
}

/* ---------------- payments (server owns pricing + verification) ---------------- */

export async function createPaymentOrder(id) {
  await wait(600);
  const app = find(id);
  if (!app) return notFound('Application');
  const vt = getVisaType(app.countrySlug, app.visaTypeId); // server-side price, ignores any client value
  const { visaFee, serviceFee, tax, currency } = vt.fees;
  const amount = visaFee + serviceFee + tax;
  app.payment = {
    orderId: rid('ORD'),
    paymentId: null,
    reference: null,
    gateway: 'demo',
    amount,
    currency,
    status: PAYMENT_STATUS.CREATED,
    breakdown: { visaFee, serviceFee, tax },
    paidAt: null
  };
  app.status = APPLICATION_STATUS.PAYMENT_PENDING;
  pushEvent(app, event('payment_initiated', 'Payment initiated'));
  save(app);
  return { ...app.payment };
}

/**
 * Stands in for POST /api/payments/verify. In production the backend verifies
 * the gateway signature and only then marks PAID. Here it always succeeds when a
 * "successful" simulated payment id is passed.
 */
export async function verifyPayment(orderId, { gatewayPaymentId, outcome = 'success' } = {}) {
  await wait(900);
  const apps = readApps();
  const app = apps.find((a) => a.payment && a.payment.orderId === orderId);
  if (!app) return notFound('Order');
  if (outcome !== 'success') {
    app.payment.status = PAYMENT_STATUS.FAILED;
    pushEvent(app, event('payment_failed', 'Payment failed'));
    save(app);
    return { verified: false, application: app };
  }
  app.payment.status = PAYMENT_STATUS.PAID;
  app.payment.paymentId = gatewayPaymentId || rid('PAY');
  app.payment.reference = rid('REF');
  app.payment.paidAt = now();
  app.status = APPLICATION_STATUS.PAID;
  pushEvent(app, event('payment_successful', 'Payment successful'));
  pushEvent(app, event('application_submitted', 'Application submitted for processing'));
  save(app);
  return { verified: true, application: app };
}

export async function getPayment(paymentId) {
  await wait(200);
  const app = readApps().find((a) => a.payment && a.payment.paymentId === paymentId);
  return app ? { ...app.payment, applicationId: app.id } : notFound('Payment');
}

/* ---------------- admin ---------------- */

export async function adminLogin(email, password) {
  await wait(500);
  const ok =
    String(email).trim().toLowerCase() === DEMO_ADMIN.email.toLowerCase() &&
    String(password) === DEMO_ADMIN.password;
  if (!ok) return Promise.reject(new Error('Invalid email or password.'));
  return {
    token: rid('TKN'),
    role: 'admin',
    email: DEMO_ADMIN.email,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString() // 4h
  };
}

export async function adminListApplications({
  search = '',
  country = '',
  visaType = '',
  paymentStatus = '',
  status = '',
  from = '',
  to = '',
  sort = 'createdAt',
  dir = 'desc',
  page = 1,
  pageSize = 10
} = {}) {
  await wait(400);
  let items = readApps();
  const q = search.trim().toLowerCase();
  if (q) {
    items = items.filter((a) => {
      const hay = [
        a.id,
        `${a.applicant.firstName || ''} ${a.applicant.lastName || ''}`,
        a.applicant.email || '',
        a.applicant.passportNumber || '',
        a.countryName,
        a.payment?.reference || '',
        a.payment?.orderId || ''
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (country) items = items.filter((a) => a.countrySlug === country);
  if (visaType) items = items.filter((a) => a.visaTypeId === visaType);
  if (status) items = items.filter((a) => a.status === status);
  if (paymentStatus) items = items.filter((a) => (a.payment?.status || 'NONE') === paymentStatus);
  if (from) items = items.filter((a) => a.createdAt >= from);
  if (to) items = items.filter((a) => a.createdAt <= `${to}T23:59:59.999Z`);

  items = [...items].sort((a, b) => {
    const av = sort === 'name' ? `${a.applicant.lastName || ''}` : a[sort] || '';
    const bv = sort === 'name' ? `${b.applicant.lastName || ''}` : b[sort] || '';
    return dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const total = items.length;
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, page, pageSize };
}

export async function adminGetStats() {
  await wait(300);
  const apps = readApps();
  const today = new Date().toISOString().slice(0, 10);
  const count = (fn) => apps.filter(fn).length;
  const revenue = apps
    .filter((a) => a.payment?.status === PAYMENT_STATUS.PAID)
    .reduce((s, a) => s + (a.payment.amount || 0), 0);
  return {
    total: apps.length,
    pendingReview: count((a) => a.status === APPLICATION_STATUS.UNDER_REVIEW),
    documentsPending: count((a) =>
      a.documents.some((d) => d.status === DOCUMENT_STATUS.PENDING) &&
      [APPLICATION_STATUS.PAID, APPLICATION_STATUS.UNDER_REVIEW, APPLICATION_STATUS.DOCUMENT_VERIFICATION].includes(a.status)
    ),
    paid: count((a) => a.payment?.status === PAYMENT_STATUS.PAID),
    processing: count((a) => a.status === APPLICATION_STATUS.PROCESSING),
    approved: count((a) => a.status === APPLICATION_STATUS.APPROVED),
    rejected: count((a) => a.status === APPLICATION_STATUS.REJECTED),
    today: count((a) => a.createdAt.slice(0, 10) === today),
    revenue,
    currency: apps.find((a) => a.payment)?.payment.currency || 'INR'
  };
}

export async function adminGetApplication(id) {
  await wait(300);
  return find(id) || notFound('Application');
}

export async function adminSetStatus(id, status, note) {
  await wait(450);
  const app = find(id);
  if (!app) return notFound('Application');
  app.status = status;
  pushEvent(app, event('status_changed', `Status changed to ${status.replace(/_/g, ' ').toLowerCase()}`, { by: 'Admin' }));
  if (note) app.notes = [...app.notes, { id: rid('NOTE'), body: note, at: now(), by: 'Admin' }];
  return save(app);
}

export async function adminSetDocumentStatus(docId, docStatus, reason) {
  await wait(400);
  const app = readApps().find((a) => a.documents.some((d) => d.id === docId));
  if (!app) return notFound('Document');
  app.documents = app.documents.map((d) =>
    d.id === docId ? { ...d, status: docStatus, rejectionReason: docStatus === DOCUMENT_STATUS.REJECTED ? reason || '' : undefined } : d
  );
  const doc = app.documents.find((d) => d.id === docId);
  pushEvent(
    app,
    event(
      docStatus === DOCUMENT_STATUS.VERIFIED ? 'document_verified' : 'document_rejected',
      `${labelForDoc(doc.type)} ${docStatus === DOCUMENT_STATUS.VERIFIED ? 'verified' : 'rejected'}`,
      { by: 'Admin', documentId: docId, reason }
    )
  );
  if (docStatus === DOCUMENT_STATUS.REJECTED) app.status = APPLICATION_STATUS.DOCUMENT_VERIFICATION;
  else if (app.documents.every((d) => d.status === DOCUMENT_STATUS.VERIFIED) && app.status === APPLICATION_STATUS.DOCUMENT_VERIFICATION) {
    app.status = APPLICATION_STATUS.PROCESSING;
    pushEvent(app, event('status_changed', 'All documents verified — application processing', { by: 'System' }));
  }
  return save(app);
}

export async function adminAddNote(id, body) {
  await wait(300);
  const app = find(id);
  if (!app) return notFound('Application');
  app.notes = [...app.notes, { id: rid('NOTE'), body, at: now(), by: 'Admin' }];
  pushEvent(app, event('note_added', 'Internal note added', { by: 'Admin', internal: true }));
  return save(app);
}

/* ---------------- misc ---------------- */
function labelForDoc(type) {
  return (
    {
      passport: 'Passport copy',
      photograph: 'Passport photograph',
      bank_statement: 'Bank statement',
      flight_itinerary: 'Flight itinerary',
      hotel_booking: 'Accommodation proof',
      travel_insurance: 'Travel insurance'
    }[type] || 'Document'
  );
}

/** Dev helper — wipe the demo store. Exposed on window in dev only. */
export function __resetMock() {
  blobStore.clear();
  try {
    localStorage.removeItem(LS_APPS);
    localStorage.removeItem(LS_SEQ);
  } catch {
    /* ignore */
  }
}
