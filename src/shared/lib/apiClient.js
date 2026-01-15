/** API client. */

import { clearSession, getAuthToken } from "./storage.jsx";

const DEFAULT_BASE_URL = "http://localhost:8000";

function getApiBaseUrl() {
  /** Get API base URL. */
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;
}

function getApiKey() {
  /** Get API key. */
  return import.meta.env.VITE_API_KEY || "";
}

async function parseErrorMessage(response) {
  /** Parse API error message. */
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;
    return "Request failed.";
  } catch {
    return "Request failed.";
  }
}

export async function apiRequest(path, options = {}) {
  /** Execute an API request. */
  const baseUrl = getApiBaseUrl().replace(/\/+$/, "");
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers = new Headers(options.headers || {});
  headers.set("X-API-Key", getApiKey());

  if (options.auth === true) {
    const token = getAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body,
  });

  if (response.status === 401 && options.auth === true) {
    clearSession();
  }

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  return response.json();
}

export async function getJson(path, options = {}) {
  /** GET JSON. */
  return apiRequest(path, { ...options, method: "GET" });
}

export async function postJson(path, payload, options = {}) {
  /** POST JSON. */
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  return apiRequest(path, {
    ...options,
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
}

export async function postFormData(path, formData, options = {}) {
  /** POST FormData. */
  return apiRequest(path, {
    ...options,
    method: "POST",
    body: formData,
  });
}
