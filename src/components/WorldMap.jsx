import { motion } from 'framer-motion';

/**
 * Stylised, decorative world map built from a dot grid + connection arcs.
 * Not geographically precise — purely a premium visual element.
 */
const dots = [];
for (let y = 0; y < 11; y++) {
  for (let x = 0; x < 22; x++) {
    // rough landmass mask
    const inAmericas = x >= 3 && x <= 8 && y >= 2 && y <= 9 && !(x > 6 && y < 4) && !(x < 5 && y > 7);
    const inEurAfrica = x >= 9 && x <= 13 && y >= 1 && y <= 9 && !(x > 12 && y > 6);
    const inAsia = x >= 13 && x <= 19 && y >= 1 && y <= 6;
    const inOceania = x >= 17 && x <= 20 && y >= 7 && y <= 8;
    if (inAmericas || inEurAfrica || inAsia || inOceania) {
      dots.push({ x: x * 13 + 8, y: y * 13 + 8 });
    }
  }
}

const hubs = [
  { x: 70, y: 55, label: 'USA' },
  { x: 128, y: 40, label: 'UK' },
  { x: 150, y: 70, label: 'UAE' },
  { x: 210, y: 78, label: 'Singapore' },
  { x: 225, y: 55, label: 'Hong Kong' }
];

export default function WorldMap() {
  return (
    <svg
      className="hero__map"
      viewBox="0 0 300 150"
      role="img"
      aria-label="Stylised world map highlighting The International Business Hub markets"
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.7" fill="rgba(255,255,255,0.28)" />
      ))}

      {hubs.map((h, i) => (
        <g key={h.label}>
          {i > 0 && (
            <motion.path
              d={`M ${hubs[0].x} ${hubs[0].y} Q ${(hubs[0].x + h.x) / 2} ${Math.min(hubs[0].y, h.y) - 26} ${h.x} ${h.y}`}
              fill="none"
              stroke="rgba(212,175,55,0.55)"
              strokeWidth="0.8"
              strokeDasharray="3 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.4 + i * 0.15, ease: 'easeInOut' }}
            />
          )}
          <motion.circle
            cx={h.x}
            cy={h.y}
            r="3.4"
            fill="#d4af37"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.15, type: 'spring' }}
          />
          <motion.circle
            cx={h.x}
            cy={h.y}
            r="3.4"
            fill="none"
            stroke="#d4af37"
            strokeWidth="1"
            animate={{ r: [3.4, 9], opacity: [0.7, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        </g>
      ))}
    </svg>
  );
}
