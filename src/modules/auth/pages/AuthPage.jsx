/** Auth page. */

import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";
import { forgotPassword, login, register } from "../../../shared/lib/auth.js";

function ToggleButton({ onClick }) {
  /** Render toggle button. */
  return (
    <button className="toggle" type="button" onClick={onClick} aria-label="Toggle mode">
      ↔
    </button>
  );
}

export default function AuthPage() {
  /** Render auth page. */
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const initialMode = useMemo(() => {
    const mode = (params.get("mode") || "login").toLowerCase();
    return mode === "register" ? "register" : "login";
  }, [params]);

  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  function switchMode(next) {
    /** Switch auth mode. */
    const newMode = next || (mode === "login" ? "register" : "login");
    setMode(newMode);
    setParams({ mode: newMode });
    setError("");
    setMessage("");
  }

  async function handleSubmit(e) {
    /** Handle submit. */
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "login") {
        await login(email.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }

      navigate("/app/analyze");
    } catch (err) {
      setError(err?.message || "Falha na autenticação.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    /** Handle forgot password. */
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await forgotPassword(forgotEmail.trim());
      setMessage(res?.message || "Se o e-mail existir, o link será enviado.");
      setForgotOpen(false);
    } catch (err) {
      setError(err?.message || "Falha ao solicitar redefinição.");
    } finally {
      setLoading(false);
    }
  }

  const isLogin = mode === "login";

  return (
    <AuthLayout>
      <div className="authCard">
        <div className="authCard__left">
          <div className="authCard__badge">{isLogin ? "BEM-VINDO" : "OLÁ"}</div>
          <h2 className="authCard__title">{isLogin ? "Novo Login" : "Novo Cadastro"}</h2>

          <button
            className={`btn ${isLogin ? "btn--accent" : "btn--ghost"}`}
            type="button"
            onClick={() => switchMode(isLogin ? "register" : "login")}
          >
            {isLogin ? "Criar conta" : "Fazer login"}
          </button>
        </div>

        <ToggleButton onClick={() => switchMode()} />

        <div className="authCard__right">
          <div className="authCard__header">{isLogin ? "FAÇA LOGIN" : "CRIE SUA CONTA"}</div>

          <form className="form" onSubmit={handleSubmit}>
            {!isLogin && (
              <label className="field">
                <span>Usuário</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu usuário"
                  autoComplete="username"
                  minLength={3}
                  maxLength={60}
                  required
                />
              </label>
            )}

            <label className="field">
              <span>E-mail</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                type="email"
                autoComplete="email"
                required
              />
            </label>

            <label className="field">
              <span>Senha</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                maxLength={72}
                required
              />
            </label>

            {isLogin && (
              <button
                className="linkBtn"
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotOpen(true);
                }}
              >
                Esqueceu senha?
              </button>
            )}

            {error && <div className="alert alert--error">{error}</div>}
            {message && <div className="alert alert--info">{message}</div>}

            <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
              {loading ? "Aguarde..." : "Entrar"}
            </button>

            <div className="form__hint">
              {isLogin ? (
                <>
                  Não tem conta?{" "}
                  <button className="linkBtn" type="button" onClick={() => switchMode("register")}>
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já tem conta?{" "}
                  <button className="linkBtn" type="button" onClick={() => switchMode("login")}>
                    Entre
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>

      {forgotOpen && (
        <div className="modalBackdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal__title">Recuperar senha</div>
            <form className="form" onSubmit={handleForgotPassword}>
              <label className="field">
                <span>E-mail</span>
                <input
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu@email.com"
                  type="email"
                  required
                />
              </label>

              <div className="modal__actions">
                <button className="btn btn--ghost" type="button" onClick={() => setForgotOpen(false)}>
                  Cancelar
                </button>
                <button className="btn btn--primary" type="submit" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}
