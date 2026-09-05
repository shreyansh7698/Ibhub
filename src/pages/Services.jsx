import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import StatsSection from '../components/StatsSection.jsx';
import CTASection from '../components/CTASection.jsx';
import Reveal from '../components/Reveal.jsx';
import { allServices } from '../data/services.js';
import { pageImages } from '../data/images.js';

export default function Services() {
  return (
    <div className="page">
      <Seo
        title="International Business Services"
        description="Company formation, business banking assistance, accounting and tax, visa and immigration, virtual office, compliance, and business expansion consulting."
        path="/services"
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        eyebrow="Our Services"
        title="Everything You Need to Build and Run a Global Business"
        subtitle="One accountable team for formation, banking, accounting, tax, visas, virtual office, compliance and expansion — across all of our core markets."
        image={pageImages.services}
        actions={[
          { label: 'Book Free Consultation', to: '/contact', variant: 'btn--gold' },
          { label: 'Company Formation', to: '/company-formation', variant: 'btn--ghost-light' }
        ]}
      />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="What We Do" title="Core Services" />
          <div className="grid grid--3">
            {allServices.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 0.08}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <SectionHeading eyebrow="The Process" title="How We Work" />
          <HowItWorks />
        </div>
      </section>

      <section className="section section--navy">
        <div className="container">
          <SectionHeading eyebrow="Track Record" title="Trusted Across 25+ Markets" />
          <StatsSection />
        </div>
      </section>

      <CTASection
        title="Not sure which service you need?"
        text="Book a free consultation and we'll map out exactly what your international setup requires."
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
        secondaryLabel="Read the FAQ"
        secondaryTo="/faq"
      />
    </div>
  );
}
