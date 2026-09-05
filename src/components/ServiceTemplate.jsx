import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Seo from './Seo.jsx';
import PageHero from './PageHero.jsx';
import SectionHeading from './SectionHeading.jsx';
import FAQ from './FAQ.jsx';
import CTASection from './CTASection.jsx';
import Reveal from './Reveal.jsx';
import Media from './Media.jsx';
import ProcessSteps from './ProcessSteps.jsx';
import Flag from './Flag.jsx';

export default function ServiceTemplate({ detail, path, breadcrumbs }) {
  return (
    <div className="page">
      <Seo title={detail.title} description={detail.metaDescription} path={path} />

      <PageHero
        breadcrumbs={
          breadcrumbs || [
            { label: 'Home', to: '/' },
            { label: 'Services', to: '/services' },
            { label: detail.eyebrow }
          ]
        }
        eyebrow={detail.eyebrow}
        title={detail.title}
        subtitle={detail.intro}
        image={detail.image}
        actions={[
          { label: 'Book Free Consultation', to: '/contact', variant: 'btn--gold' },
          { label: 'Contact Us', to: '/contact', variant: 'btn--ghost-light' }
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="two-col">
            <Reveal>
              <span className="eyebrow">What you get</span>
              <h2 style={{ margin: '16px 0 18px' }}>Practical support, clearly scoped</h2>
              <ul className="check-list">
                {detail.highlights.map((h) => (
                  <li key={h}>
                    <CheckCircle2 aria-hidden="true" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className="stack-btns mt-md">
                <Link to="/contact" className="btn btn--primary">
                  Get Started
                </Link>
                <Link to="/services" className="btn btn--outline">
                  All Services
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Media src={detail.image} alt={detail.title} label={detail.eyebrow} />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <SectionHeading eyebrow="Scope" title="What this service covers" />
          <div className="info-cards">
            {detail.offerings.map((o, i) => (
              <Reveal key={o.title} delay={(i % 3) * 0.08}>
                <div className="info-card">
                  <h3>{o.title}</h3>
                  <p>{o.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {detail.countries?.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Destinations"
              title={detail.countriesTitle || 'Countries we cover'}
            />
            <ul className="visa-countries">
              {detail.countries.map((c, i) => (
                <Reveal key={c.code} as="li" delay={(i % 4) * 0.05}>
                  <span className="visa-countries__item">
                    <Flag code={c.code} name={c.name} size="w40" />
                    {c.name}
                  </span>
                </Reveal>
              ))}
            </ul>
            {detail.countriesNote && <p className="visa-countries__note">{detail.countriesNote}</p>}
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="How it works" title="A simple, transparent process" />
          <ProcessSteps steps={detail.process} />
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <FAQ items={detail.faqs} />
        </div>
      </section>

      <CTASection
        title="Let’s get this handled"
        text="Book a consultation and we’ll confirm scope, timeline, and pricing for your situation."
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
        secondaryLabel="View All Services"
        secondaryTo="/services"
      />
    </div>
  );
}
