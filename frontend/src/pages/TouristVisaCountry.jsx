import { Link, useParams, Navigate } from 'react-router-dom';
import { CheckCircle2, FileText, Clock, ArrowRight, Landmark } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Reveal from '../components/Reveal.jsx';
import { flagUrl } from '../data/countries.js';
import { getTouristVisa, getTouristVisaSummary, formatMoney } from '../data/touristVisas.js';
import { DOC_TYPES } from '../services/types.js';

export default function TouristVisaCountry() {
  const { countrySlug } = useParams();
  const summary = getTouristVisaSummary(countrySlug);
  const visa = getTouristVisa(countrySlug);

  if (!summary || !visa) return <Navigate to="/visa-immigration/tourist-visa" replace />;

  const applyTo = `/visa-application/${countrySlug}`;

  return (
    <div className="page">
      <Seo
        title={`${summary.name} Tourist Visa Application`}
        description={`Apply online for a ${summary.name} tourist visa with IBHUB — requirements, documents, fees and processing time, plus a guided application.`}
        path={`/visa-immigration/tourist-visa/${countrySlug}`}
      />

      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Visa & Immigration', to: '/visa-immigration' },
          { label: 'Tourist Visa', to: '/visa-immigration/tourist-visa' },
          { label: summary.name }
        ]}
        eyebrow="Tourist Visa"
        title={`${summary.name} Tourist Visa Application`}
        subtitle={`Requirements, documents and fees for a ${summary.name} tourist visa — and a guided online application that takes about 10 minutes.`}
        flag={flagUrl(summary.code, 'w160')}
        actions={[
          { label: 'Apply now', to: applyTo, variant: 'btn--coral' },
          { label: 'Talk to an expert', to: '/contact', variant: 'btn--ghost-light' }
        ]}
      />

      {/* At a glance */}
      <section className="section section--tight">
        <div className="container">
          <div className="visa-glance">
            {visa.visaTypes.map((t) => (
              <Reveal key={t.id} className="visa-glance__card">
                <h3>{t.label}</h3>
                <dl>
                  <div><dt>Length of stay</dt><dd>{t.stayDuration}</dd></div>
                  <div><dt>Validity</dt><dd>{t.validity}</dd></div>
                  <div><dt>Entry</dt><dd>{t.entryType}</dd></div>
                  <div><dt>Processing time</dt><dd>{t.processingTime}</dd></div>
                  <div className="visa-glance__fee">
                    <dt>From</dt>
                    <dd>{formatMoney(t.fees.visaFee + t.fees.serviceFee + t.fees.tax, t.fees.currency)}</dd>
                  </div>
                </dl>
                <Link to={`${applyTo}?visaType=${t.id}`} className="btn btn--coral btn--block">
                  Apply for this visa <ArrowRight aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section section--surface">
        <div className="container">
          <div className="two-col">
            <Reveal>
              <SectionHeading eyebrow="Eligibility" title="Who can apply" align="left" />
              <ul className="check-list">
                {visa.eligibility.map((e) => (
                  <li key={e}>
                    <CheckCircle2 aria-hidden="true" />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <SectionHeading eyebrow="What we'll need" title="Requirements" align="left" />
              <ul className="check-list">
                {visa.requirements.map((r) => (
                  <li key={r}>
                    <CheckCircle2 aria-hidden="true" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Documents" title="Documents you'll upload" />
          <div className="info-cards">
            {visa.requiredDocuments.map((key, i) => {
              const cfg = DOC_TYPES[key];
              return (
                <Reveal key={key} delay={(i % 3) * 0.08}>
                  <div className="info-card">
                    <span className="info-card__ico" aria-hidden="true">
                      {key === 'bank_statement' ? <Landmark /> : <FileText />}
                    </span>
                    <h3>{cfg?.label || key}</h3>
                    <p>{cfg?.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <p className="visa-countries__note">
            {visa.requiresBankStatement
              ? `${summary.name} requires proof of funds — your bank statement is uploaded securely and seen only by authorised staff.`
              : `${summary.name} does not require a bank statement for this tourist visa.`}
          </p>
        </div>
      </section>

      {/* Processing + CTA */}
      <section className="section section--surface">
        <div className="container visa-cta">
          <div>
            <span className="kicker">
              <Clock aria-hidden="true" /> Typical processing {visa.processingTime}
            </span>
            <h2>Ready to apply for your {summary.name} tourist visa?</h2>
            <p>
              The guided application walks you through your details, passport and documents, then a
              secure payment. IBHUB provides visa assistance — issuance is decided by the relevant
              authority and payment does not guarantee approval.
            </p>
          </div>
          <Link to={applyTo} className="btn btn--coral btn--lg">
            Start application <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
