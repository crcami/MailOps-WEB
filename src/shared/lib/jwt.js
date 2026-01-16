function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLength);

  try {
    return window.atob(padded);
  } catch {
    return "";
  }
}

export function getJwtExpMs(token) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  const payloadJson = base64UrlDecode(parts[1]);
  if (!payloadJson) return null;

  try {
    const payload = JSON.parse(payloadJson);
    if (typeof payload?.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}
