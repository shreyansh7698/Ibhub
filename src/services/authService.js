/**
 * Admin session handling for the demo.
 *
 * Stores ONLY an opaque session token + email + expiry in sessionStorage
 * (`ibhub.admin.session`) — never a password, never document data. In production
 * the token is issued and verified by the backend / an auth provider and this
 * module is the thin client wrapper around it.
 *
 * This file contains NO credential check — that lives in the swappable API layer
 * (mockApi.adminLogin / httpApi.adminLogin).
 */
const KEY = 'ibhub.admin.session';

export function setSession(data) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function getSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.expiresAt && new Date(s.expiresAt).getTime() < Date.now()) {
      logout();
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function getToken() {
  return getSession()?.token || null;
}

export function isAuthenticated() {
  return Boolean(getSession());
}

export function logout() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
