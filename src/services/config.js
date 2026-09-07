/**
 * Service-layer configuration.
 *
 * `USE_MOCK` decides whether `services/api.js` talks to the in-browser mock
 * (`mockApi.js`) or a real backend (`httpApi.js`). Defaults to mock so a fresh
 * clone works with no backend. Flip `VITE_USE_MOCK_API=false` (and set
 * `VITE_API_BASE_URL`) to point at a real API.
 */
const env = import.meta.env ?? {};

export const USE_MOCK = String(env.VITE_USE_MOCK_API ?? 'true') !== 'false';

export const API_BASE_URL = env.VITE_API_BASE_URL || '/api';

/** Demo-only credentials for the mock admin login. Never used against a real backend. */
export const DEMO_ADMIN = {
  email: env.VITE_DEMO_ADMIN_EMAIL || 'admin@theibhub.com',
  password: env.VITE_DEMO_ADMIN_PASSWORD || 'ibhub-demo'
};

/** Simulated network latency for the mock, so loading states are real. */
export const MOCK_LATENCY_MS = 550;
