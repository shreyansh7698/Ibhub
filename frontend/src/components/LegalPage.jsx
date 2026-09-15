import Seo from './Seo.jsx';
import PageHero from './PageHero.jsx';

/**
 * @param {{heading: string, paragraphs?: string[], list?: string[], note?: string}[]} sections
 */
export default function LegalPage({ title, description, path, updated, intro, sections }) {
  return (
    <div className="page">
      <Seo title={title} description={description} path={path} />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: title }]}
        eyebrow="Legal"
        title={title}
        subtitle={`Last updated: ${updated}`}
      />

      <section className="section">
        <div className="container">
          <div className="prose">
            <p>{intro}</p>
            {sections.map((section, si) => (
              <div key={si}>
                {section.heading && <h2>{section.heading}</h2>}
                {(section.paragraphs || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                {section.list && (
                  <ul>
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.note && <p>{section.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
