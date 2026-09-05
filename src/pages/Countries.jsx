import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CountryCard from '../components/CountryCard.jsx';
import CTASection from '../components/CTASection.jsx';
import Reveal from '../components/Reveal.jsx';
import { countries } from '../data/countries.js';
import { pageImages } from '../data/images.js';

const order = ['usa', 'uk', 'uae', 'singapore', 'hong-kong'];
const list = order.map((s) => countries.find((c) => c.slug === s));

export default function Countries() {
  return (
    <div className="page">
      <Seo
        title="Countries We Support"
        description="Compare business jurisdictions — the United States, United Kingdom, UAE, Singapore and Hong Kong — and find the right base for your company."
        path="/countries"
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Countries' }]}
        eyebrow="Countries"
        title="Choose the Right Country for Your Business"
        subtitle="Each of our core markets offers different advantages on tax, market access, banking and talent. Explore them below or book a consultation for a tailored comparison."
        image={pageImages.countries}
        actions={[{ label: 'Book Free Consultation', to: '/contact', variant: 'btn--gold' }]}
      />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our Markets" title="Six Leading Global Jurisdictions" />
          <div className="countries-grid">
            {list.map((country, i) => (
              <Reveal key={country.slug} delay={(i % 3) * 0.08}>
                <CountryCard country={country} variant="country" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Not sure which country is right?"
        text="We'll compare two or three realistic options against your customers, tax position and plans."
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
        secondaryLabel="See Formation Options"
        secondaryTo="/company-formation"
      />
    </div>
  );
}
