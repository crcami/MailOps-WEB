import { useState } from "react";
import AppLayout from "../../../app/layouts/AppLayout.jsx";
import Tag from "../../../shared/components/Tag.jsx";
import FilePicker from "../../../shared/components/FilePicker.jsx";
import { postFormData } from "../../../shared/lib/apiClient.js";

function getCategoryVariant(category) {
  if (category === "Produtivo") return "productive";
  if (category === "Improdutivo") return "unproductive";
  return "neutral";
}

export default function AnalyzePage() {
  const [emailText, setEmailText] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const form = new FormData();
      form.append("email_text", emailText);

      if (file) {
        form.append("file", file);
      }

      const data = await postFormData("/api/analyze", form, { auth: true });
      setResult(data);
    } catch (err) {
      setError(err?.message || "Falha ao processar o e-mail.");
    } finally {
      setLoading(false);
    }
  }

  function clearAll() {
    setEmailText("");
    setFile(null);
    setResult(null);
    setError("");
  }

  return (
    <AppLayout>
      <div className="panel">
        <h2 className="panel__title">Analisar e-mail</h2>
        <p className="panel__subtitle">
          Cole o texto do e-mail ou faça upload de um arquivo PDF/TXT e envie
          para processamento.
        </p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Texto do e-mail</span>
            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              placeholder="Cole aqui o conteúdo do e-mail..."
              rows={8}
            />
          </label>

          <label className="field">
            <span>Arquivo (PDF/TXT)</span>
            <FilePicker
              accept=".pdf,.txt"
              disabled={loading}
              onFileChange={(selected) => setFile(selected)}
            />
          </label>

          {error && <div className="alert alert--error">{error}</div>}

          <div className="row">
            <button
              className="btn btn--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Processando..." : "Enviar para processamento"}
            </button>

            <button
              className="btn btn--ghost"
              type="button"
              onClick={clearAll}
              disabled={loading}
            >
              Limpar
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="panel">
          <div className="row row--space">
            <h3 className="panel__title panel__title--sm">Resultado</h3>
            <Tag variant={getCategoryVariant(result.category)}>
              {result.category}
            </Tag>
          </div>

          <div className="grid2">
            <div className="card">
              <div className="card__title">Assunto sugerido</div>
              <div className="card__body">{result.suggested_subject}</div>
            </div>

            <div className="card">
              <div className="card__title">Resposta sugerida</div>
              <div className="card__body prewrap">{result.suggested_reply}</div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
