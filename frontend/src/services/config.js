/**
 * Service-layer configuration.
 *
 * `services/api.js` always talks to the real backend (`httpApi.js`) at
 * `VITE_API_BASE_URL`.
 */
const env = import.meta.env ?? {};

export const API_BASE_URL = env.VITE_API_BASE_URL || '/api';

/** Displayed in a couple of admin screens as a login hint. Not used for auth. */
export const DEMO_ADMIN = {
  email: env.VITE_DEMO_ADMIN_EMAIL || 'admin@theibhub.com',
  password: env.VITE_DEMO_ADMIN_PASSWORD || 'ibhub-demo'
};
