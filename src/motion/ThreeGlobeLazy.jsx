import { lazy, Suspense } from 'react';
import { useReducedMotion } from 'framer-motion';

// three.js is heavy — load it only when a globe is actually rendered, and
// keep it out of the main bundle.
const ThreeGlobe = lazy(() => import('./ThreeGlobe.jsx'));

export default function ThreeGlobeLazy(props) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <Suspense fallback={null}>
      <ThreeGlobe {...props} />
    </Suspense>
  );
}
