import { Helmet } from 'react-helmet-async';
import { site } from '../data/site.js';
import { media } from '../data/images.js';

/**
 * Per-page SEO: unique <title> + meta description + canonical + Open Graph.
 */
export default function Seo({ title, description, path = '', image = media.teamCollaboration, noindex = false }) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
  const desc =
    description ||
    'The International Business Hub helps entrepreneurs form companies, open bank accounts, manage tax and compliance, and expand across international markets.';
  const url = `https://globalbusinesshub.example${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
