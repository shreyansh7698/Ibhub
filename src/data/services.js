import {
  Building2,
  Landmark,
  Calculator,
  Plane,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Copyright,
  Handshake,
  Luggage,
  Briefcase,
  Home
} from 'lucide-react';
import { serviceImages } from './images.js';

// Core services shown on the home page and Services page.
export const services = [
  {
    slug: 'company-formation',
    icon: Building2,
    title: 'International Company Formation',
    short:
      'Launch your business in leading global jurisdictions with expert assistance from registration to compliance.',
    to: '/company-formation'
  },
  {
    slug: 'bank-account-assistance',
    icon: Landmark,
    title: 'Bank Account Assistance',
    short:
      'Get guidance for opening business banking and international payment solutions, subject to eligibility and bank approval.',
    to: '/services/bank-account-assistance'
  },
  {
    slug: 'accounting-tax',
    icon: Calculator,
    title: 'Accounting & Tax',
    short:
      'Stay compliant with professional accounting, bookkeeping and tax support across multiple jurisdictions.',
    to: '/services/accounting-tax'
  },
  {
    slug: 'visa-immigration',
    icon: Plane,
    title: 'Visa & Immigration',
    short:
      'Navigate visa, residency and immigration procedures with expert guidance, subject to eligibility and authority approval.',
    to: '/visa-immigration'
  },
  {
    slug: 'virtual-office',
    icon: MapPin,
    title: 'Virtual Office',
    short:
      'Establish your professional presence with international business address and mail-handling solutions.',
    to: '/services/virtual-office'
  },
  {
    slug: 'corporate-compliance',
    icon: ShieldCheck,
    title: 'Corporate Compliance',
    short:
      'Keep your company compliant with annual filings, renewals and regulatory requirements in every market.',
    to: '/services/corporate-compliance'
  }
];

// Extended service list (used in footer + Services page grid).
export const extraServices = [
  {
    slug: 'business-expansion',
    icon: TrendingUp,
    title: 'Business Expansion Consulting',
    short:
      'Plan market entry, structure your group, and expand into new regions with a dedicated advisory team.',
    to: '/services/business-expansion'
  },
  {
    slug: 'global-advisory',
    icon: Globe2,
    title: 'Global Advisory',
    short:
      'Cross-border structuring, entity management, and consolidated reporting for multi-country groups.',
    to: '/services'
  },
  {
    slug: 'trademark-registration',
    icon: Copyright,
    title: 'Trademark Registration',
    short:
      'Protect your brand name and logo with clearance searches, national or international filing, and ongoing monitoring.',
    to: '/services/trademark-registration'
  },
  {
    slug: 'buy-a-business',
    icon: Handshake,
    title: 'Buy an Existing Business',
    short:
      'Acquire an established company with support for sourcing, due diligence, valuation and a clean ownership transfer.',
    to: '/services/buy-a-business'
  }
];

export const allServices = [...services, ...extraServices];

