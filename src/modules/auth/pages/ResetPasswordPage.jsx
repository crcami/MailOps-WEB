/** Reset password page. */

import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../../../app/layouts/AuthLayout.jsx";
import { resetPassword } from "../../../shared/lib/auth.js";

export default function ResetPasswordPage() {
  /** Render reset password page. */
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const token = useMemo(() => params.get("token") || "", [params]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    /** Handle submit. */
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await resetPassword(token, newPassword);
      setMessage(res?.message || "Senha atualizada com sucesso.");
    } catch (err) {
      setError(err?.message || "Falha ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <div className="panel">
        <h2 className="panel__title">Redefinir senha</h2>

        {!token && <div className="alert alert--error">Token ausente na URL.</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nova senha</span>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              minLength={8}
              maxLength={72}
              required
              disabled={!token}
            />
          </label>

          {error && <div className="alert alert--error">{error}</div>}
          {message && <div className="alert alert--info">{message}</div>}

          <button className="btn btn--primary btn--full" type="submit" disabled={loading || !token}>
            {loading ? "Aguarde..." : "Atualizar senha"}
          </button>

          <button
            className="btn btn--ghost btn--full"
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
