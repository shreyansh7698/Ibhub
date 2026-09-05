import { countries, getCountry } from './countries.js';

export { countries, getCountry };

// Shared FAQ set reused on every country formation page.
export const formationFaqs = (country) => [
  {
    q: `How long does company formation in ${country.shortName} take?`,
    a: `Most incorporations in ${country.shortName} are completed within the window shown in the timeline above once your documents are verified. Bank account and visa steps, where relevant, run separately and take longer.`
  },
  {
    q: `Do I need to travel to ${country.shortName}?`,
    a: `For the incorporation itself, usually not — the filing is handled remotely. Some banks in ${country.shortName} may request a video call or an in-person meeting before opening an account.`
  },
  {
    q: 'Can non-residents own the company?',
    a: `Yes. ${country.countrySummary} We advise on any director residency requirements during your consultation.`
  },
  {
    q: 'What is included in your fee?',
    a: 'Your engagement letter lists every inclusion. Typically this covers the government filing, first-year registered address, and the core registrations for your entity. Optional add-ons are quoted separately.'
  },
  {
    q: 'Do you help after the company is formed?',
    a: 'Yes. We provide ongoing registered office, company secretary (where applicable), accounting, tax, and annual compliance so your company stays in good standing.'
  },
  {
    q: 'Can you assist with a business bank account?',
    a: 'We help prepare your application and introduce banking or EMI partners. Account opening is subject to the provider’s eligibility criteria and approval — we cannot guarantee the outcome.'
  }
];
