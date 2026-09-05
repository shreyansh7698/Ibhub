import { motion } from 'framer-motion';
import { howItWorks } from '../data/content.js';
import { Stagger, StaggerItem } from '../motion/index.js';
import { spring } from '../motion/presets.js';

export default function HowItWorks() {
  return (
    <Stagger className="steps" stagger={0.14}>
      {howItWorks.map((step) => (
        <StaggerItem key={step.num} className="step">
          <motion.div
            className="step__num"
            aria-hidden="true"
            variants={{
              hidden: { scale: 0, rotate: -90 },
              show: { scale: 1, rotate: 0, transition: spring.bouncy }
            }}
            whileHover={{ scale: 1.12, boxShadow: '0 18px 36px rgba(47,107,255,0.45)' }}
          >
            {step.num}
          </motion.div>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
