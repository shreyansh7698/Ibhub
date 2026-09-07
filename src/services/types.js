/**
 * Shared shapes and registries for the tourist-visa application flow.
 * These describe the frontend's view of the data; the backend is the source of
 * truth for IDs, prices, status transitions and the audit timeline.
 */

/* ---------------- status enums ---------------- */

export const APPLICATION_STATUS = {
  DRAFT: 'DRAFT',
  DOCUMENTS_PENDING: 'DOCUMENTS_PENDING',
  READY_FOR_PAYMENT: 'READY_FOR_PAYMENT',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAID: 'PAID',
  UNDER_REVIEW: 'UNDER_REVIEW',
  DOCUMENT_VERIFICATION: 'DOCUMENT_VERIFICATION',
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED'
};

/** Statuses an admin may move an application to. */
export const ADMIN_STATUS_OPTIONS = [
  APPLICATION_STATUS.UNDER_REVIEW,
  APPLICATION_STATUS.DOCUMENT_VERIFICATION,
  APPLICATION_STATUS.PROCESSING,
  APPLICATION_STATUS.APPROVED,
  APPLICATION_STATUS.REJECTED,
  APPLICATION_STATUS.COMPLETED
];

export const APPLICATION_STATUS_LABELS = {
  DRAFT: 'Draft',
  DOCUMENTS_PENDING: 'Documents pending',
  READY_FOR_PAYMENT: 'Ready for payment',
  PAYMENT_PENDING: 'Payment pending',
  PAID: 'Payment completed',
  UNDER_REVIEW: 'Under review',
  DOCUMENT_VERIFICATION: 'Document verification',
  PROCESSING: 'Processing',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed'
};

/** UI tone per status: 'neutral' | 'progress' | 'positive' | 'negative' */
export const APPLICATION_STATUS_TONE = {
  DRAFT: 'neutral',
  DOCUMENTS_PENDING: 'neutral',
  READY_FOR_PAYMENT: 'neutral',
  PAYMENT_PENDING: 'progress',
  PAID: 'progress',
  UNDER_REVIEW: 'progress',
  DOCUMENT_VERIFICATION: 'progress',
  PROCESSING: 'progress',
  APPROVED: 'positive',
  REJECTED: 'negative',
  COMPLETED: 'positive'
};

export const DOCUMENT_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};

export const PAYMENT_STATUS = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED'
};

/* ---------------- document type registry ---------------- */

export const DOC_TYPES = {
  passport: {
    key: 'passport',
    label: 'Passport copy',
    description: 'A clear colour scan or photo of the photo page of your valid passport.',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptMimes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMB: 8,
    previewable: true
  },
  photograph: {
    key: 'photograph',
    label: 'Passport photograph',
    description: 'A recent passport-style photo — plain background, face clearly visible.',
    accept: '.jpg,.jpeg,.png',
    acceptMimes: ['image/jpeg', 'image/png'],
    maxSizeMB: 5,
    previewable: true
  },
  bank_statement: {
    key: 'bank_statement',
    label: 'Bank statement',
    description:
      'Your most recent 3–6 months of bank statements as required by the destination. This document is sensitive — it is stored privately and only seen by authorised staff.',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptMimes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMB: 12,
    previewable: false
  },
  flight_itinerary: {
    key: 'flight_itinerary',
    label: 'Flight itinerary',
    description: 'A confirmed or reserved return flight booking covering your travel dates.',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptMimes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMB: 8,
    previewable: true
  },
  hotel_booking: {
    key: 'hotel_booking',
    label: 'Accommodation proof',
    description: 'Hotel booking confirmation or an invitation letter with the host address.',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptMimes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMB: 8,
    previewable: true
  },
  travel_insurance: {
    key: 'travel_insurance',
    label: 'Travel insurance',
    description: 'A travel insurance policy covering your full stay, if required by the destination.',
    accept: '.pdf,.jpg,.jpeg,.png',
    acceptMimes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeMB: 8,
    previewable: true
  }
};

/* ---------------- standard applicant fields (§3) ---------------- */
// group: 'identity' | 'passport' | 'residence' | 'contact' | 'travel'

