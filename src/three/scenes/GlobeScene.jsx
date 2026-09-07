import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { latLonToVec3 } from '../landMask.js';
import { hubs, hubRoutes } from '../../data/hubs.js';

import dayUrl from '../../assets/textures/earth_atmos_2048.jpg';
import nightUrl from '../../assets/textures/earth_lights_2048.png';
import cloudUrl from '../../assets/textures/earth_clouds_1024.png';
import specUrl from '../../assets/textures/earth_specular_2048.jpg';

const R = 1.5;
const COL_CORAL = new THREE.Color('#ff6a4d');
const COL_CORAL_SOFT = new THREE.Color('#ff9a80');
// world-space "sun": day side toward the viewer, night crescent on the left
const SUN = new THREE.Vector3(0.62, 0.28, 0.62).normalize();

function makeUniforms() {
  return {
    uTime: { value: 0 },
    uGlow: { value: 1 },
    uActive: { value: new THREE.Vector3(0, 0, 1) },
    uActiveAmt: { value: 0 }
  };
}

/* ---------------- the realistic Earth ---------------- */
function Earth({ u, tier }) {
  const [day, night, clouds, spec] = useLoader(THREE.TextureLoader, [
    dayUrl,
    nightUrl,
    cloudUrl,
    specUrl
  ]);

  useEffect(() => {
    [day, night].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
    });
    clouds.wrapS = THREE.RepeatWrapping;
    clouds.anisotropy = 2;
    spec.anisotropy = 2;
  }, [day, night, clouds, spec]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uDay: { value: day },
          uNight: { value: night },
          uClouds: { value: clouds },
          uSpec: { value: spec },
          uSun: { value: SUN },
          uTime: u.uTime,
          uGlow: u.uGlow,
          uActive: u.uActive,
          uActiveAmt: u.uActiveAmt
        },
        vertexShader: `
          varying vec2 vUv; varying vec3 vWN; varying vec3 vWP; varying vec3 vLocal;
          void main() {
            vUv = uv;
            vLocal = normalize(position);
            vWN = normalize(mat3(modelMatrix) * normal);
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWP = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }`,
        fragmentShader: `
          uniform sampler2D uDay, uNight, uClouds, uSpec;
          uniform vec3 uSun; uniform float uTime; uniform float uGlow;
          uniform vec3 uActive; uniform float uActiveAmt;
          varying vec2 vUv; varying vec3 vWN; varying vec3 vWP; varying vec3 vLocal;
          void main() {
            vec3 V = normalize(cameraPosition - vWP);
            float lam = dot(vWN, uSun);
            float dayAmt = smoothstep(-0.10, 0.32, lam);

            vec3 dayC = texture2D(uDay, vUv).rgb;
            vec3 nightTex = texture2D(uNight, vUv).rgb;
            vec3 lights = max(nightTex - 0.045, 0.0);
            vec3 nightC = vec3(0.006, 0.010, 0.028) + lights * 3.6;
            float ocean = texture2D(uSpec, vUv).r;

            float cloud = texture2D(uClouds, vUv + vec2(uTime * 0.0035, 0.0)).a;

            vec3 surf = mix(nightC, dayC * 1.08, dayAmt);
            surf = mix(surf, mix(vec3(0.02,0.03,0.05), vec3(1.0), dayAmt), cloud * (0.22 + 0.62 * dayAmt));

            // ocean sun-glint on the day side
            vec3 H = normalize(uSun + V);
            float glint = pow(max(dot(vWN, H), 0.0), 55.0) * ocean * dayAmt;
            surf += glint * vec3(1.0, 0.92, 0.75) * 0.6;

            // atmospheric limb scatter (blue) + thin warm terminator band
            float rim = pow(1.0 - max(dot(vWN, V), 0.0), 2.6);
            float term = smoothstep(0.02, 0.22, dayAmt) * (1.0 - smoothstep(0.22, 0.5, dayAmt));
            surf += rim * (vec3(0.20, 0.42, 0.95) * (0.3 + 0.6 * dayAmt) + vec3(1.0, 0.55, 0.38) * term * 0.22);

            // active-hub coral highlight (GlobalNetwork) — subtle
            float act = smoothstep(0.86, 1.0, dot(vLocal, normalize(uActive))) * uActiveAmt;
            surf += act * vec3(1.0, 0.5, 0.4) * 0.14;

            surf *= (0.55 + 0.5 * uGlow);
            gl_FragColor = vec4(surf, 1.0);
          }`
      }),
    [day, night, clouds, spec, u]
  );

  const seg = tier === 'mobile' ? 48 : 64;
  return (
    <mesh material={mat}>
      <sphereGeometry args={[R, seg, seg]} />
    </mesh>
  );
}

