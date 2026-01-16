import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";
import Notice from "../../../shared/components/Notice.jsx";
import { resetPassword } from "../../../shared/lib/auth.js";

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
  const hasSpecial = /[^A-Za-z0-9]/.test(value);
  return value.length >= 8 && hasUpper && hasLower && hasDigit && hasSpecial;
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  function closeNotice() {
    setNotice(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    closeNotice();

    if (!token) {
      setNotice({
        variant: "error",
        title: "Erro",
        message: "Token inválido ou ausente. Solicite a redefinição novamente.",
      });
      return;
    }

    if (!isPasswordStrong(password)) {
      setNotice({
        variant: "error",
        title: "Erro",
        message:
          "Senha inválida: mínimo 8 caracteres, incluindo maiúscula, minúscula, caractere especial e número.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setNotice({
        variant: "error",
        title: "Erro",
        message: "As senhas não coincidem.",
      });
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);

      navigate(
        "/auth?mode=login&notice=" +
          encodeURIComponent("Senha atualizada com sucesso.")
      );
    } catch (err) {
      setNotice({
        variant: "error",
        title: "Erro",
        message: err?.message || "Falha ao redefinir senha.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Notice
        variant={notice?.variant}
        title={notice?.title}
        message={notice?.message}
        onClose={closeNotice}
      />

      <div className="resetCard">
        <div className="resetCard__header">REDEFINIR SENHA</div>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Senha</span>
            <div className="passwordField">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

            <div className="passwordHint">
              Mínimo 8 caracteres, incluindo maiúscula, minúscula, caractere
              especial e número.
            </div>
          </label>

          <label className="field">
            <span>Confirmar senha</span>
            <div className="passwordField">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
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

          <button
            className="btn btn--gradient btn--full"
            type="submit"
            disabled={loading}
          >
            {loading ? "Atualizando..." : "Atualizar senha"}
          </button>

          <button
            className="linkBtn"
            type="button"
            onClick={() => navigate("/auth?mode=login")}
          >
            Voltar para login
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
