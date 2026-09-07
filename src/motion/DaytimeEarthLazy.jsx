import { lazy, Suspense } from 'react';
import { useReducedMotion } from 'framer-motion';

// three.js is heavy — load it only when an Earth is actually rendered.
const DaytimeEarth = lazy(() => import('./DaytimeEarth.jsx'));

export default function DaytimeEarthLazy(props) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <Suspense fallback={null}>
      <DaytimeEarth {...props} />
    </Suspense>
  );
}
