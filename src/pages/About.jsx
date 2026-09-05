import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import FeatureGrid from '../components/FeatureGrid.jsx';
import StatsSection from '../components/StatsSection.jsx';
import CTASection from '../components/CTASection.jsx';
import CheckList from '../components/CheckList.jsx';
import Reveal from '../components/Reveal.jsx';
import Media from '../components/Media.jsx';
import { Target, Eye } from 'lucide-react';
import { aboutValues, team } from '../data/content.js';
import { countries } from '../data/countries.js';
import { pageImages, media } from '../data/images.js';

const initials = (name) =>
  name
    .replace('.', '')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

export default function About() {
  return (
    <div className="page">
      <Seo
        title="About Us"
        description="The International Business Hub is an international business consultancy helping entrepreneurs form, manage and expand companies across the USA, UK, UAE, Singapore and Hong Kong."
        path="/about"
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        eyebrow="About Us"
        title="An International Team Built Around Founders"
        subtitle="We bring together company formation, banking, accounting, tax, immigration and compliance specialists so entrepreneurs can expand across borders with one point of contact."
        actions={[{ label: 'Work With Us', to: '/contact', variant: 'btn--gold' }]}
        image={pageImages.about}
      />

      {/* Our Story */}
      <section className="section">
        <div className="container">
          <div className="two-col">
            <Reveal>
              <span className="eyebrow">Our Story</span>
              <h2 style={{ margin: '16px 0 16px' }}>Why we started The International Business Hub</h2>
              <p>
                The International Business Hub grew out of a simple frustration: founders trying to go global were
                forced to stitch together company agents in one country, an accountant in another, a
                banking consultant somewhere else, and an immigration adviser on top. Every handoff added
                delay, cost, and risk.
              </p>
              <p>
                We built a single firm that covers the whole journey — from choosing a jurisdiction to
                filing annual returns years later — with consultants who actually talk to each other.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Media
                src={media.teamCollaboration}
                alt="Consultants collaborating across formation, finance and compliance"
                label="Global by design"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="section section--surface">
        <div className="container">
          <div className="mvv-grid">
            <Reveal>
              <div className="card">
                <span className="icon-badge" aria-hidden="true">
                  <Target />
                </span>
                <h3>Our Mission</h3>
                <p>
                  To make international business setup and compliance simple, transparent and accessible
                  for entrepreneurs everywhere — without inflated promises.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="card">
                <span className="icon-badge" aria-hidden="true">
                  <Eye />
                </span>
                <h3>Our Vision</h3>
                <p>
                  A world where a founder in any country can build a credible global company as easily as
                  a local one, with expert guidance at every step.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="card">
                <span className="icon-badge" aria-hidden="true">
                  <Target />
                </span>
                <h3>Our Promise</h3>
                <p>
                  Clear scope and pricing before you commit, realistic timelines, and honest advice —
                  even when the simplest option is not the most profitable one for us.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our Values" title="What Guides Our Work" />
          <FeatureGrid items={aboutValues} columns={3} />
        </div>
      </section>

      {/* Global expertise + how we help */}
      <section className="section section--surface">
        <div className="container">
          <div className="two-col">
            <Reveal>
              <span className="eyebrow">Global Expertise</span>
              <h2 style={{ margin: '16px 0 16px' }}>Local knowledge in every market we serve</h2>
              <p>
                Our specialists work across {countries.length} jurisdictions, including the six core
                markets below. We stay current on filing rules, banking expectations, and immigration
                routes so your structure holds up to scrutiny.
              </p>
              <div className="pill-list mt-md">
                {countries.map((c) => (
                  <span className="pill" key={c.slug}>
                    {c.shortName}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <span className="eyebrow">How We Help Entrepreneurs</span>
              <h2 style={{ margin: '16px 0 16px' }}>From first idea to ongoing operations</h2>
              <CheckList
                items={[
                  'Compare jurisdictions on tax, banking, talent and market access',
                  'Design a holding and operating structure that scales',
                  'Handle incorporation and every core registration',
                  'Prepare banking applications and make introductions',
                  'Run bookkeeping, tax filings and payroll',
                  'Track and file annual compliance for every entity'
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          {/* <SectionHeading
            eyebrow="Our Team"
            title="Specialists Across Formation, Finance and Compliance"
            subtitle="Team names are illustrative placeholders for this demo."
          /> */}
          {/* <div className="team-grid">
            {team.map((member, i) => (
              <Reveal key={member.name} delay={(i % 4) * 0.07}>
                <div className="team-card">
                  <div className="team-card__photo" aria-hidden="true">
                    {initials(member.name)}
                  </div>
                  <h3>{member.name}</h3>
                  <span>{member.role}</span>
                </div>
              </Reveal>
            ))}
          </div> */}
        </div>
      </section>

      {/* Stats */}
      <section className="section section--navy">
        <div className="container">
          <SectionHeading eyebrow="By the Numbers" title="A Growing Global Practice" />
          <StatsSection />
        </div>
      </section>

      <CTASection
        title="Let’s build your global business together"
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
        secondaryLabel="Explore Services"
        secondaryTo="/services"
      />
    </div>
  );
}
