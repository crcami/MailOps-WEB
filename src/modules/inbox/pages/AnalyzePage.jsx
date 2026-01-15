/** Analyze page. */

import { useState } from "react";
import AppLayout from "../../../app/layouts/AppLayout.jsx";
import Tag from "../../../shared/components/Tag.jsx";
import { postFormData } from "../../../shared/lib/apiClient.js";

function getCategoryVariant(category) {
  /** Map category to variant. */
  if (category === "Produtivo") return "productive";
  if (category === "Improdutivo") return "unproductive";
  return "neutral";
}

export default function AnalyzePage() {
  /** Render analyze page. */
  const [emailText, setEmailText] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    /** Handle submit. */
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

  function handleFileChange(e) {
    /** Handle file change. */
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  }

  function clearAll() {
    /** Clear inputs and result. */
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
          Cole o texto do e-mail ou faça upload de um arquivo PDF/TXT e envie para processamento.
        </p>

        <form className="form" onSubmit={handleSubmit}>
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
            <input type="file" accept=".pdf,.txt" onChange={handleFileChange} />
            {file && <div className="hint">Selecionado: {file.name}</div>}
          </label>

          {error && <div className="alert alert--error">{error}</div>}

          <div className="row">
            <button className="btn btn--primary" type="submit" disabled={loading}>
              {loading ? "Processando..." : "Enviar para processamento"}
            </button>

            <button className="btn btn--ghost" type="button" onClick={clearAll} disabled={loading}>
              Limpar
            </button>
          </div>
        </form>
      </div>

      {result && (
        <div className="panel">
          <div className="row row--space">
            <h3 className="panel__title panel__title--sm">Resultado</h3>
            <Tag variant={getCategoryVariant(result.category)}>{result.category}</Tag>
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
