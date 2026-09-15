import { motion } from 'framer-motion';
import { Stagger, StaggerItem, Odometer } from '../motion/index.js';
import { spring } from '../motion/presets.js';
import { stats } from '../data/site.js';

export default function StatsSection({ light = false }) {
  return (
    <Stagger className="stats" stagger={0.1}>
      {stats.map((s) => (
        <StaggerItem
          key={s.label}
          className={`stat ${light ? 'stat--light' : ''}`}
          variants={{
            hidden: { opacity: 0, y: 28, scale: 0.85 },
            show: { opacity: 1, y: 0, scale: 1, transition: spring.soft }
          }}
          whileHover={{ y: -6, scale: 1.03 }}
        >
          <Odometer value={s.value} suffix={s.suffix} />
          <motion.div className="stat__label">{s.label}</motion.div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