export const STANDARD_FIELDS = [
  { id: 'firstName', label: 'First name', type: 'text', required: true, group: 'identity', autoComplete: 'given-name' },
  { id: 'lastName', label: 'Last name', type: 'text', required: true, group: 'identity', autoComplete: 'family-name' },
  { id: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true, group: 'identity', autoComplete: 'bday' },
  {
    id: 'gender',
    label: 'Gender (as shown on passport)',
    type: 'select',
    required: true,
    group: 'identity',
    options: ['Female', 'Male', 'Other / X', 'Prefer not to say']
  },
  { id: 'nationality', label: 'Nationality', type: 'text', required: true, group: 'identity', autoComplete: 'country-name' },

  { id: 'passportNumber', label: 'Passport number', type: 'text', required: true, group: 'passport' },
  { id: 'passportIssueDate', label: 'Passport issue date', type: 'date', required: true, group: 'passport' },
  { id: 'passportExpiryDate', label: 'Passport expiry date', type: 'date', required: true, group: 'passport' },

  { id: 'countryOfResidence', label: 'Country of residence', type: 'text', required: true, group: 'residence', autoComplete: 'country-name' },
  { id: 'address', label: 'Current address', type: 'text', required: true, group: 'residence', autoComplete: 'street-address' },
  { id: 'city', label: 'City', type: 'text', required: true, group: 'residence', autoComplete: 'address-level2' },
  { id: 'state', label: 'State / province', type: 'text', required: false, group: 'residence', autoComplete: 'address-level1' },
  { id: 'postalCode', label: 'Postal code', type: 'text', required: false, group: 'residence', autoComplete: 'postal-code' },

  { id: 'phone', label: 'Phone number', type: 'tel', required: true, group: 'contact', autoComplete: 'tel' },
  { id: 'email', label: 'Email address', type: 'email', required: true, group: 'contact', autoComplete: 'email' },

  { id: 'travelStartDate', label: 'Travel start date', type: 'date', required: true, group: 'travel' },
  { id: 'travelEndDate', label: 'Travel end date', type: 'date', required: true, group: 'travel' }
];

export const FIELD_GROUPS = [
  { id: 'identity', label: 'Personal details' },
  { id: 'passport', label: 'Passport details' },
  { id: 'residence', label: 'Residential address' },
  { id: 'contact', label: 'Contact details' },
  { id: 'travel', label: 'Travel dates' }
];

/**
 * @typedef {Object} Applicant
 * @property {string} firstName @property {string} lastName @property {string} dateOfBirth
 * @property {string} gender @property {string} nationality
 * @property {string} passportNumber @property {string} passportIssueDate @property {string} passportExpiryDate
 * @property {string} countryOfResidence @property {string} address @property {string} city
 * @property {string} [state] @property {string} [postalCode]
 * @property {string} phone @property {string} email
 *
 * @typedef {Object} TravelDetails
 * @property {string} travelStartDate @property {string} travelEndDate
 *
 * @typedef {Object} VisaDocument
 * @property {string} id @property {string} type @property {string} fileName
 * @property {number} fileSize @property {string} mimeType
 * @property {'PENDING'|'VERIFIED'|'REJECTED'} status @property {string} [rejectionReason]
 * @property {string} uploadedAt
 *
 * @typedef {Object} Payment
 * @property {string} orderId @property {string} [paymentId] @property {string} [reference]
 * @property {string} gateway @property {number} amount @property {string} currency
 * @property {'CREATED'|'PENDING'|'PAID'|'FAILED'} status @property {string} [paidAt]
 * @property {{visaFee:number,serviceFee:number,tax:number}} breakdown
 *
 * @typedef {Object} TimelineEvent
 * @property {string} id @property {string} type @property {string} label
 * @property {string} at @property {string} [by] @property {boolean} [internal]
 *
 * @typedef {Object} Application
 * @property {string} id                e.g. IBH-2026-000123 (server-generated)
 * @property {string} countrySlug @property {string} countryName @property {string} countryCode
 * @property {string} visaTypeId @property {string} visaTypeLabel
 * @property {Applicant} applicant @property {TravelDetails} travel
 * @property {VisaDocument[]} documents
 * @property {Payment} [payment]
 * @property {keyof APPLICATION_STATUS} status
 * @property {TimelineEvent[]} timeline
 * @property {{id:string,body:string,at:string,by:string}[]} notes
 * @property {string} createdAt @property {string} updatedAt
 */
export {};
