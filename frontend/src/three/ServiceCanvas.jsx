import Canvas3D from './Canvas3D.jsx';
import ServiceScene from './scenes/ServiceScene.jsx';

/** Lazy entry point for the services showcase 3D stage. */
export default function ServiceCanvas({ slug }) {
  return (
    <Canvas3D
      className="svc__canvas"
      camera={{ position: [0, 0.5, 4.9], fov: 42 }}
      dpr={[1, 1.5]}
      interactive
    >
      <ServiceScene slug={slug} />
    </Canvas3D>
  );
}
