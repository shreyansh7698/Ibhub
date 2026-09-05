import { media } from './images.js';

// Sample blog content. Bodies are arrays of simple blocks rendered by BlogPost.
export const blogCategories = [
  'All',
  'Company Formation',
  'Business Banking',
  'International Tax',
  'Visa & Immigration',
  'Business Expansion'
];

export const posts = [
  {
    slug: 'choosing-a-jurisdiction-for-your-first-company',
    title: 'Choosing a Jurisdiction for Your First International Company',
    category: 'Company Formation',
    date: '2026-07-18',
    readTime: '7 min read',
    excerpt:
      'A practical framework for weighing tax, banking, talent, and market access when you decide where to incorporate.',
    body: [
      { type: 'p', text: 'The best jurisdiction is rarely the one with the lowest headline tax rate. It is the one that fits your customers, your banking needs, and where you plan to be in three years.' },
      { type: 'h2', text: 'Start with your customers' },
      { type: 'p', text: 'If most of your revenue comes from US clients, a US entity can simplify contracting and payments. If you sell across Europe, a UK company is often a pragmatic base. Follow the money before you follow the tax table.' },
      { type: 'h2', text: 'Check banking reality' },
      { type: 'p', text: 'A company you cannot bank is a liability. Before committing, confirm that realistic banking or EMI options exist for your activity and ownership profile in that jurisdiction.' },
      { type: 'h2', text: 'Think about substance' },
      { type: 'p', text: 'Regulators and banks increasingly expect genuine activity where a company is registered. Consider whether you can support an address, local director, or staff if required.' },
      { type: 'h2', text: 'A simple shortlist' },
      { type: 'ul', items: ['United States — large market, familiar structures', 'United Kingdom — fast, low cost, strong reputation', 'Singapore — Asia hub with treaty network', 'UAE — Middle East trade and visa options'] },
      { type: 'p', text: 'Book a consultation and we will compare two or three options against your specific plan.' }
    ]
  },
  {
    slug: 'preparing-a-strong-business-bank-account-application',
    title: 'Preparing a Strong Business Bank Account Application',
    category: 'Business Banking',
    date: '2026-06-30',
    readTime: '6 min read',
    excerpt:
      'What banks and EMIs actually look for, and how to present your company so the review goes smoothly.',
    body: [
      { type: 'p', text: 'Bank onboarding is a risk assessment. Your job is to make that assessment easy by being clear, consistent, and complete.' },
      { type: 'h2', text: 'Tell a coherent story' },
      { type: 'p', text: 'Your business description, website, invoices, and expected transaction flows should all match. Contradictions are the most common reason an application stalls.' },
      { type: 'h2', text: 'Have the documents ready' },
      { type: 'ul', items: ['Certificate of incorporation and constitution', 'Register of directors and shareholders', 'Proof of address for each controller', 'Sample contracts or invoices', 'Source of funds and expected turnover'] },
      { type: 'h2', text: 'Choose the right provider' },
      { type: 'p', text: 'EMIs often onboard faster and support multi-currency accounts. Traditional banks may offer more credit and local clearing but take longer. Many companies use both.' },
      { type: 'callout', text: 'Account opening is always subject to the provider’s eligibility criteria and approval. No advisor can guarantee an account.' }
    ]
  },
  {
    slug: 'international-tax-basics-for-founders',
    title: 'International Tax Basics Every Founder Should Know',
    category: 'International Tax',
    date: '2026-06-12',
    readTime: '8 min read',
    excerpt:
      'Residency, permanent establishment, and withholding tax explained without the jargon.',
    body: [
      { type: 'p', text: 'You do not need to be a tax expert, but you should understand three concepts that shape most cross-border structures.' },
      { type: 'h2', text: '1. Tax residency' },
      { type: 'p', text: 'A company is usually taxed where it is incorporated and where it is effectively managed. If your board meets and decides in another country, that country may claim taxing rights.' },
      { type: 'h2', text: '2. Permanent establishment' },
      { type: 'p', text: 'Having people or a fixed place of business in a country can create a taxable presence there, even without a local company. Plan hiring and travel with this in mind.' },
      { type: 'h2', text: '3. Withholding tax' },
      { type: 'p', text: 'Cross-border payments of dividends, interest, and royalties can attract withholding tax, sometimes reduced by a treaty. Model this before you move money between entities.' },
      { type: 'p', text: 'Our accounting team can map these issues for your specific structure and coordinate specialist advice where needed.' }
    ]
  },
  {
    slug: 'visa-routes-for-entrepreneurs',
    title: 'Visa Routes for Entrepreneurs Expanding Abroad',
    category: 'Visa & Immigration',
    date: '2026-05-28',
    readTime: '6 min read',
    excerpt:
      'An overview of common business and investor visa routes across our core markets.',
    body: [
      { type: 'p', text: 'Immigration rules change often, so treat this as an orientation rather than advice. Every route has eligibility criteria and the final decision rests with the authority.' },
      { type: 'h2', text: 'United Arab Emirates' },
      { type: 'p', text: 'Company ownership in many free zones can support a renewable residence visa for the owner and dependents, subject to the authority’s approval.' },
      { type: 'h2', text: 'Singapore' },
      { type: 'p', text: 'The Employment Pass allows founders to relocate to run their company, subject to salary thresholds and Ministry of Manpower assessment.' },
      { type: 'h2', text: 'United Kingdom' },
      { type: 'p', text: 'The Skilled Worker route can be used to sponsor key hires once your company holds a sponsor licence.' },
      { type: 'callout', text: 'We assess eligibility and prepare applications, coordinating with licensed immigration partners where regulated advice is required.' }
    ]
  },
  {
    slug: 'building-a-multi-country-group-structure',
    title: 'Building a Multi-Country Group Structure That Scales',
    category: 'Business Expansion',
    date: '2026-05-09',
    readTime: '7 min read',
    excerpt:
      'How to design a holding and operating structure that supports fundraising, hiring, and new markets.',
    body: [
      { type: 'p', text: 'A good group structure is boring on purpose. It should be easy to explain to a bank, an investor, and a tax authority.' },
      { type: 'h2', text: 'Separate holding from operations' },
      { type: 'p', text: 'A holding company owns the group and its intellectual property; operating companies run the business in each market. This contains risk and simplifies future changes.' },
      { type: 'h2', text: 'Pick a credible holding location' },
      { type: 'p', text: 'Investors and banks are comfortable with well-known holding jurisdictions. Exotic structures can slow diligence and banking.' },
      { type: 'h2', text: 'Plan for reporting' },
      { type: 'p', text: 'Decide early how you will consolidate accounts across entities. Consistent software and a shared chart of accounts save months later.' },
      { type: 'p', text: 'Our expansion team designs structures with your next funding round and target markets in mind.' }
    ]
  },
  {
    slug: 'staying-compliant-after-incorporation',
    title: 'Staying Compliant After Incorporation: A Checklist',
    category: 'Company Formation',
    date: '2026-04-22',
    readTime: '5 min read',
    excerpt:
      'The recurring obligations that catch new companies out, and how to stay ahead of them.',
    body: [
      { type: 'p', text: 'Incorporation is day one. Keeping the company in good standing is the ongoing job.' },
      { type: 'h2', text: 'Annual filings' },
      { type: 'ul', items: ['Confirmation statement or annual return', 'Financial statements to the registry', 'Corporate tax return', 'VAT / GST / sales tax returns where registered'] },
      { type: 'h2', text: 'Keep registers current' },
      { type: 'p', text: 'Update your registers of directors, shareholders, and beneficial owners whenever something changes — not just at year end.' },
      { type: 'h2', text: 'Watch the deadlines' },
      { type: 'p', text: 'Late filings lead to penalties and, eventually, strike-off. A compliance calendar with reminders is the simplest protection.' },
      { type: 'p', text: 'We manage this end to end for clients through our compliance service.' }
    ]
  }
];

// Cover image per article.
const postImages = {
  'choosing-a-jurisdiction-for-your-first-company': media.financeDesk,
  'preparing-a-strong-business-bank-account-application': media.bankingProfessional,
  'international-tax-basics-for-founders': media.bookkeeping,
  'visa-routes-for-entrepreneurs': media.travelVisa,
  'building-a-multi-country-group-structure': media.officeTower,
  'staying-compliant-after-incorporation': media.paperworkDesk,
};
for (const post of posts) {
  post.image = postImages[post.slug];
}

export const getPost = (slug) => posts.find((p) => p.slug === slug);
