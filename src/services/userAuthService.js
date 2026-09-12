/**
 * User (applicant) session handling for the demo.
 *
 * Mirrors authService.js's admin session pattern exactly, but under its own
 * sessionStorage key so a logged-in user and a logged-in admin never collide —
 * this frontend supports both being signed in at once, in separate tabs or the
 * same one. Stores ONLY an opaque session token + email/name + expiry, never a
 * password. In production the token is issued and verified by the backend and
 * this module stays the thin client wrapper around it.
 *
 * This file contains NO credential check — that lives in the swappable API
 * layer (mockApi.userLogin/userSignup or httpApi.userLogin/userSignup).
 */
const KEY = 'ibhub.user.session';

export function setUserSession(data) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function getUserSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.expiresAt && new Date(s.expiresAt).getTime() < Date.now()) {
      userLogout();
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export function getUserToken() {
  return getUserSession()?.token || null;
}

export function isUserAuthenticated() {
  return Boolean(getUserSession());
}

export function userLogout() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
