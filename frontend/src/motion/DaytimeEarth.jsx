import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { trackRafActivity } from './rafActivity.js';

/* ---------- tiny value-noise fbm (no deps) ---------- */
function makeNoise(seed = 1) {
  const perm = new Uint8Array(512);
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) p[i] = i;
  for (let i = 255; i > 0; i -= 1) {
    const j = (rand() * (i + 1)) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i += 1) perm[i] = p[i & 255];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  const grad = (h, x, y) => ((h & 1 ? -x : x) + (h & 2 ? -y : y));
  const noise2 = (x, y) => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = fade(xf);
    const v = fade(yf);
    const aa = perm[perm[xi] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const ba = perm[perm[xi + 1] + yi];
    const bb = perm[perm[xi + 1] + yi + 1];
    return lerp(
      lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u),
      lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u),
      v
    );
  };
  return (x, y, oct = 5) => {
    let amp = 1;
    let freq = 1;
    let sum = 0;
    let norm = 0;
    for (let o = 0; o < oct; o += 1) {
      sum += amp * noise2(x * freq, y * freq);
      norm += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return sum / norm;
  };
}

/* Build an equirectangular Earth texture + matching cloud alpha map. */
function buildTextures() {
  const W = 1024;
  const H = 512;
  const earth = document.createElement('canvas');
  earth.width = W;
  earth.height = H;
  const clouds = document.createElement('canvas');
  clouds.width = W;
  clouds.height = H;
  const ec = earth.getContext('2d');
  const cc = clouds.getContext('2d');
  const land = makeNoise(7);
  const cloud = makeNoise(42);

  const eImg = ec.createImageData(W, H);
  const cImg = cc.createImageData(W, H);
  for (let y = 0; y < H; y += 1) {
    // latitude 0..1 -> weight so continents cluster and poles ice over
    const lat = y / H;
    const polar = Math.max(0, Math.abs(lat - 0.5) * 2 - 0.78) / 0.22;
    for (let x = 0; x < W; x += 1) {
      const i = (y * W + x) * 4;
      const nx = x / W;
      const e = land(nx * 6, lat * 6);
      const detail = land(nx * 18 + 5, lat * 18 + 5) * 0.35;
      const h = e + detail;
      let r;
      let g;
      let b;
      if (h > 0.06) {
        // land — greener low, arid mid, rock high
        const t = Math.min(1, (h - 0.06) * 3);
        r = 96 + t * 120;
        g = 150 + t * 40;
        b = 92 + t * 30;
        if (h > 0.34) {
          r = 150;
          g = 140;
          b = 120;
        }
      } else {
        // ocean — deep to shallow near coast
        const d = Math.min(1, (0.06 - h) * 4);
        r = 18 + (1 - d) * 40;
        g = 78 + (1 - d) * 70;
        b = 140 + (1 - d) * 60;
      }
      if (polar > 0) {
        const t = Math.min(1, polar);
        r = r + (245 - r) * t;
        g = g + (250 - g) * t;
        b = b + (255 - b) * t;
      }
      eImg.data[i] = r;
      eImg.data[i + 1] = g;
      eImg.data[i + 2] = b;
      eImg.data[i + 3] = 255;

      // clouds: banded fbm, thinner at equator, alpha only
      const cv = cloud(nx * 4, lat * 8) + cloud(nx * 11 + 3, lat * 11 + 3) * 0.4;
      const band = 0.55 + 0.45 * Math.sin(lat * Math.PI * 5);
      const a = Math.max(0, cv * band - 0.18) * 255;
      cImg.data[i] = 255;
      cImg.data[i + 1] = 255;
      cImg.data[i + 2] = 255;
      cImg.data[i + 3] = Math.min(235, a);
    }
  }
  ec.putImageData(eImg, 0, 0);
  cc.putImageData(cImg, 0, 0);

  const earthTex = new THREE.CanvasTexture(earth);
  const cloudTex = new THREE.CanvasTexture(clouds);
  earthTex.colorSpace = THREE.SRGBColorSpace;
  return { earthTex, cloudTex };
}

/**
 * Cinematic "daytime Earth from space": procedurally textured globe, a drifting
 * cloud shell, a bright Fresnel atmosphere and a few glowing trade-route arcs
 * between financial hubs. Fills its positioned parent. Skipped for
 * reduced-motion / no-WebGL.
 */
