/** Navbar component. */

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  /** Render navbar. */
  const navigate = useNavigate();

  return (
    <header className="nav">
      <div className="nav__left" role="button" tabIndex={0} onClick={() => navigate("/")}>
        <div className="logoMark">M</div>
        <div className="logoText">MailOps</div>
      </div>

      <div className="nav__right">
        <button className="btn btn--ghost" onClick={() => navigate("/auth?mode=login")}>
          Entrar
        </button>
        <button className="btn btn--primary" onClick={() => navigate("/auth?mode=register")}>
          Iniciar
        </button>
      </div>
    </header>
  );
}
