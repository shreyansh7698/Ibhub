import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import FAQ from '../components/FAQ.jsx';
import CTASection from '../components/CTASection.jsx';
import Reveal from '../components/Reveal.jsx';
import { faqGroups } from '../data/faq.js';
import { pageImages } from '../data/images.js';

export default function FAQPage() {
  return (
    <div className="page">
      <Seo
        title="Frequently Asked Questions"
        description="Answers about international company formation, documents, banking, tax, compliance and how The International Business Hub works."
        path="/faq"
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]}
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything founders usually ask before starting an international company. Can't find your answer? Book a free consultation."
        image={pageImages.faq}
        actions={[{ label: 'Ask Us Directly', to: '/contact', variant: 'btn--gold' }]}
      />

      {faqGroups.map((group, i) => (
        <section className={`section ${i % 2 === 1 ? 'section--surface' : ''}`} key={group.title}>
          <div className="container">
            <SectionHeading eyebrow={`0${i + 1}`} title={group.title} />
            <Reveal>
              <FAQ items={group.items} allowMultiple />
            </Reveal>
          </div>
        </section>
      ))}

      <CTASection
        title="Still have questions?"
        text="Our consultants are happy to walk you through the options for your specific situation."
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
        secondaryLabel="Browse Resources"
        secondaryTo="/blog"
      />
    </div>
  );
}