export default function DaytimeEarth({ className = '', tint = '#bfe0ff', arcColor = '#ffd8a0' }) {
  const mountRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return undefined;
    }

    const parent = mount;
    const getSize = () => ({ w: parent.clientWidth || 1, h: parent.clientHeight || 1 });
    let { w, h } = getSize();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.z = 5.2;

    const root = new THREE.Group();
    root.rotation.z = THREE.MathUtils.degToRad(-18);
    scene.add(root);

    const spin = new THREE.Group();
    root.add(spin);

    const R = 1.5;
    const { earthTex, cloudTex } = buildTextures();

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(R, 64, 64),
      new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.92, metalness: 0.02 })
    );
    spin.add(earth);

    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.012, 48, 48),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        alphaMap: cloudTex,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        roughness: 1
      })
    );
    spin.add(clouds);

    // Fresnel atmosphere
    const atmoCol = new THREE.Color(tint);
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.16, 48, 48),
      new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uColor: { value: atmoCol } },
        vertexShader: `
          varying vec3 vN;
          void main() {
            vN = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vN;
          uniform vec3 uColor;
          void main() {
            float i = pow(0.72 - dot(vN, vec3(0.0, 0.0, 1.0)), 2.4);
            gl_FragColor = vec4(uColor, i);
          }
        `
      })
    );
    root.add(atmosphere);

    // ---- trade-route arcs ----
    const hubs = [
      [40.7, -74.0], // New York
      [51.5, -0.12], // London
      [25.2, 55.27], // Dubai
      [1.35, 103.82], // Singapore
      [22.32, 114.17], // Hong Kong
      [-33.87, 151.2], // Sydney
      [35.68, 139.7], // Tokyo
      [19.08, 72.88] // Mumbai
    ];
    const toVec = ([latDeg, lonDeg], radius) => {
      const phi = (90 - latDeg) * (Math.PI / 180);
      const theta = (lonDeg + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    const arcGroup = new THREE.Group();
    spin.add(arcGroup);
    const travellers = [];
    const routes = [
      [0, 1], [1, 2], [2, 3], [3, 4], [1, 6], [0, 7], [2, 5]
    ];
    const arcMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(arcColor),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    routes.forEach(([a, b]) => {
      const va = toVec(hubs[a], R + 0.01);
      const vb = toVec(hubs[b], R + 0.01);
      const dist = va.distanceTo(vb);
      const mid = va.clone().add(vb).multiplyScalar(0.5).setLength(R + 0.18 + dist * 0.35);
      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb);
      const pts = curve.getPoints(50);
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), arcMat);
      arcGroup.add(line);

      const dotGeo = new THREE.SphereGeometry(0.022, 8, 8);
      const dotMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(arcColor),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const dot = new THREE.Mesh(dotGeo, dotMat);
      arcGroup.add(dot);
      travellers.push({ curve, dot, offset: Math.random(), speed: 0.12 + Math.random() * 0.12 });

      [va, vb].forEach((v) => {
        const pin = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 8), dotMat);
        pin.position.copy(v);
        arcGroup.add(pin);
      });
    });

    // ---- lights ----
    const sun = new THREE.DirectionalLight(0xfff2df, 2.1);
    sun.position.set(4, 2.4, 3.5);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0x8fb6e8, 0.5));
    const rim = new THREE.DirectionalLight(0x9ec6ff, 0.5);
    rim.position.set(-4, -1, -2);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      const rect = parent.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    parent.addEventListener('pointermove', onMove);

    const onResize = () => {
      ({ w, h } = getSize());
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const tmp = new THREE.Vector3();
    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.1);
      spin.rotation.y += dt * 0.045;
      clouds.rotation.y += dt * 0.018;
      arcGroup.rotation.y -= dt * 0.018; // hold arcs against the cloud drift
      root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -pointer.y * 0.18, 0.04);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.5, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.y * 0.5, 0.03);
      camera.lookAt(0, 0, 0);
      travellers.forEach((t) => {
        t.offset = (t.offset + dt * t.speed) % 1;
        t.curve.getPoint(t.offset, tmp);
        t.dot.position.copy(tmp);
      });
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) {
        clock.getDelta();
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const untrack = trackRafActivity(parent, (active) => (active ? start() : stop()));

    return () => {
      untrack();
      stop();
      window.removeEventListener('resize', onResize);
      parent.removeEventListener('pointermove', onMove);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      earthTex.dispose();
      cloudTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [reduced, tint, arcColor]);

  return <div ref={mountRef} className={`three-globe daytime-earth ${className}`} aria-hidden="true" />;
}
