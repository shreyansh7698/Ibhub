import { motion } from 'framer-motion';
import { Stagger, StaggerItem } from '../motion/index.js';

/**
 * Reusable icon + title + description grid (Why Choose Us, service highlights, etc).
 * @param {{icon: Function, title: string, desc: string}[]} items
 */
export default function FeatureGrid({ items, columns = 3 }) {
  return (
    <Stagger className={`grid grid--${columns}`} stagger={0.08}>
      {items.map((item) => (
        <StaggerItem key={item.title} className="feature" whileHover={{ y: -6 }}>
          <motion.span
            className="icon-badge"
            aria-hidden="true"
            whileHover={{ rotate: 8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300, damping: 14 }}
          >
            <item.icon />
          </motion.span>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