// Detailed content for individual service pages.
export const serviceDetails = {
  'visa-immigration': {
    icon: Plane,
    eyebrow: 'Visa & Immigration',
    title: 'Visa & Immigration Support for Global Founders',
    intro:
      'From tourist and business visas to residency permits and residence-by-investment routes, we help founders and their teams understand the options, prepare strong applications, and stay compliant after arrival.',
    metaDescription:
      'Guidance on tourist visas, business visas, residency permits, and immigration routes for entrepreneurs expanding internationally. Subject to eligibility and authority approval.',
    highlights: [
      'Support for tourist, business and residency permit applications',
      'Route assessment based on your nationality, business, and goals',
      'Document checklists and application preparation',
      'Coordination with licensed immigration partners where required',
      'Post-arrival registration and renewal reminders'
    ],
    offerings: [
      { title: 'Tourist / visitor visas', desc: 'Short-stay visa guidance for exploratory trips, client meetings, and site visits before you commit to a market.' },
      { title: 'Business visas', desc: 'Entrepreneur, investor, and self-employment routes that let you set up and run your company on the ground.' },
      { title: 'Residency permits', desc: 'Company-linked and investment-based residence permits for you and your dependents, including the UAE and Singapore.' },
      { title: 'Team relocation', desc: 'Work permit guidance for key employees, such as the UK Skilled Worker route or Singapore Employment Pass.' },
      { title: 'Dependent applications', desc: 'Coordination of family and dependent applications alongside the main applicant.' },
      { title: 'Compliance & renewals', desc: 'Tracking of visa validity, reporting duties, and renewal windows.' },
      { title: 'Citizenship pathways', desc: 'Long-term planning where naturalisation may become available.' }
    ],
    process: [
      { title: 'Eligibility review', desc: 'We assess your profile and shortlist realistic routes.' },
      { title: 'Documentation', desc: 'We build your document pack and review every item.' },
      { title: 'Submission support', desc: 'We coordinate submission with you or a licensed partner.' },
      { title: 'Aftercare', desc: 'We track renewals and reporting obligations.' }
    ],
    faqs: [
      { q: 'Can you guarantee a visa will be approved?', a: 'No. Immigration decisions rest solely with the relevant authority. We focus on eligibility assessment and strong, accurate applications.' },
      { q: 'Can I do business on a tourist visa?', a: 'A tourist or visitor visa usually allows meetings, market research, and negotiations, but not paid work or running local operations. We advise when you need to move to a business visa or residency permit.' },
      { q: 'What is the difference between a business visa and a residency permit?', a: 'A business visa typically permits short or repeated stays for company activity; a residency permit lets you live in the country longer term, often linked to owning or being employed by a local company.' },
      { q: 'Do I need a company before applying?', a: 'Some routes require an active company or job offer first. We sequence company formation and the visa application accordingly.' },
      { q: 'Do you work with licensed immigration advisers?', a: 'Yes. Where regulated advice is required, we coordinate with licensed partners in the relevant country.' }
    ]
  },
  'tourist-visa': {
    icon: Luggage,
    eyebrow: 'Tourist Visa',
    title: 'Tourist & Visitor Visa Assistance',
    intro:
      'Planning an exploratory trip, client meetings, or a market visit before you commit? We help you pick the right short-stay visa, prepare a complete application, and avoid the common refusal triggers.',
    metaDescription:
      'Help choosing and applying for tourist and short-stay visitor visas for business exploration trips. Visa issuance is decided by the relevant authority.',
    countriesTitle: 'Popular tourist visa destinations',
    countriesNote:
      'We assist with tourist and short-stay visitor visa applications for these destinations. Visa issuance is decided by the relevant authority.',
    countries: [
      { name: 'Vietnam', code: 'vn' },
      { name: 'UAE', code: 'ae' },
      { name: 'Thailand', code: 'th' },
      { name: 'Sri Lanka', code: 'lk' },
      { name: 'Malaysia', code: 'my' },
      { name: 'Indonesia', code: 'id' },
      { name: 'Hong Kong', code: 'hk' },
      { name: 'Egypt', code: 'eg' },
      { name: 'Maldives', code: 'mv' },
      { name: 'Oman', code: 'om' },
      { name: 'South Africa', code: 'za' },
      { name: 'Azerbaijan', code: 'az' },
      { name: 'Georgia', code: 'ge' },
      { name: 'Kenya', code: 'ke' },
      { name: 'Russia', code: 'ru' },
      { name: 'Qatar', code: 'qa' },
      { name: 'Jordan', code: 'jo' },
      { name: 'Bangladesh', code: 'bd' },
      { name: 'Morocco', code: 'ma' },
      { name: 'Kyrgyzstan', code: 'kg' },
      { name: 'Ireland', code: 'ie' },
      { name: 'Bahrain', code: 'bh' },
      { name: 'Tanzania', code: 'tz' },
      { name: 'Laos', code: 'la' },
      { name: 'Bhutan', code: 'bt' },
      { name: 'Kuwait', code: 'kw' },
      { name: 'Ethiopia', code: 'et' },
    ],
    highlights: [
      'Advice on the correct visa category and permitted activities',
      'Document checklist, cover letter, and itinerary preparation',
      'Financial-evidence and sponsorship guidance',
      'Appointment booking and interview preparation where required'
    ],
    offerings: [
      { title: 'Visa category check', desc: 'Confirming whether visa-free entry, an e-visa, or a consular visa applies to your nationality and purpose.' },
      { title: 'Application preparation', desc: 'Forms, photos, cover letter, and a clear travel and business-purpose statement.' },
      { title: 'Supporting documents', desc: 'Bank statements, employment or company proof, accommodation and return-travel evidence.' },
      { title: 'Invitation letters', desc: 'Drafting or reviewing invitation letters from local partners or our offices where permitted.' },
      { title: 'Appointment & submission', desc: 'Booking biometrics or consular appointments and preparing you for any interview.' },
      { title: 'Multiple-entry options', desc: 'Guidance on long-validity or multiple-entry visitor visas for repeat trips.' }
    ],
    process: [
      { title: 'Purpose review', desc: 'We confirm your activities are allowed on a visitor visa and pick the right category.' },
      { title: 'Document pack', desc: 'We build and check every document against the consulate checklist.' },
      { title: 'Submission', desc: 'We guide you through booking and attending the appointment.' },
      { title: 'Outcome & travel', desc: 'We advise on entry conditions and permitted stay once the visa is issued.' }
    ],
    faqs: [
      { q: 'Can I attend meetings on a tourist visa?', a: 'Most countries allow meetings, negotiations, and market research on a visitor visa, but not paid work or running local operations. We confirm the rules for your destination.' },
      { q: 'Can you guarantee the visa?', a: 'No. The consulate or immigration authority decides every application. We make sure yours is complete, consistent, and well presented.' },
      { q: 'How far ahead should I apply?', a: 'Usually 3 to 8 weeks before travel, depending on the country and season. We flag the current processing times.' },
      { q: 'What if I was refused before?', a: 'We review the refusal reasons and address them directly in the new application.' }
    ]
  },
  'business-visa': {
    icon: Briefcase,
    eyebrow: 'Business Visa',
    title: 'Business Visa Assistance for Founders',
    intro:
      'When you need to actively set up, manage, or grow your company on the ground, a business visa is usually the right route. We assess eligibility, prepare the application, and sequence it with your company formation.',
    metaDescription:
      'Assistance with entrepreneur, investor, and self-employment business visas across our core markets. Eligibility and approval are determined by the immigration authority.',
    highlights: [
      'Eligibility review against entrepreneur, investor, and self-employed routes',
      'Business plan and financial-evidence preparation',
      'Coordination with company formation and banking steps',
      'Coordination with licensed immigration partners for regulated advice'
    ],
    offerings: [
      { title: 'Route assessment', desc: 'Matching your nationality, funds, and business to entrepreneur, investor, or start-up visa categories.' },
      { title: 'Business plan support', desc: 'Preparing or refining the plan, financials, and job-creation projections many routes require.' },
      { title: 'Investment & funds evidence', desc: 'Structuring and documenting the capital or maintenance funds the route requires.' },
      { title: 'Company sequencing', desc: 'Deciding whether to incorporate before or after the visa, and aligning both timelines.' },
      { title: 'Application & submission', desc: 'Full application preparation and coordination with a licensed adviser where required.' },
      { title: 'Extensions & switching', desc: 'Guidance on renewing the visa or switching to a residency route later.' }
    ],
    process: [
      { title: 'Eligibility review', desc: 'We assess your profile and shortlist realistic business-visa routes.' },
      { title: 'Documentation', desc: 'We prepare the plan, financial evidence, and corporate documents.' },
      { title: 'Submission support', desc: 'We coordinate the filing with you or a licensed immigration partner.' },
      { title: 'Aftercare', desc: 'We track conditions, reporting duties, and renewal windows.' }
    ],
    faqs: [
      { q: 'Do I need to invest a minimum amount?', a: 'Many business-visa routes set a minimum investment or maintenance-funds level. We tell you the current thresholds for each option.' },
      { q: 'Do I need a company first?', a: 'Some routes require an incorporated company or registered branch before applying; others expect you to incorporate after approval. We sequence both.' },
      { q: 'Can my family come with me?', a: 'Most business visas allow dependent applications for a spouse and children. We coordinate these alongside the main application.' },
      { q: 'Can you guarantee approval?', a: 'No. The immigration authority decides. We focus on eligibility and a strong, accurate application.' }
    ]
  },
  'residency-permit': {
    icon: Home,
    eyebrow: 'Residency Permit',
    title: 'Residency Permit & Long-Stay Support',
    intro:
      'A residency permit lets you and your family live in your target country long term — often linked to owning a local company, employment, or a qualifying investment. We map the options and manage the application end to end.',
    metaDescription:
      'Support for company-linked, employment-based, and investment-based residency permits, including the UAE and Singapore. Grant of residency is subject to authority approval.',
    highlights: [
      'Comparison of company-linked, employment, and investor residency routes',
      'Document legalisation, translation, and medical/biometric guidance',
      'Dependent (spouse and children) applications',
      'Renewal tracking and path-to-settlement planning'
    ],
    offerings: [
      { title: 'Route comparison', desc: 'Company-owner, employee, investor, and retirement residency options weighed against your situation.' },
      { title: 'Company-linked residency', desc: 'Permits tied to owning or being employed by a company you form, such as UAE free-zone or Singapore routes.' },
      { title: 'Investment residency', desc: 'Guidance on real-estate, fund, or business investment routes to residence.' },
      { title: 'Document preparation', desc: 'Legalisation, apostille, translation, police clearances, and medical tests.' },
      { title: 'Dependents', desc: 'Residency applications for your spouse and children filed alongside yours.' },
      { title: 'Renewals & settlement', desc: 'Tracking permit validity and planning toward permanent residence or citizenship where available.' }
    ],
    process: [
      { title: 'Options paper', desc: 'We shortlist residency routes and explain costs, timelines, and conditions.' },
      { title: 'Preparation', desc: 'We assemble and legalise the full document set for you and any dependents.' },
      { title: 'Submission', desc: 'We coordinate filing, biometrics, and medicals with you or a licensed partner.' },
      { title: 'Aftercare', desc: 'We track renewal dates and reporting duties and plan your next step.' }
    ],
    faqs: [
      { q: 'Does forming a company get me residency automatically?', a: 'Not automatically. Company ownership can make you eligible for a residency permit in several markets, but you still apply and the authority decides.' },
      { q: 'How long is a residency permit valid?', a: 'Typically 1 to 3 years and renewable, though investor routes can be longer. We confirm the term for your route.' },
      { q: 'Can it lead to permanent residence or citizenship?', a: 'In some countries, continuous legal residence can lead to permanent residence and later naturalisation. We outline the timeline where it applies.' },
      { q: 'Do I have to live there full time?', a: 'Minimum-stay rules vary — some routes need only a few days a year, others require substantial presence. We factor this into the recommendation.' }
    ]
  },
  'bank-account-assistance': {
    icon: Landmark,
    eyebrow: 'Bank Account Assistance',
    title: 'Business Banking & Payments Assistance',
    intro:
      'Opening a cross-border business account can be complex. We help you prepare a complete application, choose suitable banking and electronic money institution (EMI) partners, and understand what each provider expects.',
    metaDescription:
      'Assistance preparing business bank account and EMI applications for international companies. Account opening is subject to the provider’s eligibility criteria and approval.',
    highlights: [
      'Provider shortlisting based on your structure and activity',
      'KYC document preparation and review',
      'Introductions to banking and EMI partners where available',
      'Guidance on multi-currency accounts and payment gateways'
    ],
    offerings: [
      { title: 'Traditional bank accounts', desc: 'Support for applications with established banks in your country of formation.' },
      { title: 'EMI & fintech accounts', desc: 'Alternatives that support faster onboarding and multi-currency operations.' },
      { title: 'Merchant & gateway setup', desc: 'Guidance on payment gateways and merchant accounts for e-commerce.' },
      { title: 'Corporate cards & FX', desc: 'Options for expense management and foreign exchange.' },
      { title: 'Document preparation', desc: 'Board resolutions, business descriptions, and source-of-funds narratives.' },
      { title: 'Ongoing support', desc: 'Help responding to compliance queries after submission.' }
    ],
    process: [
      { title: 'Needs assessment', desc: 'We map your currencies, counterparties, and volumes.' },
      { title: 'Provider shortlist', desc: 'We recommend 2–3 realistic banking or EMI options.' },
      { title: 'Application pack', desc: 'We prepare and review all required documentation.' },
      { title: 'Introduction & follow-up', desc: 'We introduce you and support the review process.' }
    ],
    faqs: [
      { q: 'Do you guarantee a bank account will be opened?', a: 'No. Every provider applies its own risk and eligibility criteria. We help you present a strong, complete application but the decision is the provider’s.' },
      { q: 'Can I open an account remotely?', a: 'Many EMIs allow remote onboarding. Some traditional banks require a video call or in-person meeting.' },
      { q: 'How long does it take?', a: 'EMI onboarding can take days; traditional bank accounts often take a few weeks depending on the jurisdiction.' }
    ]
  },
  'accounting-tax': {
    icon: Calculator,
    eyebrow: 'Accounting & Tax',
    title: 'Accounting, Bookkeeping & Tax Compliance',
    intro:
      'Keep clean books and meet every filing deadline. Our accounting team supports companies across the US, UK, UAE, Singapore, and Hong Kong with bookkeeping, financial statements, and tax returns.',
    metaDescription:
      'Cross-border bookkeeping, financial statements, payroll, and tax return preparation for international companies. Advisory tailored to your jurisdiction.',
    highlights: [
      'Cloud bookkeeping with monthly management accounts',
      'Year-end financial statements and audit coordination',
      'Corporate tax, VAT/GST, and sales tax return preparation',
      'Payroll processing and contractor payments'
    ],
    offerings: [
      { title: 'Bookkeeping', desc: 'Monthly or quarterly bookkeeping in Xero, QuickBooks, or your preferred ledger.' },
      { title: 'Financial statements', desc: 'Preparation of annual accounts to local standards.' },
      { title: 'Corporate tax', desc: 'Computation and filing of corporate income tax returns.' },
      { title: 'Indirect tax', desc: 'VAT, GST, and US sales tax registration and returns.' },
      { title: 'Payroll', desc: 'Employee payroll, payslips, and statutory filings.' },
      { title: 'Advisory', desc: 'Transfer pricing basics, group structuring, and tax residency guidance.' }
    ],
    process: [
      { title: 'Onboarding', desc: 'We review your entities, systems, and deadlines.' },
      { title: 'Setup', desc: 'We connect your ledger, banks, and chart of accounts.' },
      { title: 'Ongoing cycle', desc: 'We deliver monthly reports and prepare filings.' },
      { title: 'Year-end', desc: 'We finalise statements and file tax returns.' }
    ],
    faqs: [
      { q: 'Which accounting software do you use?', a: 'We work primarily with Xero and QuickBooks Online, and can adapt to your existing setup.' },
      { q: 'Can you handle multiple countries?', a: 'Yes. We provide consolidated support for groups operating across several of our core jurisdictions.' },
      { q: 'Do you provide audited accounts?', a: 'We prepare accounts and coordinate with independent auditors where a statutory audit is required.' }
    ]
  },
  'virtual-office': {
    icon: MapPin,
    eyebrow: 'Virtual Office',
    title: 'Virtual Office & Business Address Solutions',
    intro:
      'Present a credible local presence without a physical lease. Our virtual office packages provide a prestigious business address, mail handling, and call-answering options in major cities.',
    metaDescription:
      'Virtual office and registered business address solutions with mail handling and call answering across major international business hubs.',
    highlights: [
      'Prestigious address for registration and correspondence',
      'Mail collection, scanning, and forwarding',
      'Local phone number and call answering options',
      'Meeting room access on demand'
    ],
    offerings: [
      { title: 'Registered address', desc: 'Use our address for incorporation and official correspondence where permitted.' },
      { title: 'Mail handling', desc: 'Same-day scanning, forwarding, or hold-for-collection.' },
      { title: 'Local phone number', desc: 'Dedicated number with voicemail-to-email or live answering.' },
      { title: 'Meeting rooms', desc: 'Book professional meeting space by the hour in participating locations.' },
      { title: 'Directors’ service address', desc: 'Keep residential details off public registers where available.' },
      { title: 'Multi-city packages', desc: 'Combine addresses across several markets under one account.' }
    ],
    process: [
      { title: 'Choose a location', desc: 'Select from our participating business centres.' },
      { title: 'Verification', desc: 'Complete identity checks required for mail handling.' },
      { title: 'Activation', desc: 'Your address and number go live, usually within 48 hours.' },
      { title: 'Manage online', desc: 'View and action mail from your dashboard.' }
    ],
    faqs: [
      { q: 'Can I use the address to register my company?', a: 'In most of our locations, yes. Some jurisdictions have specific rules we will confirm during onboarding.' },
      { q: 'How is my mail handled?', a: 'We notify you on arrival and scan, forward, or hold items according to your plan.' },
      { q: 'Is a virtual office enough for a bank account?', a: 'It can support an application, but some banks prefer evidence of substance. We advise case by case.' }
    ]
  },
  'business-expansion': {
    icon: TrendingUp,
    eyebrow: 'Business Expansion Consulting',
    title: 'Business Expansion & Market Entry Consulting',
    intro:
      'Enter new markets with a clear plan. We help you choose jurisdictions, design your group structure, and sequence formation, banking, hiring, and compliance for a smooth launch.',
    metaDescription:
      'Market-entry strategy, group structuring, and cross-border expansion consulting for growing companies entering new international markets.',
    highlights: [
      'Jurisdiction comparison across tax, talent, and market access',
      'Holding and operating structure design',
      'Launch roadmap covering entity, banking, and hiring',
      'Ongoing entity management for multi-country groups'
    ],
    offerings: [
      { title: 'Market assessment', desc: 'Compare target countries on cost, tax, talent, and regulation.' },
      { title: 'Structure design', desc: 'Design holding and operating entities aligned to your goals.' },
      { title: 'Launch roadmap', desc: 'A sequenced plan for formation, banking, payroll, and compliance.' },
      { title: 'Entity management', desc: 'Central oversight of filings and deadlines across your group.' },
      { title: 'Local partnerships', desc: 'Introductions to legal, tax, and recruitment partners on the ground.' },
      { title: 'Consolidated reporting', desc: 'Group-level financial reporting and dashboards.' }
    ],
    process: [
      { title: 'Discovery', desc: 'We understand your product, customers, and growth targets.' },
      { title: 'Options paper', desc: 'We present shortlisted jurisdictions and structures.' },
      { title: 'Roadmap', desc: 'We agree a phased launch plan with owners and dates.' },
      { title: 'Execution', desc: 'We deliver formation and coordinate every workstream.' }
    ],
    faqs: [
      { q: 'How do you choose the right country?', a: 'We weigh market access, tax, talent, banking, and your customers’ expectations, then present trade-offs rather than a single answer.' },
      { q: 'Can you manage several entities for us?', a: 'Yes. Our entity management service centralises filings and deadlines across all your companies.' },
      { q: 'Do you provide legal advice?', a: 'We provide practical structuring guidance and coordinate regulated legal and tax advice through licensed partners.' }
    ]
  },
  'corporate-compliance': {
    icon: ShieldCheck,
    eyebrow: 'Corporate Compliance',
    title: 'Corporate Compliance & Company Secretarial',
    intro:
      'Never miss a deadline. We manage annual returns, registered office and secretary services, statutory registers, and regulatory filings so your company stays in good standing.',
    metaDescription:
      'Annual returns, company secretarial, statutory registers, and regulatory filing management for companies across international jurisdictions.',
    highlights: [
      'Compliance calendar with proactive reminders',
      'Annual return and confirmation statement filing',
      'Registered office and company secretary services',
      'Maintenance of statutory registers and minute books'
    ],
    offerings: [
      { title: 'Annual filings', desc: 'Confirmation statements, annual returns, and financial statement submissions.' },
      { title: 'Company secretary', desc: 'Named secretary services where required by law.' },
      { title: 'Registered office', desc: 'Official address for government correspondence.' },
      { title: 'Statutory registers', desc: 'Registers of members, directors, and beneficial owners kept current.' },
      { title: 'Change filings', desc: 'Director changes, share transfers, and address updates.' },
      { title: 'Good-standing certificates', desc: 'Obtain certificates for banking and tenders.' }
    ],
    process: [
      { title: 'Health check', desc: 'We review your current filing status and registers.' },
      { title: 'Calendar setup', desc: 'We build a deadline calendar for every entity.' },
      { title: 'Ongoing filing', desc: 'We prepare and submit filings ahead of each deadline.' },
      { title: 'Annual review', desc: 'We reconcile registers and confirm compliance yearly.' }
    ],
    faqs: [
      { q: 'What happens if a deadline is missed?', a: 'Late filings can lead to penalties or strike-off. Our calendar and reminders are designed to prevent this; we also help remediate past defaults.' },
      { q: 'Do you keep our statutory registers?', a: 'Yes. We maintain digital statutory registers and update them whenever a change is filed.' },
      { q: 'Can you take over from our current provider?', a: 'Yes. We manage the transfer of registered office, secretary, and records with minimal disruption.' }
    ]
  },
  'trademark-registration': {
    icon: Copyright,
    eyebrow: 'Trademark Registration',
    title: 'Trademark Registration & Brand Protection',
    intro:
      'Secure exclusive rights to your business name, logo and taglines. We run clearance searches, prepare and file your applications, and monitor for conflicts so your brand is protected as you expand into new markets.',
    metaDescription:
      'Trademark clearance searches, national and international (Madrid Protocol) filing, and brand monitoring for companies expanding across borders. Registration is subject to each trademark office’s examination and approval.',
    highlights: [
      'Availability and conflict searches before you file',
      'Filing in single jurisdictions or via the Madrid Protocol',
      'Class selection aligned to your products and services',
      'Office action responses and renewal reminders'
    ],
    offerings: [
      { title: 'Clearance searches', desc: 'Identifying earlier marks that could block or limit your registration.' },
      { title: 'National applications', desc: 'Direct filings with the trademark office in each target country.' },
      { title: 'International registration', desc: 'One application covering multiple countries through the Madrid Protocol.' },
      { title: 'Class & specification advice', desc: 'Choosing the right classes and wording for your goods and services.' },
      { title: 'Office actions & oppositions', desc: 'Preparing responses to examiner objections and third-party challenges.' },
      { title: 'Monitoring & renewals', desc: 'Watching for confusingly similar filings and tracking renewal deadlines.' }
    ],
    process: [
      { title: 'Search', desc: 'We assess registrability and flag conflicting marks.' },
      { title: 'Strategy', desc: 'We agree the countries, classes and filing route.' },
      { title: 'Filing', desc: 'We prepare and submit the applications and pay official fees.' },
      { title: 'Prosecution & registration', desc: 'We handle examiner correspondence through to the registration certificate.' }
    ],
    faqs: [
      { q: 'Can you guarantee my trademark will be registered?', a: 'No. Every trademark office examines applications on its own criteria and third parties may oppose. We reduce risk with a thorough search and a well-drafted application, but the decision rests with the authority.' },
      { q: 'Should I register in every country?', a: 'Usually not. We recommend registering where you trade, manufacture, or plan to expand within a few years, and reviewing coverage as the business grows.' },
      { q: 'How long does registration take?', a: 'It varies by country — typically 4 to 12 months when there are no objections or oppositions.' },
      { q: 'Do you provide legal representation in disputes?', a: 'We coordinate licensed trademark attorneys for oppositions, litigation, and any regulated advice.' }
    ]
  },
  'buy-a-business': {
    icon: Handshake,
    eyebrow: 'Buy an Existing Business',
    title: 'Business Acquisition & Purchase Support',
    intro:
      'Buying an established business can be faster than building from zero — if the target is sound and the deal is structured well. We help you find opportunities, run due diligence, agree a fair price, and complete a clean transfer of ownership.',
    metaDescription:
      'Support for acquiring an existing company — target sourcing, financial and legal due diligence, valuation, deal structuring and ownership transfer. Regulated legal and tax advice is coordinated through licensed partners.',
    highlights: [
      'Target sourcing and shortlisting against your criteria',
      'Financial, legal and operational due diligence',
      'Valuation guidance and offer strategy',
      'Coordination of share or asset transfer and post-completion setup'
    ],
    offerings: [
      { title: 'Acquisition brief', desc: 'Defining sector, size, location and budget for the search.' },
      { title: 'Target sourcing', desc: 'Identifying on- and off-market businesses that fit your brief.' },
      { title: 'Due diligence', desc: 'Reviewing accounts, contracts, liabilities, IP, staff and compliance.' },
      { title: 'Valuation & offer', desc: 'Benchmarking price and framing a letter of intent.' },
      { title: 'Deal structuring', desc: 'Share purchase vs asset purchase, earn-outs and payment terms.' },
      { title: 'Completion & handover', desc: 'Coordinating transfer of shares, bank accounts, licences and registrations.' }
    ],
    process: [
      { title: 'Brief & search', desc: 'We agree your criteria and build a shortlist of targets.' },
      { title: 'Initial review', desc: 'We assess each target and open conversations with sellers.' },
      { title: 'Due diligence', desc: 'We investigate the finances, contracts and risks in detail.' },
      { title: 'Negotiate & complete', desc: 'We support price negotiation and coordinate legal completion and transfer.' }
    ],
    faqs: [
      { q: 'Do you act as a licensed broker or lawyer?', a: 'No. We provide practical acquisition support and project coordination, and we bring in licensed brokers, lawyers and tax advisers for regulated work.' },
      { q: 'Can you help me buy a company in another country?', a: 'Yes. Cross-border acquisitions are a core focus — we coordinate local due diligence and completion in each of our markets.' },
      { q: 'Should I buy the shares or just the assets?', a: 'It depends on the liabilities, contracts, tax position and licences involved. We compare both routes for your specific target.' },
      { q: 'How long does an acquisition take?', a: 'A straightforward small-business purchase can complete in 8–16 weeks; larger or regulated deals take longer.' }
    ]
  }
};

// Attach a photo to each detailed service page.
for (const [slug, detail] of Object.entries(serviceDetails)) {
  detail.image = serviceImages[slug];
}

export const getServiceDetail = (slug) => serviceDetails[slug];

// Single source of truth for the visa destinations we support.
// Maintained on the tourist-visa detail above and reused by the consultation form.
export const visaCountries = serviceDetails['tourist-visa'].countries;
