/** Landing page. */

import { useNavigate } from "react-router-dom";
import MarketingLayout from "../../../app/layouts/MarketingLayout.jsx";

export default function LandingPage() {
  /** Render landing page. */
  const navigate = useNavigate();

  return (
    <MarketingLayout>
      <section className="hero">
        <h1 className="hero__title">
          <span className="grad grad--pink">Classifique</span> seus e-mails.
          <br />
          <span className="grad grad--blue">Rápido</span> e{" "}
          <span className="grad grad--green">Inteligente</span>.
        </h1>

        <p className="hero__subtitle">
          Produtivo ou improdutivo, com sugestão de resposta automática em segundos.
        </p>

        <div className="hero__actions">
          <button className="btn btn--primary btn--lg" onClick={() => navigate("/auth?mode=login")}>
            Entrar
          </button>
        </div>
      </section>
    </MarketingLayout>
  );
}
