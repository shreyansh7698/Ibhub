import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Flag from './Flag.jsx';
import TiltCard from '../motion/TiltCard.jsx';
import { countryImages } from '../data/images.js';

/**
 * @param {'formation' | 'country'} variant  where the "explore" link points
 */
export default function CountryCard({ country, variant = 'formation' }) {
  const to = variant === 'country' ? `/countries/${country.slug}` : country.formationPath;
  const label = variant === 'country' ? 'Explore Country' : 'Explore Formation';
  const [loaded, setLoaded] = useState(false);

  return (
    <TiltCard className="card country-card" max={6} glare={false}>
      <motion.div className="country-card__media" initial="rest" whileHover="hover" animate="rest">
        {countryImages[country.slug] && (
          <>
            {!loaded && <span className="skeleton skeleton--fill" aria-hidden="true" />}
            <motion.img
              className="country-card__img"
              src={countryImages[country.slug]}
              alt=""
              loading="lazy"
              decoding="async"
              variants={{ rest: { scale: 1 }, hover: { scale: 1.09 } }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onLoad={() => setLoaded(true)}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </>
        )}
        <motion.div
          variants={{ rest: { y: 0 }, hover: { y: -3 } }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <Flag code={country.code} name={country.name} size="w160" className="country-card__flag" />
        </motion.div>
      </motion.div>
      <div className="country-card__body">
        <h3>{country.shortName}</h3>
        <p>{country.cardSubtitle}</p>
        <Link to={to} className="link-arrow" aria-label={`${label} — ${country.name}`}>
          {label} <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </TiltCard>
  );
}
