import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import Seo from '../components/Seo.jsx';
import PageHero from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import CTASection from '../components/CTASection.jsx';
import { posts, blogCategories } from '../data/blog.js';
import { pageImages } from '../data/images.js';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Blog() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="page">
      <Seo
        title="Resources & Insights"
        description="Guides on international company formation, business banking, cross-border tax, visas and market expansion from the International Business Hub team."
        path="/blog"
      />

      <PageHero
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Resources' }]}
        eyebrow="Resources"
        title="Insights for Founders Going Global"
        subtitle="Practical guides on company formation, banking, tax, immigration and expansion — written by our specialists."
        image={pageImages.blog}
      />

      <section className="section">
        <div className="container">
          <div className="blog-toolbar">
            <div className="blog-search">
              <Search aria-hidden="true" />
              <input
                type="search"
                placeholder="Search articles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search articles"
              />
            </div>
            <div className="blog-filters" role="group" aria-label="Filter by category">
              {blogCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`chip ${category === cat ? 'is-active' : ''}`}
                  aria-pressed={category === cat}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="blog-empty">
              <p>No articles match your search. Try a different keyword or category.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {filtered.map((post, i) => (
                <Reveal key={post.slug} delay={(i % 3) * 0.07}>
                  <Link to={`/blog/${post.slug}`} className="article-card">
                    <div className="article-card__media">
                      {post.image && (
                        <img
                          className="article-card__img"
                          src={post.image}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                      <span>{post.category}</span>
                    </div>
                    <div className="article-card__body">
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <div className="article-card__meta">
                        <span>{formatDate(post.date)}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Have a question we haven’t covered?"
        text="Book a free consultation and get answers specific to your business and target markets."
        primaryLabel="Book Free Consultation"
        primaryTo="/contact"
        secondaryLabel="Read the FAQ"
        secondaryTo="/faq"
      />
    </div>
  );
}
