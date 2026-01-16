import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";
import Notice from "../../../shared/components/Notice.jsx";
import { forgotPassword, login, register } from "../../../shared/lib/auth.js";

function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7m0 12a5 5 0 1 1 5-5a5 5 0 0 1-5 5m0-8a3 3 0 1 0 3 3a3 3 0 0 0-3-3"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2.3 3.7 3.7 2.3l18 18-1.4 1.4-3.2-3.2A10.9 10.9 0 0 1 12 19c-7 0-10-7-10-7a18 18 0 0 1 5.3-6.2ZM12 7c7 0 10 7 10 7a18.3 18.3 0 0 1-3.4 4.7l-2-2A5 5 0 0 0 9.3 9.4l-2-2A10.8 10.8 0 0 1 12 7Zm0 10a5 5 0 0 0 1.6-.3l-1.2-1.2a3 3 0 0 1-3.9-3.9L7.3 10.4A5 5 0 0 0 12 17Z"
      />
    </svg>
  );
}

function isPasswordStrong(value) {
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasDigit = /\d/.test(value);
  return value.length >= 8 && hasUpper && hasLower && hasDigit;
}

function mapAuthError(err, isLogin) {
  const status = err?.status;

  if (isLogin && status === 401) {
    return "E-mail ou senha incorretos. Verifique seus dados e tente novamente.";
  }

  if (!isLogin && status === 409) {
    return "Usuário já existe. Use outro e-mail ou faça login.";
  }

  return err?.message || "Falha na autenticação.";
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const initialMode = useMemo(() => {
    const mode = (params.get("mode") || "login").toLowerCase();
    return mode === "register" ? "register" : "login";
  }, [params]);

  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [notice, setNotice] = useState(null);

  const isLogin = mode === "login";

  useEffect(() => {
    if (!notice) return undefined;

    const t = window.setTimeout(() => setNotice(null), 6500);
    return () => window.clearTimeout(t);
  }, [notice]);

  useEffect(() => {
    const noticeMsg = params.get("notice");
    const modeParam = (params.get("mode") || "login").toLowerCase();

    if (!noticeMsg) return;
    if (modeParam !== "login") return;

    setNotice({ variant: "success", message: noticeMsg });

    const nextParams = new URLSearchParams(params);
    nextParams.delete("notice");
    setParams(nextParams, { replace: true });
  }, [params, setParams]);

  function showNotice(variant, message) {
    setNotice({ variant, message });
  }

  function switchMode(next) {
    const newMode = next || (isLogin ? "register" : "login");
    setMode(newMode);
    setParams({ mode: newMode });

    setNotice(null);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  function validateBeforeSubmit() {
    if (!email.trim()) return "Informe um e-mail válido.";
    if (!password) return "Informe sua senha.";

    if (!isLogin) {
      if (!username.trim()) return "Informe seu nome.";
      if (!isPasswordStrong(password)) {
        return "Senha inválida: mínimo 8 caracteres, incluindo maiúscula, minúscula, caractere especial e número.";
      }
      if (password !== confirmPassword) return "As senhas não coincidem.";
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setNotice(null);

    const validationError = validateBeforeSubmit();
    if (validationError) {
      showNotice("error", validationError);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }

      navigate("/app/analyze");
    } catch (err) {
      showNotice("error", mapAuthError(err, isLogin));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setNotice(null);

    if (!forgotEmail.trim()) {
      showNotice("error", "Informe um e-mail válido.");
      return;
    }

    setLoading(true);

    try {
      const res = await forgotPassword(forgotEmail.trim());
      showNotice(
        "success",
        res?.message || "Se o e-mail existir, o link será enviado."
      );
      setForgotOpen(false);
    } catch (err) {
      showNotice("error", err?.message || "Falha ao solicitar redefinição.");
    } finally {
      setLoading(false);
    }
  }

  const leftTitle = isLogin ? "Faça login" : "Inscreva-se";
  const leftButtonText = isLogin ? "Criar conta" : "Fazer login";
  const rightHeader = isLogin ? "FAÇA LOGIN" : "CADASTRE-SE";
  const submitText = isLogin ? "Entrar" : "Cadastrar";

  return (
    <AuthLayout>
      <Notice
        variant={notice?.variant}
        message={notice?.message}
        onClose={() => setNotice(null)}
      />

      <div className="authCard">
        <div className="authCard__left">
          <div className="authCard__badge">BEM-VINDO</div>
          <h2 className="authCard__title">{leftTitle}</h2>

          <button
            className="btn btn--gradient"
            type="button"
            onClick={() => switchMode(isLogin ? "register" : "login")}
          >
            {leftButtonText}
          </button>
        </div>

        <div className="authCard__right">
          <div className="authCard__header">{rightHeader}</div>

          <form className="form" onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <label className="field">
                <span>Nome completo</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu nome"
                  autoComplete="username"
                  maxLength={60}
                />
              </label>
            )}

            <label className="field">
              <span>E-mail</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                type="email"
                autoComplete="email"
              />
            </label>

            <label className="field">
              <span>Senha</span>
              <div className="passwordField">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "Sua senha" : "Crie uma senha"}
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  maxLength={72}
                />

                <button
                  className="eyeBtn"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {!isLogin && (
                <div className="passwordHint">
                  Mínimo 8 caracteres, incluindo maiúscula, minúscula, caractere
                  especial e número.
                </div>
              )}
            </label>

            {!isLogin && (
              <label className="field">
                <span>Confirmar senha</span>
                <div className="passwordField">
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a senha"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    maxLength={72}
                  />

                  <button
                    className="eyeBtn"
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    <EyeIcon open={showConfirmPassword} />
                  </button>
                </div>
              </label>
            )}

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

            <button
              className="btn btn--primary btn--full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Aguarde..." : submitText}
            </button>

            <div className="form__hint">
              {isLogin ? (
                <>
                  Não tem conta?{" "}
                  <button
                    className="linkBtn"
                    type="button"
                    onClick={() => switchMode("register")}
                  >
                    Cadastre-se
                  </button>
                </>
              ) : (
                <>
                  Já possui conta?{" "}
                  <button
                    className="linkBtn"
                    type="button"
                    onClick={() => switchMode("login")}
                  >
                    Fazer login
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        <div className="authToggle" aria-hidden="false">
          <button
            className="authToggleSingle"
            type="button"
            onClick={() => switchMode()}
            aria-label="Toggle mode"
            title="Alternar"
          >
            ↔
          </button>
        </div>
      </div>

      {forgotOpen && (
        <div className="modalBackdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal__title">Recuperar senha</div>
            <form className="form" onSubmit={handleForgotPassword} noValidate>
              <label className="field">
                <span>E-mail</span>
                <input
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="seu@email.com"
                  type="email"
                />
              </label>

              <div className="modal__actions">
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => setForgotOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn--primary"
                  type="submit"
                  disabled={loading}
                >
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