/* ---------------- atmosphere glow shell ---------------- */
function Atmosphere({ u }) {
  const inner = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uTime: u.uTime, uGlow: u.uGlow, uColor: { value: new THREE.Color('#4b78d8') } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `
          varying vec3 vN; uniform float uTime; uniform float uGlow; uniform vec3 uColor;
          void main(){
            float f = pow(clamp(0.7 - dot(vN, vec3(0.0,0.0,1.0)), 0.0, 1.0), 2.8);
            float pulse = 0.9 + 0.1 * sin(uTime * 1.0);
            gl_FragColor = vec4(uColor, clamp(f * 0.5 * uGlow * pulse, 0.0, 0.85));
          }`
      }),
    [u]
  );
  const outer = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uColor: { value: new THREE.Color('#2a4a9e') } },
        vertexShader: `varying vec3 vN; void main(){ vN = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
        fragmentShader: `
          varying vec3 vN; uniform vec3 uColor;
          void main(){
            float f = pow(clamp(0.74 - dot(vN, vec3(0.0,0.0,1.0)), 0.0, 1.0), 2.0);
            gl_FragColor = vec4(uColor, clamp(f * 0.22, 0.0, 0.5));
          }`
      }),
    []
  );
  return (
    <group>
      <mesh scale={R * 1.06} material={inner}>
        <sphereGeometry args={[1, 40, 40]} />
      </mesh>
      <mesh scale={R * 1.28} material={outer}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </group>
  );
}

/* ---------------- connection arcs ---------------- */
function Arcs({ driverRef, tier }) {
  const groupRef = useRef(null);
  const travellersRef = useRef([]);

  const routes = useMemo(
    () =>
      hubRoutes.map(([a, b], idx) => {
        const va = new THREE.Vector3(...latLonToVec3(hubs[a].lat, hubs[a].lon, R + 0.006));
        const vb = new THREE.Vector3(...latLonToVec3(hubs[b].lat, hubs[b].lon, R + 0.006));
        const dist = va.distanceTo(vb);
        const mid = va.clone().add(vb).multiplyScalar(0.5).setLength(R + 0.12 + dist * 0.4);
        const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
        const SEG = 46;
        const positions = new Float32Array((SEG + 1) * 3);
        curve.getPoints(SEG).forEach((v, i) => {
          positions[i * 3] = v.x;
          positions[i * 3 + 1] = v.y;
          positions[i * 3 + 2] = v.z;
        });
        return { idx, curve, positions, seg: SEG, stagger: idx / hubRoutes.length };
      }),
    []
  );

  const scratch = useRef(new THREE.Vector3());
  const lastProg = useRef(-1);

  useFrame((state) => {
    const d = driverRef.current;
    const t = state.clock.elapsedTime;
    const progChanged = Math.abs(d.arcProgress - lastProg.current) > 0.001;
    lastProg.current = d.arcProgress;
    for (let i = 0; i < routes.length; i += 1) {
      const route = routes[i];
      const local = THREE.MathUtils.clamp((d.arcProgress - route.stagger * 0.5) / 0.5, 0, 1);
      const wrapper = groupRef.current?.children[i];
      const line = wrapper?.children[0];
      if (progChanged && line?.geometry) {
        line.geometry.setDrawRange(0, Math.ceil(local * (route.seg + 1)));
        line.material.opacity = local * 0.6;
      }
      const trav = travellersRef.current[i];
      if (trav) {
        const on = local > 0.98 && tier !== 'mobile';
        if (trav.visible !== on) trav.visible = on;
        if (on) {
          route.curve.getPoint((t * 0.17 + route.stagger) % 1, scratch.current);
          trav.position.copy(scratch.current);
          trav.scale.setScalar(0.7 + 0.3 * Math.sin(t * 6 + i));
        }
      }
    }
  });

  return (
    <group ref={groupRef}>
      {routes.map((route) => (
        <group key={route.idx}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={route.seg + 1}
                array={route.positions}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={COL_CORAL}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
          <group
            ref={(el) => {
              if (el) travellersRef.current[route.idx] = el;
            }}
            visible={false}
          >
            <mesh>
              <sphereGeometry args={[0.016, 10, 10]} />
              <meshBasicMaterial color="#fff2ec" toneMapped={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial
                color={COL_CORAL_SOFT}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

/* ---------------- location markers ---------------- */
function Markers({ driverRef }) {
  const groupRef = useRef(null);
  const marks = useMemo(
    () =>
      hubs.map((h) => {
        const pos = new THREE.Vector3(...latLonToVec3(h.lat, h.lon, R + 0.012));
        const q = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          pos.clone().normalize()
        );
        return { pos, quat: [q.x, q.y, q.z, q.w], key: h.key };
      }),
    []
  );

  const prevActive = useRef(-2);
  useFrame((state) => {
    const active = driverRef.current.activeIndex;
    const kids = groupRef.current?.children;
    if (!kids) return;
    if (active !== prevActive.current) {
      const old = kids[prevActive.current];
      if (old) {
        old.scale.setScalar(1);
        if (old.children[0]) old.children[0].material.opacity = 0.85;
        if (old.children[1]) old.children[1].material.opacity = 0;
      }
      prevActive.current = active;
    }
    if (active < 0 || active >= kids.length) return;
    const t = state.clock.elapsedTime;
    const child = kids[active];
    child.scale.setScalar(1 + Math.sin(t * 4) * 0.32);
    if (child.children[0]) child.children[0].material.opacity = 1;
    if (child.children[1]) {
      const s = Math.sin(t * 3) * 0.5 + 0.5;
      child.children[1].material.opacity = 0.6 - s * 0.5;
      child.children[1].scale.setScalar(1 + s * 2.0);
    }
  });

  return (
    <group ref={groupRef}>
      {marks.map((m) => (
        <group key={m.key} position={m.pos}>
          <mesh>
            <sphereGeometry args={[0.017, 12, 12]} />
            <meshBasicMaterial color={COL_CORAL} transparent opacity={0.85} toneMapped={false} />
          </mesh>
          <mesh quaternion={m.quat}>
            <ringGeometry args={[0.03, 0.04, 28]} />
            <meshBasicMaterial
              color={COL_CORAL}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ---------------- orbital ring + satellite ---------------- */
function Orbit({ tier }) {
  const satRef = useRef(null);
  const groupRef = useRef(null);
  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += delta * 0.04;
    if (satRef.current) {
      const t = state.clock.elapsedTime * 0.55;
      satRef.current.position.set(Math.cos(t) * R * 1.68, Math.sin(t) * R * 1.68, 0);
    }
  });
  if (tier === 'mobile') return null;
  return (
    <group ref={groupRef} rotation={[Math.PI / 2.3, 0.35, 0]}>
      <mesh>
        <torusGeometry args={[R * 1.68, 0.0035, 6, 128]} />
        <meshBasicMaterial
          color={COL_CORAL}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={satRef}>
        <sphereGeometry args={[0.018, 10, 10]} />
        <meshBasicMaterial color={COL_CORAL_SOFT} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------------- star dust ---------------- */
function Stars({ count }) {
  const geo = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 8 + Math.random() * 6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th);
      arr[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      arr[i * 3 + 2] = r * Math.cos(ph);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.03} color="#aebedd" transparent opacity={0.7} sizeAttenuation={false} />
    </points>
  );
}

/* ================= scene root ================= */
export default function GlobeScene({ driverRef, tier = 'full' }) {
  const globeRef = useRef(null); // position + bloom + mouse-driven rotation
  const spinRef = useRef(null); // auto-spin OR hub-facing + base tilt
  const u = useMemo(makeUniforms, []);
  const activeDir = useRef(new THREE.Vector3(0, 0, 1));
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const localDriver = useRef({
    spin: 0.045,
    camZ: 6.1,
    offsetX: 0.9,
    offsetY: 0,
    tilt: -0.28,
    arcProgress: 0,
    glow: 1,
    activeIndex: -1,
    pointerParallax: 1,
    bloom: 1
  });
  const driver = driverRef ?? localDriver;

  // Track the pointer at the window level — the canvas has pointer-events:none,
  // so R3F's own state.pointer never updates.
  useEffect(() => {
    if (tier === 'mobile') return undefined;
    const onMove = (e) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [tier]);

  useFrame((state, delta) => {
    const d = driver.current;
    const t = state.clock.elapsedTime;

    u.uTime.value = t;
    u.uGlow.value = THREE.MathUtils.lerp(u.uGlow.value, d.glow ?? 1, 0.05);
    const ai = d.activeIndex;
    if (ai >= 0 && ai < hubs.length) {
      activeDir.current.set(...latLonToVec3(hubs[ai].lat, hubs[ai].lon, 1)).normalize();
      u.uActive.value.copy(activeDir.current);
      u.uActiveAmt.value = THREE.MathUtils.lerp(u.uActiveAmt.value, 1, 0.08);
    } else {
      u.uActiveAmt.value = THREE.MathUtils.lerp(u.uActiveAmt.value, 0, 0.08);
    }

    // ease the pointer
    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.06;
    m.y += (m.ty - m.y) * 0.06;

    // inner group: continuous spin, or turn to face a hub, + base tilt
    const s = spinRef.current;
    if (s) {
      if (d.targetRotY != null) {
        let dy = d.targetRotY - s.rotation.y;
        dy = ((dy + Math.PI) % (Math.PI * 2)) - Math.PI;
        s.rotation.y += dy * 0.07;
      } else {
        s.rotation.y += delta * d.spin;
      }
      s.rotation.x = THREE.MathUtils.lerp(s.rotation.x, d.targetRotX ?? d.tilt, 0.06);
    }

    // outer group: position, bloom, and the mouse "grab and turn the Earth" feel
    const g = globeRef.current;
    if (g) {
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x || 0.001, d.bloom ?? 1, 0.08));
      g.position.x = THREE.MathUtils.lerp(g.position.x, d.offsetX, 0.06);
      g.position.y = THREE.MathUtils.lerp(g.position.y, d.offsetY, 0.06);
      const pp = d.pointerParallax ?? 1;
      g.rotation.y = m.x * 0.4 * pp;
      g.rotation.x = -m.y * 0.26 * pp;
      g.rotation.z = m.x * 0.04 * pp;
    }

    // a touch of camera counter-move for parallax depth
    const pp = d.pointerParallax ?? 1;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, -m.x * 0.18 * pp, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, m.y * 0.14 * pp, 0.05);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, d.camZ, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      {tier !== 'mobile' && <Stars count={260} />}

      <group ref={globeRef}>
        <group ref={spinRef}>
          <Earth u={u} tier={tier} />
          <Atmosphere u={u} />
          <Markers driverRef={driver} />
          <Arcs driverRef={driver} tier={tier} />
        </group>
        <Orbit tier={tier} />
      </group>
    </>
  );
}
