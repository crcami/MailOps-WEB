/** Auth service. */

import { getJson, postJson } from "./apiClient.js";
import { setAuthToken, setCurrentUser } from "./storage.jsx";

export async function login(email, password) {
  /** Login user. */
  const token = await postJson("/api/auth/login", { email, password });
  setAuthToken(token.access_token);

  const me = await safeFetchMe();
  if (me) setCurrentUser(me);

  return token;
}

export async function register(username, email, password) {
  /** Register user. */
  const token = await postJson("/api/auth/register", { username, email, password });
  setAuthToken(token.access_token);

  const me = await safeFetchMe({ fallbackUsername: username, fallbackEmail: email });
  if (me) setCurrentUser(me);

  return token;
}

export async function forgotPassword(email) {
  /** Request password reset. */
  return postJson("/api/auth/forgot-password", { email });
}

export async function resetPassword(token, newPassword) {
  /** Reset password. */
  return postJson("/api/auth/reset-password", { token, new_password: newPassword });
}

export async function safeFetchMe(fallback = {}) {
  /** Fetch current user if endpoint exists. */
  try {
    const me = await getJson("/api/auth/me", { auth: true });
    return me;
  } catch (err) {
    const fallbackUsername =
      fallback.fallbackUsername || (fallback.fallbackEmail || "").split("@")[0] || "Usuário";

    return {
      id: 0,
      username: fallbackUsername,
      email: fallback.fallbackEmail || "",
    };
  }
}
