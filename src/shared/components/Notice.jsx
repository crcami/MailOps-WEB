import { useEffect } from "react";

export default function Notice({ variant = "info", message, onClose }) {
  useEffect(() => {
    if (!message) return undefined;
    if (typeof onClose !== "function") return undefined;

    const id = window.setTimeout(() => onClose(), 4000);
    return () => window.clearTimeout(id);
  }, [message, onClose]);

  if (!message) return null;

  const title =
    variant === "error" ? "Erro" : variant === "success" ? "Sucesso" : "Aviso";

  return (
    <div className="noticeStack" role="alert" aria-live="polite">
      <div className={`notice notice--${variant}`}>
        <div className="notice__icon" aria-hidden="true">
          {variant === "error" ? (
            <ErrorIcon />
          ) : variant === "success" ? (
            <SuccessIcon />
          ) : (
            <InfoIcon />
          )}
        </div>

        <div className="notice__content">
          <div className="notice__title">{title}</div>
          <div className="notice__message">{message}</div>
        </div>

        <button
          className="notice__close"
          type="button"
          onClick={onClose}
          aria-label="Close notice"
          title="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m1 14h-2v-2h2Zm0-4h-2V6h2Z"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9Z"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m1 15h-2v-6h2Zm0-8h-2V7h2Z"
      />
    </svg>
  );
}
