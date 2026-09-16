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
  kr: 'Asia Pacific',
  mv: 'Indian Ocean',
  az: 'Caucasus & Central Asia', ge: 'Caucasus & Central Asia', kg: 'Caucasus & Central Asia', ru: 'Europe & CIS',
  ie: 'Europe', tr: 'Europe', gb: 'Europe', eu: 'Europe',
  us: 'North America', ca: 'North America',
  au: 'Oceania', nz: 'Oceania',
  eg: 'Africa', za: 'Africa', ke: 'Africa', ma: 'Africa', tz: 'Africa', et: 'Africa'
};

const SLUG_OVERRIDES = {
  ae: 'uae',
  lk: 'sri-lanka',
  hk: 'hong-kong',
  za: 'south-africa',
  gb: 'uk',
  us: 'usa'
};

function slugify(name, code) {
  return SLUG_OVERRIDES[code] || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* Canonical destination list — the marketing list plus a few frequently-requested
   extras that aren't in the flag grid. */
const EXTRA = [
  { name: 'Singapore', code: 'sg' },
  { name: 'Turkey', code: 'tr' }
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

/* Full document checklist sourced from the visa-process reference document,
   applied to the long-haul destinations below (UK, USA, Canada, Australia,
   New Zealand, Europe, South Korea, Japan). */
const LONG_HAUL_DOCUMENTS = [
  'passport',
  'aadhaar',
  'itr',
  'travel_itinerary',
  'cover_letter',
  'flight_tickets',
  'hotel_voucher',
  'bank_statement',
  'photograph',
  'marriage_certificate',
  'employment_documents',
  'business_registration_documents',
  'sponsor_documents',
  'travel_insurance',
  'appointment_confirmation',
  'travel_history'
];

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
        id: 'th-tourist',
        label: 'Tourist Visa',
        stayDuration: '60 days (extendable in-country)',
        validity: '3 months from issue',
        entryType: 'Single',
        processingTime: '5–10 working days',
        fees: { visaFee: 15000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: ['passport', 'photograph', 'bank_statement', 'flight_itinerary', 'hotel_booking']
  },
  singapore: {
    processingTime: '3–5 working days',
    visaTypes: [
      {
        id: 'sg-tourist',
        label: 'Tourist Visa',
        stayDuration: 'Up to 30 days per visit',
        validity: '2 years (subject to passport validity)',
        entryType: 'Multiple',
        processingTime: '3–5 working days',
        fees: { visaFee: 10500, serviceFee: 0, tax: 0, currency: CURRENCY }
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
        id: 'id-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days (extendable once)',
        validity: '90 days from issue',
        entryType: 'Single',
        processingTime: '3–5 working days',
        fees: { visaFee: 7500, serviceFee: 0, tax: 0, currency: CURRENCY }
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
  georgia: {
    visaTypes: [
      {
        id: 'ge-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 45000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: ['passport', 'photograph'],
    requiresBankStatement: false
  },
  azerbaijan: {
    visaTypes: [
      {
        id: 'az-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 10500, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: ['passport', 'photograph'],
    requiresBankStatement: false
  },
  maldives: { requiredDocuments: ['passport', 'flight_itinerary', 'hotel_booking'], requiresBankStatement: false },

  /* Long-haul tourist visa destinations — visa type, stay/validity, processing
     time and charges sourced from the visa-process reference document. Fees are
     given there as a single total charge (no visa-fee/service-fee split), so the
     full amount is recorded under visaFee with serviceFee/tax at 0. */
  canada: {
    processingTime: '30–60 Working Days',
    // No rate shown and no payment step for this destination — see `noPayment`.
    noPayment: true,
    visaTypes: [
      {
        id: 'ca-sticker-multi',
        label: 'Sticker Visa · 6 Months · Multiple Entries',
        stayDuration: '6 Months',
        validity: '10 Years',
        entryType: 'Multiple Entries',
        processingTime: '30–60 Working Days',
        fees: { visaFee: 0, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: LONG_HAUL_DOCUMENTS
  },
  australia: {
    processingTime: '3–4 Weeks',
    noPayment: true,
    visaTypes: [
      {
        id: 'au-evisa-single',
        label: 'E-Visa · 90 Days · Single Entry',
        stayDuration: '90 Days',
        validity: '3 Years',
        entryType: 'Single Entry',
        processingTime: '3–4 Weeks',
        fees: { visaFee: 0, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: LONG_HAUL_DOCUMENTS
  },
  japan: {
    processingTime: '10–12 Working Days',
    visaTypes: [
      {
        id: 'jp-sticker-single',
        label: 'Sticker Visa · 15 Days · Single Entry',
        stayDuration: '15 Days',
        // As sourced: "Visa Validity: 90 Months". Unusually long for a 15-day
        // single-entry tourist visa — kept verbatim rather than corrected.
        validity: '90 Months',
        entryType: 'Single Entry',
        processingTime: '10–12 Working Days',
        fees: { visaFee: 65000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: LONG_HAUL_DOCUMENTS
  },
  uk: {
    processingTime: '3–5 Weeks',
    noPayment: true,
    visaTypes: [
      {
        id: 'uk-sticker-single-multi',
        label: 'Sticker Visa · 180 Days · Single/Multiple Entry',
        stayDuration: '180 Days',
        validity: '6 Months',
        entryType: 'Single/Multiple Entry',
        processingTime: '3–5 Weeks',
        fees: { visaFee: 0, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: LONG_HAUL_DOCUMENTS
  },
  usa: {
    processingTime: 'Depends on Embassy',
    noPayment: true,
    visaTypes: [
      {
        id: 'usa-b1b2-multi',
        label: 'B1/B2 Sticker Visa · 6 Months · Multiple Entry',
        stayDuration: '6 Months',
        validity: '10 Years',
        entryType: 'Multiple Entry',
        processingTime: 'Depends on Embassy',
        fees: { visaFee: 0, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: LONG_HAUL_DOCUMENTS
  },
  'south-korea': {
    processingTime: '10–15 Working Days',
    visaTypes: [
      {
        id: 'kr-short-term',
        label: 'Short Term Visa · 30 Days',
        stayDuration: '30 Days',
        validity: '180 Days',
        // Entry type (single/multiple) is not specified in the source document.
        entryType: '',
        processingTime: '10–15 Working Days',
        fees: { visaFee: 25000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: LONG_HAUL_DOCUMENTS
  },
  'new-zealand': {
    // Processing time sourced verbatim as "2025 Working Days" — this reads as a
    // likely typo in the source document (compare Australia/UK at 3-5 weeks).
    // Preserved as-is rather than silently corrected; confirm the real figure.
    processingTime: '20-25 Working Days',
    noPayment: true,
    visaTypes: [
      {
        id: 'nz-evisa-regular',
        label: 'E-Visa (Regular Entry) · 6 Months',
        stayDuration: '6 Months',
        validity: '18 Months',
        entryType: '',
        processingTime: '20-25 Working Days',
        fees: { visaFee: 0, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ],
    requiredDocuments: LONG_HAUL_DOCUMENTS
  },
  /* 'europe' has no visa-type override — the source document's Schengen figures
     are broken out per country (France, Germany, Greece, Italy, Spain, Sweden,
     Switzerland, Norway, Finland, Czech Republic, Denmark, Austria) rather than
     one Europe-wide spec, so stay/validity/processing-time/fees fall back to
     DEFAULTS. The document checklist below is still the one sourced for this
     destination category. */
  europe: {
    requiredDocuments: LONG_HAUL_DOCUMENTS
  },

  /* Flat-rate tourist visa destinations — single total charge (no visa-fee/
     service-fee split), so the full amount is recorded under visaFee with
     serviceFee/tax at 0, matching the long-haul destinations above. */
  'hong-kong': {
    visaTypes: [
      {
        id: 'hk-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 1500, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  oman: {
    visaTypes: [
      {
        id: 'om-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 10500, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  turkey: {
    visaTypes: [
      {
        id: 'tr-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 25000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  morocco: {
    visaTypes: [
      {
        id: 'ma-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 20000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  bahrain: {
    visaTypes: [
      {
        id: 'bh-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 13700, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  russia: {
    visaTypes: [
      {
        id: 'ru-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 17000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  'south-africa': {
    visaTypes: [
      {
        id: 'za-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 30000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  tanzania: {
    visaTypes: [
      {
        id: 'tz-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 17500, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  laos: {
    visaTypes: [
      {
        id: 'la-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 13500, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  kenya: {
    visaTypes: [
      {
        id: 'ke-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 14500, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  jordan: {
    visaTypes: [
      {
        id: 'jo-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 20500, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  ethiopia: {
    visaTypes: [
      {
        id: 'et-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 8500, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  qatar: {
    visaTypes: [
      {
        id: 'qa-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 2100, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  ireland: {
    visaTypes: [
      {
        id: 'ie-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 13000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  },
  bhutan: {
    visaTypes: [
      {
        id: 'bt-tourist',
        label: 'Tourist Visa',
        stayDuration: '30 days',
        validity: '60 days from issue',
        entryType: 'Single',
        processingTime: '5–7 working days',
        fees: { visaFee: 20000, serviceFee: 0, tax: 0, currency: CURRENCY }
      }
    ]
  }
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
