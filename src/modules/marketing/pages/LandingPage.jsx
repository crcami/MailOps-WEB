/** Landing page. */

import { useNavigate } from "react-router-dom";
import Navbar from "../../../shared/components/Navbar.jsx";

export default function LandingPage() {
  /** Render landing page. */
  const navigate = useNavigate();

  return (
    <div className="page page--marketing">
      <Navbar variant="home" />

      <main className="main main--center">
        <div className="hero">
          <h1 className="hero__title">
            <span className="gradPink">Classifique</span> seus e-mails.
            <br />
            <span className="gradRose">Rápido</span> e{" "}
            <span className="gradOrange">Inteligente</span>.
          </h1>

          <p className="hero__subtitle">
            Produtivo ou improdutivo, com sugestão de resposta automática em
            segundos.
          </p>

          <div className="hero__actions">
            <button
              className="btn btn--gradient btn--lg"
              type="button"
              onClick={() => navigate("/auth?mode=login")}
            >
              Entrar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
