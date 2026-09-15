import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';
import Hero from '../components/Hero.jsx';
import GlobalNetwork from '../components/GlobalNetwork.jsx';
import ServicesShowcase from '../components/ServicesShowcase.jsx';
import FinalCTA from '../components/FinalCTA.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import CountriesBar from '../components/CountriesBar.jsx';
import CountryCard from '../components/CountryCard.jsx';
import FeatureGrid from '../components/FeatureGrid.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import StatsSection from '../components/StatsSection.jsx';
import TestimonialsCarousel from '../components/TestimonialsCarousel.jsx';
import FAQ from '../components/FAQ.jsx';
import CTASection from '../components/CTASection.jsx';
import ConsultationForm from '../components/ConsultationForm.jsx';
import CheckList from '../components/CheckList.jsx';
import Reveal from '../components/Reveal.jsx';
import HorizontalScroll from '../motion/HorizontalScroll.jsx';
import SmartImage from '../motion/SmartImage.jsx';
import { countryImages } from '../data/images.js';

import { countries } from '../data/countries.js';
import { whyChooseUs } from '../data/content.js';
import { homeFaqs } from '../data/faq.js';

const formationOrder = ['usa', 'uk', 'uae', 'singapore', 'hong-kong', 'europe'];
const formationCountries = formationOrder.map((s) => countries.find((c) => c.slug === s));

export default function Home() {
  return (
    <div className="page">
      <Seo
        title={null}
        description="The International Business Hub helps entrepreneurs form companies in the USA, UK, UAE, Singapore and Hong Kong, with banking, accounting, tax, visa and compliance support."
        path="/"
      />

      <Hero />

      {/* Trust / countries bar */}
      <section className="section section--surface section--tight" id="markets">
        <div className="container">
          <SectionHeading
            eyebrow="Global Markets"
            title="Start Your Business in Leading Global Markets"
            subtitle="We support company formation and ongoing operations across the world's most trusted business jurisdictions."
          />
          <CountriesBar />
        </div>
      </section>

      {/* Signature moment 2 — the connected network */}
      <GlobalNetwork />

      {/* Services — 3D storytelling */}
      <ServicesShowcase />

      {/* Company formation countries */}
      <section className="section section--surface" id="countries">
        <div className="container">
          <SectionHeading
            eyebrow="Company Formation"
            title="Start Your Company in the World's Leading Business Destinations"
            subtitle="Choose a jurisdiction and we'll handle registration, key registrations, and your first-year compliance."
          />
          <div className="grid grid--3">
            {formationCountries.map((country, i) => (
              <Reveal key={country.slug} delay={(i % 3) * 0.08}>
                <CountryCard country={country} variant="formation" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Why The International Business Hub"
            title="Your Trusted Partner for Global Business Expansion"
            subtitle="We combine local knowledge in every market with a single, accountable point of contact."
          />
          <FeatureGrid items={whyChooseUs} columns={3} />
        </div>
      </section>

      {/* Global reach — horizontal scroll showcase */}
      <section className="section section--surface section--tight">
        <div className="container">
          <SectionHeading
            eyebrow="Global Reach"
            title="One Team, Every Major Market"
            subtitle="Scroll across the jurisdictions where we form and run companies every week."
          />
        </div>
        <HorizontalScroll className="reach">
          {formationCountries.map((country) => (
            <article className="reach__panel" key={country.slug}>
              <SmartImage
                className="reach__media"
                src={countryImages[country.slug]}
                alt={country.name}
              />
              <div className="reach__body">
                <span className="reach__kicker">{country.currency}</span>
                <h3>{country.shortName}</h3>
                <p>{country.cardSubtitle}</p>
                <Link to={country.formationPath} className="link-arrow">
                  Explore Formation →
                </Link>
              </div>
            </article>
          ))}
        </HorizontalScroll>
      </section>

      {/* How it works */}
      <section className="section section--surface">
        <div className="container">
          <SectionHeading
            eyebrow="The Process"
            title="Start Your Global Business in 4 Simple Steps"
            subtitle="A clear path from first conversation to an operating company."
          />
          <HowItWorks />
        </div>
      </section>

      {/* Business growth / CTA */}
      <CTASection />

      {/* Statistics */}
      <section className="section section--navy">
        <div className="bg-blob" style={{ width: 340, height: 340, background: '#2f6bff', top: -140, left: -60 }} />
        <div className="container">
          <SectionHeading
            eyebrow="By the Numbers"
            title="Results That Speak for Themselves"
            subtitle="A snapshot of the businesses and founders we've supported worldwide."
          />
          <StatsSection />
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Client Stories"
            title="Trusted by Entrepreneurs Worldwide"
            subtitle="Sample stories from founders who built and expanded their businesses with our support."
          />
          <TestimonialsCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--surface">
        <div className="container">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            subtitle="Answers to the questions we hear most from founders planning an international company."
          />
          <FAQ items={homeFaqs} />
        </div>
      </section>

      {/* Consultation form */}
      <section className="section" id="consultation">
        <div className="container">
          <div className="two-col">
            <Reveal>
              <span className="eyebrow">Book a Consultation</span>
              <h2 style={{ margin: '16px 0 16px' }}>Let's Build Your Global Business</h2>
              <p className="lead">
                Tell us where you want to operate and what you need help with. A consultant will get back
                to you within one business day with clear next steps — no obligation.
              </p>
              <CheckList
                className="mt-md"
                items={[
                  'Free 30-minute strategy consultation',
                  'Jurisdiction and structure recommendations',
                  'Transparent pricing before you commit'
                ]}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ConsultationForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Signature moment 3 — the closing globe */}
      <FinalCTA />
    </div>
  );
}
