import Canvas3D from './Canvas3D.jsx';
import GlobeScene from './scenes/GlobeScene.jsx';

/**
 * Lazy entry point for every globe on the site — keeps three.js / R3F out of
 * the main bundle. Pass a `driverRef` (mutable object mutated by GSAP) to drive
 * camera + globe from scroll.
 */
export default function GlobeCanvas({
  driverRef,
  tier = 'full',
  camera = { position: [0, 0, 8], fov: 34 },
  className = ''
}) {
  // DPR is the biggest lever on a full-viewport canvas — cap it hard.
  const dpr = tier === 'mobile' ? [1, 1.3] : [1, 1.5];
  return (
    <Canvas3D className={className} camera={camera} dpr={dpr} flat>
      <GlobeScene driverRef={driverRef} tier={tier} />
    </Canvas3D>
  );
}
