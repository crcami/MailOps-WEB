/** Storage helpers. */

const TOKEN_KEY = "mailops.token";
const USER_KEY = "mailops.user";

export function getAuthToken() {
  /** Get auth token. */
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setAuthToken(token) {
  /** Set auth token. */
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken() {
  /** Clear auth token. */
  localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser() {
  /** Get current user. */
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  /** Set current user. */
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  /** Clear current user. */
  localStorage.removeItem(USER_KEY);
}

export function clearSession() {
  /** Clear user session. */
  clearAuthToken();
  clearCurrentUser();
}
