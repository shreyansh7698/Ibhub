import { useParams, Navigate, Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import CTASection from '../components/CTASection.jsx';
import { getPost, posts } from '../data/blog.js';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2>{block.text}</h2>;
    case 'h3':
      return <h3>{block.text}</h3>;
    case 'ul':
      return (
        <ul>
          {block.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case 'callout':
      return (
        <p className="disclaimer-note" style={{ display: 'flex', gap: 10 }}>
          <Info size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{block.text}</span>
        </p>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  return (
    <div className="page">
      <Seo title={post.title} description={post.excerpt} path={`/blog/${post.slug}`} />

      <PageHero
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Resources', to: '/blog' },
          { label: post.category }
        ]}
        eyebrow={post.category}
        title={post.title}
        subtitle={`${formatDate(post.date)} · ${post.readTime}`}
        image={post.image}
      />

      <section className="section">
        <div className="container">
          {post.image && (
            <Reveal className="post-cover">
              <img
                src={post.image}
                alt=""
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.closest('.post-cover').style.display = 'none';
                }}
              />
            </Reveal>
          )}
          <Reveal className="prose" as="article">
            {post.body.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <p style={{ marginTop: 32 }}>
              <Link to="/blog" className="link-arrow">
                <ArrowLeft size={16} aria-hidden="true" /> Back to all articles
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--surface">
          <div className="container">
            <h2 style={{ marginBottom: 28 }}>Related articles</h2>
            <div className="blog-grid">
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="article-card">
                  <div className="article-card__media">
                    {p.image && (
                      <img
                        className="article-card__img"
                        src={p.image}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span>{p.category}</span>
                  </div>
                  <div className="article-card__body">
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Ready to put this into action?"
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
        secondaryLabel="Explore Services"
        secondaryTo="/services"
      />
    </div>
  );
}
