import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import TiltCard from '../motion/TiltCard.jsx';

export default function ServiceCard({ service }) {
  const Icon = service.icon;
  return (
    <TiltCard className="card service-card" max={7}>
      <motion.span
        className="icon-badge"
        aria-hidden="true"
        whileHover={{ rotate: -8, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Icon />
      </motion.span>
      <h3>{service.title}</h3>
      <p>{service.short}</p>
      <Link to={service.to} className="link-arrow" aria-label={`Learn more about ${service.title}`}>
        Learn More <ArrowRight aria-hidden="true" />
      </Link>
    </TiltCard>
  );
}
