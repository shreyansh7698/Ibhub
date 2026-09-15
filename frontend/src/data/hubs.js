/**
 * Financial / formation hubs plotted on the globe scenes. Coordinates are
 * approximate city centres. `key` matches slugs in src/data/countries.js where
 * one exists so the GlobalNetwork panels can deep-link.
 */
export const hubs = [
  {
    key: 'usa',
    label: 'United States',
    city: 'New York',
    lat: 40.71,
    lon: -74.0,
    blurb: 'LLC & C-Corp formation, EIN, US business banking and a Delaware default that scales.',
    to: '/company-formation/usa'
  },
  {
    key: 'uk',
    label: 'United Kingdom',
    city: 'London',
    lat: 51.5,
    lon: -0.12,
    blurb: 'Fast Companies House incorporation, VAT registration and a gateway into Europe.',
    to: '/company-formation/uk'
  },
  {
    key: 'uae',
    label: 'United Arab Emirates',
    city: 'Dubai',
    lat: 25.2,
    lon: 55.27,
    blurb: 'Free-zone and mainland licences, residence visas and 0% personal income tax.',
    to: '/company-formation/uae'
  },
  {
    key: 'india',
    label: 'India',
    city: 'Mumbai',
    lat: 19.08,
    lon: 72.88,
    blurb: 'Private limited company registration, GST and access to the world’s fastest-growing market.',
    to: '/countries/india'
  },
  {
    key: 'europe',
    label: 'Europe',
    city: 'Amsterdam',
    lat: 52.37,
    lon: 4.9,
    blurb: 'EU holding structures, cross-border VAT and a single market of 440M consumers.',
    to: '/company-formation/europe'
  },
  {
    key: 'singapore',
    label: 'Singapore',
    city: 'Singapore',
    lat: 1.35,
    lon: 103.82,
    blurb: 'Pte Ltd incorporation, nominee director support and Asia’s most trusted banking.',
    to: '/company-formation/singapore'
  },
  {
    key: 'hong-kong',
    label: 'Hong Kong',
    city: 'Hong Kong',
    lat: 22.32,
    lon: 114.17,
    blurb: 'Limited company setup, offshore profits treatment and a direct line into China.',
    to: '/company-formation/hong-kong'
  }
];

/** Elegant, uncluttered connection paths between hubs (index pairs). */
export const hubRoutes = [
  [0, 1], // New York — London
  [1, 4], // London — Europe
  [1, 2], // London — Dubai
  [2, 3], // Dubai — Mumbai
  [2, 5], // Dubai — Singapore
  [5, 6], // Singapore — Hong Kong
  [0, 5], // New York — Singapore (the long one)
  [4, 2] // Europe — Dubai
];
