/**
 * Tourist-visa data model. `getTouristVisa(slug)` returns a merged record
 * (DEFAULTS + per-country overrides). Fees, processing times and requirements
 * here are indicative demo values — in production the backend owns them and
 * revalidates on every order.
 */
import { visaCountries } from './services.js';

const REGION = {
  ae: 'Middle East', om: 'Middle East', qa: 'Middle East', bh: 'Middle East', kw: 'Middle East', jo: 'Middle East',
  th: 'Asia Pacific', vn: 'Asia Pacific', my: 'Asia Pacific', id: 'Asia Pacific', hk: 'Asia Pacific',
  lk: 'Asia Pacific', la: 'Asia Pacific', bt: 'Asia Pacific', bd: 'Asia Pacific', sg: 'Asia Pacific', jp: 'Asia Pacific',
  mv: 'Indian Ocean',
  az: 'Caucasus & Central Asia', ge: 'Caucasus & Central Asia', kg: 'Caucasus & Central Asia', ru: 'Europe & CIS',
  ie: 'Europe', tr: 'Europe',
  eg: 'Africa', za: 'Africa', ke: 'Africa', ma: 'Africa', tz: 'Africa', et: 'Africa'
};

const SLUG_OVERRIDES = {
  ae: 'uae',
  lk: 'sri-lanka',
  hk: 'hong-kong',
  za: 'south-africa'
};

