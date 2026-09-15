import { Link } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  FileText,
  ListChecks,
  Landmark,
  Calculator,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import Seo from './Seo.jsx';
import PageHero from './PageHero.jsx';
import FAQ from './FAQ.jsx';
import CTASection from './CTASection.jsx';
import Reveal from './Reveal.jsx';
import Media from './Media.jsx';
import ProcessSteps from './ProcessSteps.jsx';
import { flagUrl } from '../data/countries.js';
import { formationFaqs } from '../data/formations.js';
import { countryImages } from '../data/images.js';

export default function FormationTemplate({ country }) {
  const faqs = formationFaqs(country);

  return (
    <div className="page">
      <Seo
        title={country.heroHeading}
        description={country.heroText}
        path={country.formationPath}
      />

      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Company Formation', to: '/company-formation' },
          { label: `${country.shortName} Company Formation` }
        ]}
        flag={flagUrl(country.code, 'w160')}
        image={countryImages[country.slug]}
        eyebrow={`${country.name} · ${country.currency}`}
        title={country.heroHeading}
        subtitle={country.heroText}
        actions={[
          { label: 'Start Your Company', to: '/contact', variant: 'btn--gold' },
          { label: 'Talk to an Expert', to: '/contact', variant: 'btn--ghost-light' }
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="tmpl-layout">
            <div className="tmpl-body">
              <Reveal as="section">
                <h2>Why Start a Company in {country.shortName}?</h2>
                <p>{country.countrySummary}</p>
                <p>
                  {country.name} is particularly popular with {country.popularWith}. Our team manages the
                  filing end to end and coordinates the registrations your new entity needs to start
                  operating.
                </p>
                <Media
                  src={countryImages[country.slug]}
                  alt={`Business district in ${country.name}`}
                  label={`${country.shortName} · ${country.currency}`}
                  ratio="16 / 9"
                  className="tmpl-media"
                />
              </Reveal>

              <Reveal as="section">
                <h2>Key Benefits</h2>
                <ul className="check-list">
                  {country.benefits.map((b) => (
                    <li key={b}>
                      <CheckCircle2 aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal as="section">
                <h2>Business Structures</h2>
                <div className="grid grid--2">
                  {country.structures.map((s) => (
                    <div className="info-card" key={s.name}>
                      <h3>
                        <Building2 aria-hidden="true" />
                        {s.name}
                      </h3>
                      <p>{s.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-md">
                  <h3 style={{ marginBottom: 12 }}>Popular locations</h3>
                  <div className="pill-list">
                    {country.states.map((st) => (
                      <span className="pill" key={st}>
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal as="section">
                <h2>Requirements</h2>
                <ul className="check-list">
                  {country.requirements.map((r) => (
                    <li key={r}>
                      <ListChecks aria-hidden="true" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal as="section">
                <h2>Documents Required</h2>
                <ul className="check-list">
                  {country.documents.map((d) => (
                    <li key={d}>
                      <FileText aria-hidden="true" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal as="section">
                <h2>Company Formation Process</h2>
                <ProcessSteps steps={country.process} />
              </Reveal>

              <Reveal as="section">
                <h2>Estimated Timeline</h2>
                <div className="timeline">
                  {country.timeline.map((row) => (
                    <div className="timeline__row" key={row.title}>
                      <span className="timeline__time">
                        <Clock size={15} aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 6 }} />
                        {row.time}
                      </span>
                      <div className="timeline__desc">
                        <h4>{row.title}</h4>
                        <p>{row.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="disclaimer-note">
                  Timelines are indicative and depend on government processing, document readiness, and
                  third-party checks. Bank account opening and visa steps run separately.
                </p>
              </Reveal>

              <Reveal as="section">
                <h2>What’s Included</h2>
                <ul className="check-list">
                  {country.included.map((inc) => (
                    <li key={inc}>
                      <Check aria-hidden="true" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal as="section">
                <h2>Optional Add-On Services</h2>
                <div className="addons-grid">
                  {country.addons.map((a) => (
                    <div className="addon" key={a.title}>
                      <Check aria-hidden="true" />
                      <div>
                        <strong>{a.title}</strong>
                        <span>{a.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal as="section">
                <h2>Banking Assistance</h2>
                <p>
                  We help you prepare a complete business bank account application and introduce banking
                  and electronic money institution partners suited to a {country.shortName} company.
                  Account opening is always subject to the provider’s eligibility criteria and approval —
                  we do not guarantee an outcome.
                </p>
                <p>
                  <Link to="/services/bank-account-assistance" className="link-arrow">
                    Learn about our banking assistance
                  </Link>
                </p>
              </Reveal>

              <Reveal as="section">
                <h2>Accounting &amp; Tax</h2>
                <p>
                  Keep your {country.shortName} entity compliant with bookkeeping, financial statements,
                  payroll, and corporate tax and indirect tax returns. We offer this as an ongoing
                  subscription or a year-end service.
                </p>
                <p>
                  <Link to="/services/accounting-tax" className="link-arrow">
                    Explore accounting &amp; tax services
                  </Link>
                </p>
              </Reveal>

              <Reveal as="section">
                <h2>Annual Compliance</h2>
                <p>
                  Every {country.shortName} company has recurring obligations such as annual returns,
                  register updates, and statutory filings. Our compliance team tracks each deadline and
                  files on your behalf so your company stays in good standing.
                </p>
                <p>
                  <Link to="/services/corporate-compliance" className="link-arrow">
                    See our compliance service
                  </Link>
                </p>
              </Reveal>

              <Reveal as="section">
                <h2>Frequently Asked Questions</h2>
                <FAQ items={faqs} />
              </Reveal>
            </div>

            <aside className="tmpl-aside">
              <div className="aside-card">
                <h3>Start your {country.shortName} company</h3>
                <p>Book a free consultation and we’ll map the fastest compliant route for your business.</p>
                <Link to="/contact" className="btn btn--primary btn--block">
                  Book Free Consultation
                </Link>
                <Link to="/contact" className="btn btn--outline btn--block">
                  Request a Quote
                </Link>
                <ul className="check-list aside-card__list">
                  <li>
                    <Landmark size={18} aria-hidden="true" />
                    <span>Banking introductions</span>
                  </li>
                  <li>
                    <Calculator size={18} aria-hidden="true" />
                    <span>Accounting &amp; tax support</span>
                  </li>
                  <li>
                    <ShieldCheck size={18} aria-hidden="true" />
                    <span>Ongoing compliance</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTASection
        title={`Ready to incorporate in ${country.shortName}?`}
        text="Speak with a consultant about structure, timelines, banking, and ongoing compliance."
        primaryLabel="Start Your Company"
        secondaryLabel="Talk to an Expert"
      />
    </div>
  );
}
