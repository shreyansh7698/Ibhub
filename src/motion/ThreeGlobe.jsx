import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { trackRafActivity } from './rafActivity.js';

/**
 * Lightweight WebGL background: a slowly rotating wireframe globe wrapped in a
 * halo of points, drifting toward the pointer. Fills its positioned parent.
 * Purely decorative — skipped for reduced-motion or when WebGL is unavailable.
 */
export default function ThreeGlobe({ className = '', color = '#3f7bff' }) {
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
    const getSize = () => ({
      w: parent.clientWidth || 1,
      h: parent.clientHeight || 1
    });
    let { w, h } = getSize();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    camera.position.z = 4.2;

    const col = new THREE.Color(color);
    const group = new THREE.Group();
    scene.add(group);

    const globe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.4, 2),
      new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.28 })
    );
    group.add(globe);

    const inner = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.0, 1),
      new THREE.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: 0.14 })
    );
    group.add(inner);

    const dotCount = 260;
    const positions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i += 1) {
      const r = 1.7 + Math.random() * 0.5;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(p) * Math.cos(t);
      positions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      positions[i * 3 + 2] = r * Math.cos(p);
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dots = new THREE.Points(
      dotGeo,
      new THREE.PointsMaterial({ color: col, size: 0.035, transparent: true, opacity: 0.6 })
    );
    group.add(dots);

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

    let raf;
    const clock = new THREE.Clock();
    const tick = () => {
      // Clamp dt so a pause (tab hidden / scrolled away) doesn't snap the
      // globe forward by seconds' worth of rotation on resume.
      const dt = Math.min(clock.getDelta(), 0.1);
      group.rotation.y += dt * 0.14;
      group.rotation.x += dt * 0.04;
      group.rotation.y += (pointer.x * 0.35 - group.rotation.y * 0) * 0.0;
      group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, pointer.x * 0.12, 0.04);
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.4, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.y * 0.4, 0.03);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) {
        clock.getDelta(); // drop the idle gap
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // Don't render WebGL while the globe is off-screen or the tab is hidden.
    const untrack = trackRafActivity(parent, (active) => (active ? start() : stop()));

    return () => {
      untrack();
      stop();
      window.removeEventListener('resize', onResize);
      parent.removeEventListener('pointermove', onMove);
      renderer.dispose();
      globe.geometry.dispose();
      globe.material.dispose();
      inner.geometry.dispose();
      inner.material.dispose();
      dotGeo.dispose();
      dots.material.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [reduced, color]);

  return <div ref={mountRef} className={`three-globe ${className}`} aria-hidden="true" />;
}
