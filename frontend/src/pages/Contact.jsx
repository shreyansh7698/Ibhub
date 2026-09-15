import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import ConsultationForm from '../components/ConsultationForm.jsx';
import Reveal from '../components/Reveal.jsx';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { site } from '../data/site.js';
import { pageImages } from '../data/images.js';

const mapQuery = encodeURIComponent(site.mapQuery || site.address);
const mapEmbedSrc = `https://maps.google.com/maps?q=${mapQuery}&z=12&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

const cards = [
  { icon: Phone, title: 'Call Us', lines: [site.phone], href: site.phoneHref, hint: 'Mon–Fri' },
  { icon: Mail, title: 'Email Us', lines: [site.email], href: `mailto:${site.email}`, hint: 'Replies within 1 business day' },
  { icon: MapPin, title: 'Visit Us', lines: [site.address], hint: 'By appointment' },
  { icon: Clock, title: 'Business Hours', lines: [site.hours], hint: 'Global coverage' }
];

export default function Contact() {
  return (
    <div className="page">
      <Seo
        title="Contact Us"
        description="Talk to The International Business Hub about international company formation, banking, accounting, tax, visas and compliance. Book a free consultation today."
        path="/contact"
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
        eyebrow="Contact"
        title="Let’s Talk About Your Global Business"
        subtitle="Tell us where you want to operate and what you need help with. A consultant will get back to you within one business day."
        image={pageImages.contact}
      />

      <section className="section">
        <div className="container">
          <div className="contact-cards">
            {cards.map((card, i) => (
              <Reveal key={card.title} delay={(i % 4) * 0.07}>
                <div className="card contact-card">
                  <span className="icon-badge" aria-hidden="true">
                    <card.icon />
                  </span>
                  <h3>{card.title}</h3>
                  {card.lines.map((line) =>
                    card.href ? (
                      <p key={line}>
                        <a href={card.href}>{line}</a>
                      </p>
                    ) : (
                      <p key={line}>{line}</p>
                    )
                  )}
                  <p style={{ color: 'var(--ink-400)', fontSize: '0.82rem', marginTop: 6 }}>{card.hint}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="two-col">
            <Reveal>
              <span className="eyebrow">Book a Consultation</span>
              <h2 style={{ margin: '16px 0 16px' }}>Request Your Free Consultation</h2>
              <p className="lead">
                Share a few details and we’ll match you with the right consultant for your market and
                service needs. There’s no cost and no obligation.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ConsultationForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--surface section--tight">
        <div className="container">
          <SectionHeading eyebrow="Find Us" title="Our Global Head Office" />
          <Reveal>
            <div className="map-embed">
              <iframe
                className="map-embed__frame"
                title={`Map showing ${site.address}`}
                src={mapEmbedSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="map-embed__card">
                <span className="map-embed__pin-ico" aria-hidden="true">
                  <MapPin />
                </span>
                <div>
                  <strong>{site.name}</strong>
                  <span>{site.address}</span>
                  <a href={mapLink} target="_blank" rel="noreferrer">
                    Open in Google Maps <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
