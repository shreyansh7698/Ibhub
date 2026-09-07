import { useReducedMotion } from 'framer-motion';

/**
 * Site-wide "daytime" atmosphere shown behind the light sections: a graded sky,
 * a warm sun bloom and two drifting cloud banks. Deliberately CSS-only — the
 * drift runs on the compositor (transform keyframes) and there is no
 * scroll-linked work, so it costs nothing while the dark cinematic set-pieces
 * cover it. Collapses to a flat sky under reduced-motion.
 */
export default function SkyAtmosphere() {
  const reduced = useReducedMotion();
  if (reduced) return <div className="sky sky--static" aria-hidden="true" />;

  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__sun" />
      <div className="sky__clouds sky__clouds--far" />
      <div className="sky__clouds sky__clouds--near" />
      <div className="sky__haze" />
    </div>
  );
}
