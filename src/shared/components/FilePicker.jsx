/** File picker. */

import { useId, useState } from "react";

export default function FilePicker({
  accept = ".pdf,.txt",
  disabled = false,
  onFileChange,
}) {
  /** Render file picker. */
  const inputId = useId();
  const [fileName, setFileName] = useState("");

  function handleChange(e) {
    /** Handle file selection. */
    const file = e.target.files?.[0] || null;
    setFileName(file ? file.name : "");
    if (onFileChange) onFileChange(file);
  }

  function clearFile() {
    /** Clear selected file. */
    const input = document.getElementById(inputId);
    if (input) input.value = "";
    setFileName("");
    if (onFileChange) onFileChange(null);
  }

  return (
    <div className="filePicker">
      <input
        id={inputId}
        className="filePicker__input"
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={disabled}
      />

      <div className="filePicker__row">
        <label
          className="btn btn--gradient filePicker__btn"
          htmlFor={inputId}
          aria-disabled={disabled}
        >
          {fileName ? "Trocar arquivo" : "Selecionar arquivo"}
        </label>

        {fileName && (
          <button
            className="btn btn--ghost filePicker__clear"
            type="button"
            onClick={clearFile}
            disabled={disabled}
          >
            Remover
          </button>
        )}
      </div>

      <div className="filePicker__meta">
        {fileName ? (
          <div className="hint">Selecionado: {fileName}</div>
        ) : (
          <div className="hint">Nenhum arquivo selecionado.</div>
        )}
      </div>
    </div>
  );
}
