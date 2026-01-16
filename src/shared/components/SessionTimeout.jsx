import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { clearSession, getAuthToken } from "../lib/storage.jsx";
import { getJwtExpMs } from "../lib/jwt.js";

const DEFAULT_IDLE_MINUTES = 15;

function getIdleTimeoutMs() {
  const raw = import.meta.env.VITE_IDLE_TIMEOUT_MINUTES;
  const minutes = Number(raw || DEFAULT_IDLE_MINUTES);
  if (!Number.isFinite(minutes) || minutes <= 0)
    return DEFAULT_IDLE_MINUTES * 60_000;
  return minutes * 60_000;
}

export default function SessionTimeout() {
  const navigate = useNavigate();
  const lastActivityRef = useRef(Date.now());
  const timeoutMs = getIdleTimeoutMs();

  useEffect(() => {
    function touch() {
      lastActivityRef.current = Date.now();
    }

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
    ];
    events.forEach((evt) =>
      window.addEventListener(evt, touch, { passive: true })
    );
    window.addEventListener("focus", touch);
    document.addEventListener("visibilitychange", touch);

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, touch));
      window.removeEventListener("focus", touch);
      document.removeEventListener("visibilitychange", touch);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      const token = getAuthToken();
      if (!token) return;

      const now = Date.now();

      const expMs = getJwtExpMs(token);
      if (expMs && now >= expMs) {
        clearSession();
        navigate(
          "/auth?mode=login&notice=" +
            encodeURIComponent("Sua sessão expirou. Faça login novamente."),
          { replace: true }
        );
        return;
      }

      const idleFor = now - lastActivityRef.current;
      if (idleFor >= timeoutMs) {
        clearSession();
        navigate(
          "/auth?mode=login&notice=" +
            encodeURIComponent("Você ficou inativo e foi desconectado."),
          { replace: true }
        );
      }
    }, 2000);

    return () => window.clearInterval(id);
  }, [navigate, timeoutMs]);

  return null;
}
