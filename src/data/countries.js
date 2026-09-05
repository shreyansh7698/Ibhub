// Country data used across formation cards, dropdowns, and country pages.
// Flags come from flagcdn.com (free, no key required).
export const flagUrl = (code, size = 'w80') => `https://flagcdn.com/${size}/${code}.png`;

export const countries = [
  {
    slug: 'usa',
    code: 'us',
    name: 'United States',
    shortName: 'USA',
    formationPath: '/company-formation/usa',
    cardSubtitle: 'Build your business in the world’s largest economy.',
    countrySummary:
      'The United States offers deep capital markets, a vast consumer base, and globally recognised company structures such as the LLC and C Corporation.',
    heroHeading: 'Start Your Company in the USA',
    heroText:
      'Form a US LLC or C Corporation with support for registered agent service, EIN applications, a US business address, and ongoing compliance — designed for founders based anywhere in the world.',
    currency: 'USD',
    timezone: 'GMT-5 to GMT-8',
    popularWith: 'SaaS, e-commerce, agencies, and startups raising US investment',
    benefits: [
      'Access to the world’s largest consumer market and mature payment infrastructure',
      'Recognised structures (LLC, C Corp) familiar to global banks and investors',
      'No residency requirement to own or manage most US companies',
      'Strong ecosystem for fundraising, hiring, and partnerships',
      'Straightforward online formation in founder-friendly states'
    ],
    structures: [
      { name: 'LLC', desc: 'Flexible pass-through structure popular with small businesses, founders, and holding companies.' },
      { name: 'C Corporation', desc: 'Preferred by startups planning to raise venture capital or issue stock options.' }
    ],
    states: ['Wyoming', 'Delaware', 'Florida', 'Texas'],
    requirements: [
      'At least one owner (individual or company) — no US residency required',
      'A unique company name that meets state naming rules',
      'A registered agent with a physical address in the state of formation',
      'A responsible party with a valid passport for the EIN application'
    ],
    documents: [
      'Passport copy for each owner and director',
      'Proof of residential address (utility bill or bank statement)',
      'Preferred company name and 1–2 alternatives',
      'Brief description of business activities',
      'Ownership split between shareholders / members'
    ],
    process: [
      { title: 'Consultation & state selection', desc: 'We review your goals and recommend a structure and state of formation.' },
      { title: 'Name check & document preparation', desc: 'We confirm name availability and prepare the formation filing.' },
      { title: 'State filing', desc: 'We file the Articles of Organization or Incorporation with the state.' },
      { title: 'EIN application', desc: 'We assist with the IRS EIN application for your new entity.' },
      { title: 'Post-formation handover', desc: 'You receive your formation documents, EIN confirmation, and next-step guidance.' }
    ],
    timeline: [
      { time: 'Day 1–2', title: 'Onboarding', desc: 'Document collection and name confirmation.' },
      { time: 'Day 2–5', title: 'State filing', desc: 'Filing processed by the state (varies by state).' },
      { time: 'Week 2–4', title: 'EIN issued', desc: 'EIN typically issued within a few weeks for non-US responsible parties.' }
    ],
    included: [
      'Company registration (Articles of Organization / Incorporation)',
      'Registered agent service for the first year',
      'EIN application assistance',
      'US business address option',
      'Operating agreement / bylaws template assistance',
      'Banking guidance and introductions where available',
      'First-year compliance calendar'
    ],
    addons: [
      { title: 'ITIN application support', desc: 'Guidance for individual taxpayer identification numbers.' },
      { title: 'US phone number & mail scanning', desc: 'Professional presence for your US entity.' },
      { title: 'Bookkeeping subscription', desc: 'Monthly bookkeeping and year-end reports.' },
      { title: 'Sales tax registration', desc: 'Registration support in states where you have nexus.' }
    ]
  },
  {
    slug: 'uk',
    code: 'gb',
    name: 'United Kingdom',
    shortName: 'UK',
    formationPath: '/company-formation/uk',
    cardSubtitle: 'Establish your company in one of Europe’s leading business markets.',
    countrySummary:
      'The UK combines a fast, low-cost incorporation process with a globally respected legal system and strong access to European and Commonwealth markets.',
    heroHeading: 'Start Your Company in the UK',
    heroText:
      'Register a UK private limited company (Ltd) with a registered office address, director and shareholder setup, Companies House filing, and support for HMRC registrations.',
    currency: 'GBP',
    timezone: 'GMT / BST',
    popularWith: 'Consultancies, e-commerce, fintech, and holding companies',
    benefits: [
      'One of the fastest and most affordable incorporations in the world',
      'Globally trusted legal system and transparent public register',
      'Strong professional services, banking, and fintech ecosystem',
      'No UK residency requirement for directors or shareholders',
      'Attractive gateway for trading with Europe and beyond'
    ],
    structures: [
      { name: 'Private Limited Company (Ltd)', desc: 'The standard structure for most businesses — limited liability and simple share capital.' },
      { name: 'Limited Liability Partnership (LLP)', desc: 'Used by professional firms and joint ventures wanting partnership taxation.' }
    ],
    states: ['England & Wales', 'Scotland', 'Northern Ireland'],
    requirements: [
      'At least one director (natural person, aged 16+)',
      'At least one shareholder (can be the same person)',
      'A registered office address in the UK',
      'Details of persons with significant control (PSC)'
    ],
    documents: [
      'Passport copy for each director and shareholder',
      'Proof of residential address dated within 3 months',
      'Proposed company name and alternatives',
      'Standard Industrial Classification (SIC) activity codes',
      'Share allocation between shareholders'
    ],
    process: [
      { title: 'Consultation & structure', desc: 'We confirm the right structure and share setup for your plans.' },
      { title: 'Name & details check', desc: 'We verify name availability and prepare incorporation documents.' },
      { title: 'Companies House filing', desc: 'We submit the incorporation application electronically.' },
      { title: 'HMRC registrations', desc: 'We assist with Corporation Tax, PAYE, and VAT registrations as needed.' },
      { title: 'Handover', desc: 'You receive your certificate of incorporation, memorandum, and articles.' }
    ],
    timeline: [
      { time: 'Day 1', title: 'Onboarding', desc: 'Document collection and verification.' },
      { time: 'Day 1–3', title: 'Incorporation', desc: 'Companies House typically registers within 24–48 hours.' },
      { time: 'Week 1–2', title: 'Tax registrations', desc: 'HMRC references issued after incorporation.' }
    ],
    included: [
      'Company registration with Companies House',
      'Registered office address for the first year',
      'Director and shareholder setup',
      'Memorandum and articles of association',
      'Corporation Tax registration assistance',
      'VAT and PAYE registration guidance',
      'First-year compliance calendar'
    ],
    addons: [
      { title: 'Service address for directors', desc: 'Keep residential addresses off the public register.' },
      { title: 'Confirmation statement filing', desc: 'Annual filing handled on your behalf.' },
      { title: 'Bookkeeping & accounts', desc: 'Year-end accounts and Corporation Tax returns.' },
      { title: 'VAT return service', desc: 'Quarterly VAT preparation and submission.' }
    ]
  },
  {
    slug: 'uae',
    code: 'ae',
    name: 'United Arab Emirates',
    shortName: 'UAE',
    formationPath: '/company-formation/uae',
    cardSubtitle: 'Access tax-friendly business opportunities in the Middle East.',
    countrySummary:
      'The UAE offers free zone and mainland options, modern infrastructure, and a strategic location connecting Europe, Africa, and Asia.',
    heroHeading: 'Start Your Company in the UAE',
    heroText:
      'Set up a free zone or mainland company in the UAE with support for licensing, visa eligibility, office solutions, and corporate banking introductions.',
    currency: 'AED',
    timezone: 'GMT+4',
    popularWith: 'Trading, consulting, logistics, and holding structures',
    benefits: [
      'Competitive corporate tax environment with free zone incentives',
      '100% foreign ownership available in many activities and zones',
      'Strategic hub for Middle East, Africa, and South Asia trade',
      'Residence visa eligibility linked to company ownership',
      'World-class logistics, banking, and digital infrastructure'
    ],
    structures: [
      { name: 'Free Zone Company (FZE / FZC)', desc: 'Full foreign ownership, streamlined setup, and activity-specific licensing.' },
      { name: 'Mainland LLC', desc: 'Trade directly across the UAE market and bid for government contracts.' }
    ],
    states: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ras Al Khaimah'],
    requirements: [
      'Passport copies for all shareholders and managers',
      'Selection of business activity and licensing authority',
      'Proof of address and, in some cases, a short business plan',
      'Physical or flexi-desk office solution within the chosen zone'
    ],
    documents: [
      'Passport copy for each shareholder and manager',
      'Recent passport-size photograph',
      'Proof of residential address',
      'Proposed company names (3 options)',
      'Business activity description'
    ],
    process: [
      { title: 'Zone & activity selection', desc: 'We match your activity to the most suitable free zone or mainland authority.' },
      { title: 'Name reservation & initial approval', desc: 'We reserve your trade name and obtain initial approval.' },
      { title: 'Licence issuance', desc: 'We submit documents and coordinate licence issuance.' },
      { title: 'Establishment card & visas', desc: 'We assist with the establishment card and visa applications, subject to eligibility.' },
      { title: 'Bank account introduction', desc: 'We introduce you to banking partners for account opening.' }
    ],
    timeline: [
      { time: 'Day 1–3', title: 'Approvals', desc: 'Name reservation and initial approval.' },
      { time: 'Day 4–10', title: 'Licence', desc: 'Trade licence issued by the authority.' },
      { time: 'Week 3–6', title: 'Visas & banking', desc: 'Visa processing and bank account review.' }
    ],
    included: [
      'Free zone or mainland company registration',
      'Trade name reservation and initial approval',
      'Business licence issuance coordination',
      'Registered address / flexi-desk for the first year',
      'Establishment card assistance',
      'Visa eligibility guidance (subject to authority approval)',
      'Corporate bank account introductions'
    ],
    addons: [
      { title: 'Additional visa processing', desc: 'Employee and dependent visa support.' },
      { title: 'Office upgrade', desc: 'Dedicated office space within your free zone.' },
      { title: 'Accounting & VAT', desc: 'Bookkeeping and VAT return filing.' },
      { title: 'Corporate tax registration', desc: 'Registration and advisory for UAE corporate tax.' }
    ]
  },
  {
    slug: 'singapore',
    code: 'sg',
    name: 'Singapore',
    shortName: 'Singapore',
    formationPath: '/company-formation/singapore',
    cardSubtitle: 'Enter Asia through one of the world’s top business hubs.',
    countrySummary:
      'Singapore is a leading Asian financial centre with efficient incorporation, competitive corporate tax, and an extensive treaty network.',
    heroHeading: 'Start Your Company in Singapore',
    heroText:
      'Incorporate a Singapore private limited company with support for a resident director solution, company secretary, registered address, and ACRA filing.',
    currency: 'SGD',
    timezone: 'GMT+8',
    popularWith: 'Regional headquarters, fintech, trading, and holding companies',
    benefits: [
      'Efficient, fully digital incorporation via ACRA',
      'Competitive headline corporate tax rate and start-up exemptions',
      'Extensive network of double-taxation agreements',
      'Trusted banking sector and strong investor confidence',
      'Strategic base for Southeast Asia expansion'
    ],
    structures: [
      { name: 'Private Limited Company (Pte Ltd)', desc: 'The standard vehicle — limited liability and a separate legal identity.' },
      { name: 'Branch / Subsidiary', desc: 'Options for foreign parent companies establishing a local presence.' }
    ],
    states: ['Central Business District', 'One-North', 'Jurong', 'Changi'],
    requirements: [
      'At least one shareholder (individual or corporate)',
      'At least one locally resident director',
      'A qualified company secretary appointed within 6 months',
      'A local registered office address and minimum paid-up capital of SGD 1'
    ],
    documents: [
      'Passport copy for each director and shareholder',
      'Proof of residential address (overseas individuals)',
      'Proposed company name and business activity (SSIC code)',
      'Shareholding structure',
      'Parent company documents (for corporate shareholders)'
    ],
    process: [
      { title: 'Name application', desc: 'We reserve your company name with ACRA.' },
      { title: 'Officer appointments', desc: 'We arrange the resident director solution and company secretary.' },
      { title: 'Incorporation filing', desc: 'We file the incorporation with ACRA once documents are signed.' },
      { title: 'Corporate account setup', desc: 'We prepare your bank account application and introductions.' },
      { title: 'Compliance onboarding', desc: 'We set up your registered address, secretary, and filing calendar.' }
    ],
    timeline: [
      { time: 'Day 1', title: 'Name reserved', desc: 'ACRA name approval, usually same day.' },
      { time: 'Day 1–3', title: 'Incorporation', desc: 'Company registered once all KYC is complete.' },
      { time: 'Week 2–5', title: 'Banking', desc: 'Bank account review and activation.' }
    ],
    included: [
      'Private limited company incorporation with ACRA',
      'Company name application',
      'Company secretary for the first year',
      'Registered office address for the first year',
      'Resident director solution (subject to due diligence)',
      'Share certificates and company constitution',
      'First-year compliance and filing calendar'
    ],
    addons: [
      { title: 'Nominee director extension', desc: 'Ongoing resident director support beyond year one.' },
      { title: 'Employment Pass application', desc: 'Relocation support for founders, subject to MOM approval.' },
      { title: 'Accounting & GST', desc: 'Bookkeeping, unaudited financials, and GST filing.' },
      { title: 'XBRL & annual return', desc: 'Annual filing with ACRA and IRAS.' }
    ]
  },
  {
    slug: 'hong-kong',
    code: 'hk',
    name: 'Hong Kong',
    shortName: 'Hong Kong',
    formationPath: '/company-formation/hong-kong',
    cardSubtitle: 'Build your gateway to global Asian markets.',
    countrySummary:
      'Hong Kong offers a simple territorial tax system, free flow of capital, and a strategic position next to mainland China.',
    heroHeading: 'Start Your Company in Hong Kong',
    heroText:
      'Register a Hong Kong private limited company with support for a company secretary, registered address, Business Registration Certificate, and bank account introductions.',
    currency: 'HKD',
    timezone: 'GMT+8',
    popularWith: 'Trading, e-commerce, holding companies, and China-facing businesses',
    benefits: [
      'Territorial tax system — profits sourced outside Hong Kong may be exempt',
      'No restrictions on foreign ownership or capital movement',
      'Simple, low-cost incorporation and maintenance',
      'Gateway to mainland China and wider Asian markets',
      'Strong common-law legal framework and arbitration reputation'
    ],
    structures: [
      { name: 'Private Company Limited by Shares', desc: 'The standard structure for trading and holding activities.' },
      { name: 'Branch Office', desc: 'For overseas companies registering a presence in Hong Kong.' }
    ],
    states: ['Central', 'Kowloon', 'Sha Tin', 'Kwun Tong'],
    requirements: [
      'At least one director (individual, any nationality) and one shareholder',
      'A company secretary resident in Hong Kong',
      'A registered office address in Hong Kong',
      'A designated representative for significant controllers register'
    ],
    documents: [
      'Passport copy for each director and shareholder',
      'Proof of residential address',
      'Proposed company name (English and/or Chinese)',
      'Description of business activities',
      'Shareholding structure and parent company documents if applicable'
    ],
    process: [
      { title: 'Name check', desc: 'We confirm your proposed name is available with the Companies Registry.' },
      { title: 'Document preparation', desc: 'We prepare incorporation forms and the articles of association.' },
      { title: 'Incorporation & BR certificate', desc: 'We file with the Companies Registry and obtain the Business Registration Certificate.' },
      { title: 'Secretary & address setup', desc: 'We appoint the company secretary and provide the registered address.' },
      { title: 'Banking introduction', desc: 'We prepare your application and introduce banking partners.' }
    ],
    timeline: [
      { time: 'Day 1–2', title: 'Preparation', desc: 'Name check and document signing.' },
      { time: 'Day 3–7', title: 'Incorporation', desc: 'Certificate of Incorporation and BR Certificate issued.' },
      { time: 'Week 3–6', title: 'Banking', desc: 'Account application review (in-person meeting may be required).' }
    ],
    included: [
      'Private limited company incorporation',
      'Company name availability check',
      'Company secretary for the first year',
      'Registered office address for the first year',
      'Business Registration Certificate application',
      'Significant controllers register setup',
      'First-year compliance calendar'
    ],
    addons: [
      { title: 'Annual return & BR renewal', desc: 'Ongoing filings with the Companies Registry.' },
      { title: 'Accounting & audit coordination', desc: 'Bookkeeping and statutory audit arrangement.' },
      { title: 'Offshore claim support', desc: 'Documentation support for offshore profit claims.' },
      { title: 'Nominee services', desc: 'Nominee director / shareholder where required.' }
    ]
  },
  {
    slug: 'europe',
    code: 'eu',
    name: 'Europe',
    shortName: 'Europe',
    formationPath: '/company-formation/europe',
    cardSubtitle: 'Incorporate in the EU and reach 440 million consumers in a single market.',
    countrySummary:
      'Europe offers access to the EU single market, a stable regulatory framework, and a choice of business-friendly jurisdictions such as Estonia, Ireland, the Netherlands, and Cyprus — each with its own tax and reporting profile.',
    heroHeading: 'Start Your Company in Europe',
    heroText:
      'Set up an EU company with support for choosing the right member state, registering your entity, obtaining an EU VAT number, and appointing a local registered office and representative where required.',
    currency: 'EUR',
    timezone: 'GMT to GMT+3',
    popularWith: 'SaaS, e-commerce sellers, fintech, and holding companies serving the EU market',
    benefits: [
      'Access to the EU single market and free movement of goods, services and capital',
      'EU VAT registration for cross-border trade within the union',
      'A range of jurisdictions to match your tax, substance and banking needs',
      'Strong legal certainty and enforceable contracts across member states',
      'Fully remote incorporation available in several countries, including Estonia'
    ],
    structures: [
      { name: 'Private Limited Company (e.g. OÜ, BV, Ltd, GmbH)', desc: 'The standard limited-liability vehicle; the exact name and minimum capital depend on the member state.' },
      { name: 'European Company (SE)', desc: 'A pan-European structure for larger groups operating in multiple member states.' }
    ],
    states: ['Estonia', 'Ireland', 'Netherlands', 'Cyprus', 'Lithuania', 'Portugal'],
    requirements: [
      'At least one director and one shareholder (residency rules vary by country)',
      'A registered office address in the chosen member state',
      'A local representative or contact person where the jurisdiction requires one',
      'Details of beneficial owners for the UBO register'
    ],
    documents: [
      'Passport copy for each director and shareholder',
      'Proof of residential address dated within 3 months',
      'Proposed company name and alternatives',
      'Description of business activities and target markets',
      'Shareholding structure and parent company documents if applicable'
    ],
    process: [
      { title: 'Jurisdiction selection', desc: 'We compare member states on tax, substance, banking and reporting, then recommend the best fit.' },
      { title: 'Name check & documents', desc: 'We confirm name availability and prepare the incorporation file for that country.' },
      { title: 'Registration', desc: 'We file with the local commercial register, remotely where the jurisdiction allows.' },
      { title: 'VAT & tax registration', desc: 'We assist with the local tax number and EU VAT registration as needed.' },
      { title: 'Handover', desc: 'You receive your incorporation documents, registered office details, and a compliance calendar.' }
    ],
    timeline: [
      { time: 'Day 1–3', title: 'Onboarding', desc: 'Jurisdiction chosen, documents collected and verified.' },
      { time: 'Day 3–10', title: 'Incorporation', desc: 'Registration processed by the local register (varies by country).' },
      { time: 'Week 2–5', title: 'VAT & banking', desc: 'EU VAT number issued and bank or EMI account review.' }
    ],
    included: [
      'Member state selection advice',
      'Company registration with the local commercial register',
      'Registered office address for the first year',
      'Local representative / contact person where required',
      'EU VAT registration assistance',
      'UBO register filing',
      'First-year compliance calendar'
    ],
    addons: [
      { title: 'Substance package', desc: 'Local director, office and phone presence where tax substance is needed.' },
      { title: 'Accounting & VAT returns', desc: 'Bookkeeping, annual accounts and periodic VAT filings.' },
      { title: 'OSS / IOSS registration', desc: 'One-Stop-Shop VAT registration for EU-wide e-commerce sales.' },
      { title: 'Multi-country structuring', desc: 'Holding and operating entities across several member states.' }
    ]
  }
];

export const getCountry = (slug) => countries.find((c) => c.slug === slug);
