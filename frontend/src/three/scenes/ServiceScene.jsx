import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* Shared premium material palette */
const bodyProps = { color: '#3a4466', roughness: 0.42, metalness: 0.35 };
const lightProps = { color: '#e9eefc', roughness: 0.5, metalness: 0.2 };
const CORAL = '#ff6a4d';

function Coral(props) {
  return <meshStandardMaterial color={CORAL} emissive={CORAL} emissiveIntensity={1.4} toneMapped={false} {...props} />;
}

/* ---------------- per-service objects ---------------- */
function Building() {
  return (
    <group position={[0, -0.35, 0]}>
      <mesh position={[0, -0.55, 0]} castShadow>
        <boxGeometry args={[1.1, 0.9, 1.1]} />
        <meshStandardMaterial {...bodyProps} />
      </mesh>
      <mesh position={[0.08, 0.15, 0.08]} castShadow>
        <boxGeometry args={[0.8, 1.1, 0.8]} />
        <meshStandardMaterial {...lightProps} />
      </mesh>
      <mesh position={[0.16, 0.85, 0.16]} castShadow>
        <boxGeometry args={[0.5, 0.9, 0.5]} />
        <meshStandardMaterial {...bodyProps} />
      </mesh>
      <mesh position={[0.16, 1.42, 0.16]}>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <Coral />
      </mesh>
      <mesh position={[0.16, 1.6, 0.16]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <Coral emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

function Card() {
  return (
    <group rotation={[0.35, 0, 0.12]}>
      <mesh castShadow>
        <boxGeometry args={[1.7, 1.08, 0.06]} />
        <meshStandardMaterial color="#2f3a5a" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[-0.5, 0.18, 0.045]}>
        <boxGeometry args={[0.32, 0.24, 0.02]} />
        <Coral emissiveIntensity={1.1} />
      </mesh>
      <mesh position={[0.2, -0.28, 0.045]}>
        <boxGeometry args={[0.9, 0.12, 0.01]} />
        <meshStandardMaterial {...lightProps} />
      </mesh>
      <mesh position={[0.9, 0.55, 0.4]}>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 32]} />
        <meshStandardMaterial color="#e6b980" roughness={0.35} metalness={0.7} />
      </mesh>
    </group>
  );
}

function Chart() {
  const bars = [0.5, 0.9, 1.35, 0.75];
  return (
    <group position={[0, -0.45, 0]}>
      <mesh position={[0, -0.06, -0.3]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[2, 1.5, 0.04]} />
        <meshStandardMaterial color="#2c3554" roughness={0.4} metalness={0.3} />
      </mesh>
      {bars.map((h, i) => (
        <mesh key={i} position={[-0.72 + i * 0.48, h / 2, 0.1]}>
          <boxGeometry args={[0.32, h, 0.32]} />
          {i === 2 ? <Coral emissiveIntensity={1} /> : <meshStandardMaterial {...lightProps} />}
        </mesh>
      ))}
    </group>
  );
}

function Passport() {
  const planeRef = useRef(null);
  useFrame((state) => {
    if (planeRef.current) {
      const t = state.clock.elapsedTime;
      planeRef.current.position.set(Math.cos(t * 0.9) * 1.15, 0.5 + Math.sin(t * 1.4) * 0.18, Math.sin(t * 0.9) * 1.15);
      planeRef.current.rotation.y = -t * 0.9 + Math.PI / 2;
    }
  });
  return (
    <group>
      <group rotation={[0.5, 0.4, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 1.5, 0.16]} />
          <meshStandardMaterial color="#3a2f66" roughness={0.45} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0.09]}>
          <circleGeometry args={[0.3, 32]} />
          <Coral emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0, -0.35, 0.09]}>
          <boxGeometry args={[0.7, 0.08, 0.01]} />
          <meshStandardMaterial {...lightProps} />
        </mesh>
      </group>
      <group ref={planeRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.12, 0.4, 4]} />
          <Coral emissiveIntensity={1.6} />
        </mesh>
      </group>
    </group>
  );
}

