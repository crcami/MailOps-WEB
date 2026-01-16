import { clearSession, getAuthToken } from "./storage.jsx";

const DEFAULT_BASE_URL = import.meta.env.DEV ? "http://localhost:8000" : "";

function getApiBaseUrl() {
  const raw = String(import.meta.env.VITE_API_BASE_URL || "").trim();
  return raw || DEFAULT_BASE_URL;
}

function getApiKey() {
  return String(import.meta.env.VITE_PUBLIC_API_KEY || "").trim();
}

async function parseErrorMessage(response) {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") return data.detail;
    if (typeof data?.message === "string") return data.message;
    return "Request failed.";
  } catch {
    return "Request failed.";
  }
}

function buildUrl(path) {
  const baseUrl = getApiBaseUrl().replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export async function apiRequest(path, options = {}) {
  const url = buildUrl(path);

  const headers = new Headers(options.headers || {});
  const apiKey = getApiKey();

  if (apiKey) {
    headers.set("X-API-Key", apiKey);
  }

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
  return apiRequest(path, { ...options, method: "GET" });
}

export async function postJson(path, payload, options = {}) {
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
  const headers = new Headers(options.headers || {});
  headers.delete("Content-Type");

  return apiRequest(path, {
    ...options,
    method: "POST",
    headers,
    body: formData,
  });
}
