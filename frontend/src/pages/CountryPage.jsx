import { useParams, Navigate, Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CheckList from '../components/CheckList.jsx';
import CTASection from '../components/CTASection.jsx';
import Reveal from '../components/Reveal.jsx';
import { Building2, Clock, Coins, Users } from 'lucide-react';
import { getCountry, flagUrl } from '../data/countries.js';
import { countryImages } from '../data/images.js';

export default function CountryPage() {
  const { slug } = useParams();
  const country = getCountry(slug);

  if (!country) return <Navigate to="/countries" replace />;

  const facts = [
    { icon: Coins, label: 'Currency', value: country.currency },
    { icon: Clock, label: 'Time zone', value: country.timezone },
    { icon: Building2, label: 'Popular structure', value: country.structures[0].name },
    { icon: Users, label: 'Popular with', value: country.popularWith }
  ];

  return (
    <div className="page">
      <Seo
        title={`Doing Business in ${country.name}`}
        description={`${country.countrySummary} Learn why founders choose ${country.name} and how The International Business Hub can help.`}
        path={`/countries/${country.slug}`}
      />

      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Countries', to: '/countries' },
          { label: country.name }
        ]}
        flag={flagUrl(country.code, 'w160')}
        image={countryImages[country.slug]}
        eyebrow="Country Guide"
        title={`Doing Business in ${country.name}`}
        subtitle={country.countrySummary}
        actions={[
          { label: `${country.shortName} Company Formation`, to: country.formationPath, variant: 'btn--gold' },
          { label: 'Talk to an Expert', to: '/contact', variant: 'btn--ghost-light' }
        ]}
      />

      <section className="section">
        <div className="container">
          <div className="info-cards">
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={(i % 3) * 0.08}>
                <div className="info-card">
                  <h3>
                    <f.icon aria-hidden="true" />
                    {f.label}
                  </h3>
                  <p>{f.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--surface">
        <div className="container">
          <div className="two-col">
            <Reveal>
              <span className="eyebrow">Why {country.shortName}</span>
              <h2 style={{ margin: '16px 0 16px' }}>Key advantages for founders</h2>
              <CheckList items={country.benefits} />
            </Reveal>
            <Reveal delay={0.1}>
              <span className="eyebrow">Business structures</span>
              <h2 style={{ margin: '16px 0 16px' }}>Common ways to incorporate</h2>
              {country.structures.map((s) => (
                <div className="info-card" key={s.name} style={{ marginBottom: 16 }}>
                  <h3>
                    <Building2 aria-hidden="true" />
                    {s.name}
                  </h3>
                  <p>{s.desc}</p>
                </div>
              ))}
              <p className="mt-sm">
                <Link to={country.formationPath} className="link-arrow">
                  See the full {country.shortName} formation guide
                </Link>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Popular Locations"
            title={`Where companies register in ${country.shortName}`}
          />
          <div className="pill-list" style={{ justifyContent: 'center' }}>
            {country.states.map((st) => (
              <span className="pill" key={st}>
                {st}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Thinking about ${country.name}?`}
        text="Book a consultation and we'll confirm whether it's the right base for your business."
        primaryLabel={`Start in ${country.shortName}`}
        primaryTo={country.formationPath}
        secondaryLabel="Compare Other Countries"
        secondaryTo="/countries"
      />
    </div>
  );
}
