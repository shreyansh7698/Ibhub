/**
 * Tiny value-noise fbm → a boolean "is this lat/lon over land" test, used to
 * place the dot-matrix continents on the globe without shipping a texture.
 * Shared by GlobeScene and (later) the other scenes.
 */
function makeNoise(seed = 1) {
  let s = seed >>> 0;
  const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i += 1) p[i] = i;
  for (let i = 255; i > 0; i -= 1) {
    const j = (rand() * (i + 1)) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
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
  return (x, y, oct = 4) => {
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

const land = makeNoise(11);

/** @param {number} latDeg -90..90  @param {number} lonDeg -180..180 */
export function isLand(latDeg, lonDeg) {
  const u = (lonDeg + 180) / 360;
  const v = (latDeg + 90) / 180;
  // poles: mostly ice/land-ish so the dots don't look bald at the caps
  const polar = Math.max(0, Math.abs(v - 0.5) * 2 - 0.82);
  const n = land(u * 6, v * 6) + land(u * 15 + 4, v * 15 + 4) * 0.35;
  return n + polar * 2 > 0.08;
}

/** Convert lat/lon to a unit vector (three.js Y-up, matches DaytimeEarth). */
export function latLonToVec3(latDeg, lonDeg, radius = 1) {
  const phi = (90 - latDeg) * (Math.PI / 180);
  const theta = (lonDeg + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  ];
}
