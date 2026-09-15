import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CountryCard from '../components/CountryCard.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import FeatureGrid from '../components/FeatureGrid.jsx';
import FAQ from '../components/FAQ.jsx';
import CTASection from '../components/CTASection.jsx';
import Reveal from '../components/Reveal.jsx';
import { countries } from '../data/countries.js';
import { whyChooseUs } from '../data/content.js';
import { pageImages } from '../data/images.js';

const order = ['usa', 'uk', 'uae', 'singapore', 'hong-kong', 'europe'];
const list = order.map((s) => countries.find((c) => c.slug === s));

const faqs = [
  {
    q: 'Which country should I incorporate in?',
    a: 'It depends on where your customers are, your tax position, banking needs, and long-term plans. During your consultation we compare two or three realistic options and explain the trade-offs.'
  },
  {
    q: 'Can you form companies in more than one country for me?',
    a: 'Yes. We regularly set up holding and operating structures across several jurisdictions and manage the compliance centrally.'
  },
  {
    q: 'Do you support the company after incorporation?',
    a: 'Yes — registered office, company secretary, accounting, tax, and annual compliance are all available as ongoing services.'
  },
  {
    q: 'Are there any outcomes you cannot guarantee?',
    a: 'Company approval, bank account opening, and visa issuance are decided by the relevant authority or institution. We prepare strong applications but cannot guarantee results.'
  }
];

export default function CompanyFormation() {
  return (
    <div className="page">
      <Seo
        title="International Company Formation"
        description="Form a company in the USA, UK, UAE, Singapore or Hong Kong with end-to-end assistance — registration, key registrations, banking guidance and compliance."
        path="/company-formation"
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Company Formation' }]}
        eyebrow="Company Formation"
        title="International Company Formation, Handled End to End"
        subtitle="Pick a jurisdiction and we take care of the filing, the core registrations your entity needs, banking introductions, and your first-year compliance calendar."
        image={pageImages.companyFormation}
        actions={[
          { label: 'Book Free Consultation', to: '/contact', variant: 'btn--gold' },
          { label: 'Compare Countries', to: '/countries', variant: 'btn--ghost-light' }
        ]}
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Jurisdictions"
            title="Choose Where to Incorporate"
            subtitle="Six core markets, each with a dedicated formation page covering structures, requirements, timelines and costs."
          />
          <div className="grid grid--3">
            {list.map((country, i) => (
              <Reveal key={country.slug} delay={(i % 3) * 0.08}>
                <CountryCard country={country} variant="formation" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <SectionHeading eyebrow="The Process" title="How Formation Works" />
          <HowItWorks />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Why The International Business Hub"
            title="A Single Team for Every Market"
          />
          <FeatureGrid items={whyChooseUs} columns={3} />
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <SectionHeading eyebrow="FAQ" title="Company Formation Questions" />
          <FAQ items={faqs} />
        </div>
      </section>

      <CTASection />
    </div>
  );
}
