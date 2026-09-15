import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { countries } from '../data/countries.js';
import Flag from './Flag.jsx';
import Marquee from '../motion/Marquee.jsx';

const order = ['usa', 'uk', 'uae', 'singapore', 'hong-kong'];
const list = order.map((slug) => countries.find((c) => c.slug === slug));

export default function CountriesBar() {
  return (
    <div className="countries-bar">
      <Marquee speed={26} gap={18}>
        {list.map((c) => (
          <motion.div key={c.slug} whileHover={{ y: -4, scale: 1.05 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
            <Link to={c.formationPath} className="countries-bar__item">
              <Flag code={c.code} name={c.name} size="w80" />
              {c.shortName}
            </Link>
          </motion.div>
        ))}
      </Marquee>
    </div>
  );
}
