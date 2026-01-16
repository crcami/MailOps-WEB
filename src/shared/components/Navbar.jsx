import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

export default function Navbar({ variant = "home" }) {
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
        <img className="nav__logo" src={logo} alt="MailOps" />
      </div>

      <div className="nav__actions">
        {isAuth && (
          <button
            className="btn btn--outline"
            type="button"
            onClick={() => navigate("/")}
          >
            Início
          </button>
        )}

        {isHome && (
          <>
            <button
              className="btn btn--outline"
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
