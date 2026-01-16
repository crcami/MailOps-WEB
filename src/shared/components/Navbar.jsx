/** Navbar component. */

import { useNavigate } from "react-router-dom";

export default function Navbar({ variant = "home" }) {
  /** Render navbar. */
  const navigate = useNavigate();

  const isHome = variant === "home";
  const isAuth = variant === "auth";

  return (
    <header className="nav">
      <div
        className="nav__brand"
        role="button"
        tabIndex={0}
        onClick={() => navigate("/")}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate("/");
        }}
      >
        <div className="logoMark">M</div>
        <div className="logoText">MailOps</div>
      </div>

      <div className="nav__actions">
        {isAuth && (
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => navigate("/")}
          >
            Início
          </button>
        )}

        {isHome && (
          <>
            <button
              className="btn btn--ghost"
              type="button"
              onClick={() => navigate("/auth?mode=login")}
            >
              Entrar
            </button>
            <button
              className="btn btn--gradient"
              type="button"
              onClick={() => navigate("/auth?mode=register")}
            >
              Iniciar
            </button>
          </>
        )}
      </div>
    </header>
  );
}