function Pin() {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = 0.15 + Math.sin(state.clock.elapsedTime * 1.6) * 0.12;
  });
  return (
    <group>
      <group ref={ref}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial {...bodyProps} />
        </mesh>
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.5, 0.9, 32]} />
          <meshStandardMaterial {...bodyProps} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <Coral emissiveIntensity={1.6} />
        </mesh>
      </group>
      <mesh position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.62, 40]} />
        <meshStandardMaterial color={CORAL} emissive={CORAL} emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

function Shield() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.15);
    s.lineTo(0.95, 0.78);
    s.lineTo(0.95, -0.1);
    s.quadraticCurveTo(0.95, -0.85, 0, -1.35);
    s.quadraticCurveTo(-0.95, -0.85, -0.95, -0.1);
    s.lineTo(-0.95, 0.78);
    s.lineTo(0, 1.15);
    return s;
  }, []);
  return (
    <group scale={0.92}>
      <mesh castShadow>
        <extrudeGeometry
          args={[shape, { depth: 0.28, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 }]}
        />
        <meshStandardMaterial color="#303c5e" roughness={0.32} metalness={0.55} />
      </mesh>
      {/* inset face */}
      <mesh position={[0, -0.05, 0.3]} scale={0.78}>
        <extrudeGeometry args={[shape, { depth: 0.02, bevelEnabled: false }]} />
        <meshStandardMaterial color="#1c2540" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* check mark */}
      <mesh position={[-0.16, -0.05, 0.36]} rotation={[0, 0, -0.72]}>
        <boxGeometry args={[0.2, 0.46, 0.08]} />
        <Coral />
      </mesh>
      <mesh position={[0.16, 0.12, 0.36]} rotation={[0, 0, 0.72]}>
        <boxGeometry args={[0.2, 0.92, 0.08]} />
        <Coral />
      </mesh>
    </group>
  );
}

const OBJECTS = [
  ['company-formation', Building],
  ['bank-account-assistance', Card],
  ['accounting-tax', Chart],
  ['visa-immigration', Passport],
  ['virtual-office', Pin],
  ['corporate-compliance', Shield]
];

/* All objects stay mounted (geometry built once); only the active one is shown
   and animated. Avoids the per-scroll remount hitch of ExtrudeGeometry etc. */
function ServiceObjects({ activeSlug }) {
  const groups = useRef({});
  const enter = useRef({});

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const px = state.pointer.x;
    const py = state.pointer.y;
    for (let i = 0; i < OBJECTS.length; i += 1) {
      const slug = OBJECTS[i][0];
      const g = groups.current[slug];
      if (!g) continue;
      const target = slug === activeSlug ? 1 : 0;
      const cur = enter.current[slug] ?? 0;
      // leave faster than you arrive, so two objects never linger together
      const ne = cur + (target - cur) * Math.min(1, delta * (target > cur ? 5.5 : 11));
      enter.current[slug] = ne;
      const on = ne > 0.015;
      if (g.visible !== on) g.visible = on;
      if (!on) continue;
      const eased = ne * ne * (3 - 2 * ne);
      g.scale.setScalar(eased * 0.92);
      g.rotation.y = (1 - eased) * -1.0 + t * 0.3;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, py * 0.22 + 0.05, 0.06);
      g.position.y = (1 - eased) * -0.5 + 0.05 + Math.sin(t * 1.1) * 0.06;
      g.position.x = THREE.MathUtils.lerp(g.position.x, px * 0.18, 0.06);
    }
  });

  return (
    <>
      {OBJECTS.map(([slug, Obj]) => (
        <group
          key={slug}
          ref={(el) => {
            groups.current[slug] = el;
          }}
          visible={false}
        >
          <Obj />
        </group>
      ))}
    </>
  );
}

/* ---------------- cursor-follow light ---------------- */
function CursorLight() {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.pointer.x * 4, 0.08);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, state.pointer.y * 3 + 1, 0.08);
    }
  });
  return <pointLight ref={ref} position={[2, 2, 3]} intensity={30} color="#ffdccf" distance={12} decay={2} />;
}

export default function ServiceScene({ slug }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff4ec" />
      <directionalLight position={[-4, 1, -2]} intensity={0.8} color="#5b7fd6" />
      <pointLight position={[-2, -1, -3]} intensity={12} color={CORAL} distance={14} decay={2} />
      <CursorLight />
      <ServiceObjects activeSlug={slug} />
    </>
  );
}