function slugify(name, code) {
  return SLUG_OVERRIDES[code] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* Canonical destination list — the marketing list plus a few frequently-requested
   extras that aren't in the flag grid. */
const EXTRA = [
  { name: 'Singapore', code: 'sg' },
  { name: 'Turkey', code: 'tr' },
  { name: 'Japan', code: 'jp' }
];

export const touristVisaCountries = [...visaCountries, ...EXTRA].map((c) => ({
  name: c.name,
  code: c.code,
  slug: slugify(c.name, c.code),
  region: REGION[c.code] || 'Other'
}));

/* ---------------- defaults ---------------- */

const CURRENCY = 'INR';

export const DEFAULTS = {
  visaTypes: [
    {
      id: '30d-single',
      label: '30 days · Single entry',
      stayDuration: '30 days',
      validity: '60 days from issue',
      entryType: 'Single',
      processingTime: '5–7 working days',
      fees: { visaFee: 3400, serviceFee: 1800, tax: 0, currency: CURRENCY }
    }
  ],
  requiredDocuments: ['passport', 'photograph', 'bank_statement'],
  requiresBankStatement: true,
  processingTime: '5–7 working days',
  eligibility: [
    'Passport valid for at least 6 months beyond your intended date of entry',
    'At least two blank passport pages',
    'A return or onward ticket',
    'Sufficient funds for the duration of your stay'
  ],
  requirements: [
    'Completed application with accurate personal and passport details',
    'Clear scan of your passport photo page',
    'Recent passport-style photograph',
    'Recent bank statements as proof of funds',
    'Confirmed travel dates'
  ],
  applicationFields: [] // extra fields beyond STANDARD_FIELDS
};

/* ---------------- per-country overrides ---------------- */

const OVERRIDES = {
  uae: {
    processingTime: '3–5 working days',
    visaTypes: [
      {
        id: 'uae-30-single',
        label: '30 days · Single entry',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '3–5 working days',
        fees: { visaFee: 6800, serviceFee: 2200, tax: 0, currency: CURRENCY }
      },
      {
        id: 'uae-60-single',
        label: '60 days · Single entry',
        stayDuration: '60 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '3–5 working days',
        fees: { visaFee: 11500, serviceFee: 2600, tax: 0, currency: CURRENCY }
      },
      {
        id: 'uae-30-multi',
        label: '30 days · Multiple entry',
        stayDuration: '30 days per visit',
        validity: '60 days from issue',
        entryType: 'Multiple',
        processingTime: '3–5 working days',
        fees: { visaFee: 13900, serviceFee: 2600, tax: 0, currency: CURRENCY }
      }
    ],
    eligibility: [
      'Passport valid for at least 6 months from your date of arrival',
      'A confirmed return flight',
      'Proof of accommodation or a UAE host',
      'Bank statements showing sufficient funds'
    ]
  },
  thailand: {
    processingTime: '5–10 working days',
    visaTypes: [
      {
        id: 'th-single-60',
        label: 'Tourist visa · 60 days · Single entry',
        stayDuration: '60 days (extendable in-country)',
        validity: '3 months from issue',
        entryType: 'Single',
        processingTime: '5–10 working days',
        fees: { visaFee: 3600, serviceFee: 1900, tax: 0, currency: CURRENCY }
      },
      {
        id: 'th-multi-6m',
        label: 'Tourist visa · Multiple entry (6 months)',
        stayDuration: '60 days per entry',
        validity: '6 months from issue',
        entryType: 'Multiple',
        processingTime: '7–12 working days',
        fees: { visaFee: 12500, serviceFee: 2400, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: ['passport', 'photograph', 'bank_statement', 'flight_itinerary', 'hotel_booking']
  },
  singapore: {
    processingTime: '3–5 working days',
    visaTypes: [
      {
        id: 'sg-30-multi',
        label: '30 days · Multiple entry',
        stayDuration: 'Up to 30 days per visit',
        validity: '2 years (subject to passport validity)',
        entryType: 'Multiple',
        processingTime: '3–5 working days',
        fees: { visaFee: 2100, serviceFee: 1600, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: ['passport', 'photograph', 'bank_statement', 'flight_itinerary']
  },
  vietnam: {
    processingTime: '3–5 working days',
    visaTypes: [
      {
        id: 'vn-evisa-30-single',
        label: 'E-visa · 30 days · Single entry',
        stayDuration: '30 days',
        validity: '30 days from the entry date',
        entryType: 'Single',
        processingTime: '3–5 working days',
        fees: { visaFee: 2300, serviceFee: 1400, tax: 0, currency: CURRENCY }
      },
      {
        id: 'vn-evisa-90-multi',
        label: 'E-visa · 90 days · Multiple entry',
        stayDuration: '90 days',
        validity: '90 days from the entry date',
        entryType: 'Multiple',
        processingTime: '3–5 working days',
        fees: { visaFee: 5200, serviceFee: 1600, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: ['passport', 'photograph'],
    requiresBankStatement: false,
    eligibility: [
      'Passport valid for at least 6 months with two blank pages',
      'A digital passport photo and passport bio-page scan',
      'Entry and exit through an approved international checkpoint'
    ]
  },
  indonesia: {
    processingTime: '3–5 working days',
    visaTypes: [
      {
        id: 'id-b1-30',
        label: 'Visit visa (B1) · 30 days',
        stayDuration: '30 days (extendable once)',
        validity: '90 days from issue',
        entryType: 'Single',
        processingTime: '3–5 working days',
        fees: { visaFee: 3900, serviceFee: 1700, tax: 0, currency: CURRENCY }
      }
    ]
  },
  'sri-lanka': {
    processingTime: '2–4 working days',
    visaTypes: [
      {
        id: 'lk-eta-30-double',
        label: 'ETA · 30 days · Double entry',
        stayDuration: '30 days',
        validity: '3 months from issue',
        entryType: 'Double',
        processingTime: '2–4 working days',
        fees: { visaFee: 4200, serviceFee: 1500, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: ['passport', 'photograph'],
    requiresBankStatement: false
  },
  malaysia: {
    processingTime: '2–4 working days',
    visaTypes: [
      {
        id: 'my-evisa-30-single',
        label: 'E-visa · 30 days · Single entry',
        stayDuration: '30 days',
        validity: '3 months from issue',
        entryType: 'Single',
        processingTime: '2–4 working days',
        fees: { visaFee: 2600, serviceFee: 1400, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: ['passport', 'photograph', 'bank_statement', 'flight_itinerary', 'hotel_booking']
  },
  egypt: {
    processingTime: '5–8 working days',
    visaTypes: [
      {
        id: 'eg-evisa-30-single',
        label: 'E-visa · 30 days · Single entry',
        stayDuration: '30 days',
        validity: '3 months from issue',
        entryType: 'Single',
        processingTime: '5–8 working days',
        fees: { visaFee: 3100, serviceFee: 1600, tax: 0, currency: CURRENCY }
      },
      {
        id: 'eg-evisa-multi',
        label: 'E-visa · Multiple entry',
        stayDuration: '30 days per visit',
        validity: '6 months from issue',
        entryType: 'Multiple',
        processingTime: '5–8 working days',
        fees: { visaFee: 5400, serviceFee: 1900, tax: 0, currency: CURRENCY }
      }
    ]
  },
  georgia: { requiredDocuments: ['passport', 'photograph'], requiresBankStatement: false },
  azerbaijan: { requiredDocuments: ['passport', 'photograph'], requiresBankStatement: false },
  maldives: { requiredDocuments: ['passport', 'flight_itinerary', 'hotel_booking'], requiresBankStatement: false }
};

/* ---------------- lookup ---------------- */

const byCode = {};
touristVisaCountries.forEach((c) => {
  byCode[c.slug] = c;
});

export function getTouristVisaSummary(slug) {
  return byCode[slug] || null;
}

const byIso = {};
touristVisaCountries.forEach((c) => {
  byIso[c.code] = c.slug;
});
export function slugForCode(code) {
  return byIso[code] || null;
}

export function getTouristVisa(slug) {
  const base = byCode[slug];
  if (!base) return null;
  const o = OVERRIDES[slug] || {};
  const merged = {
    ...DEFAULTS,
    ...o,
    ...base,
    visaTypes: o.visaTypes || DEFAULTS.visaTypes,
    requiredDocuments: o.requiredDocuments || DEFAULTS.requiredDocuments,
    requiresBankStatement:
      o.requiresBankStatement !== undefined
        ? o.requiresBankStatement
        : (o.requiredDocuments || DEFAULTS.requiredDocuments).includes('bank_statement'),
    eligibility: o.eligibility || DEFAULTS.eligibility,
    requirements: o.requirements || DEFAULTS.requirements,
    applicationFields: o.applicationFields || DEFAULTS.applicationFields
  };
  merged.startingFee =
    merged.visaTypes[0].fees.visaFee + merged.visaTypes[0].fees.serviceFee + merged.visaTypes[0].fees.tax;
  merged.currency = merged.visaTypes[0].fees.currency;
  return merged;
}

export function getVisaType(slug, visaTypeId) {
  const v = getTouristVisa(slug);
  if (!v) return null;
  return v.visaTypes.find((t) => t.id === visaTypeId) || v.visaTypes[0];
}

export function formatMoney(amount, currency = 'INR') {
  try {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}
