import { useState } from "react";
import { formatRut, isValidRut } from "../../utils/rut";

function ProveedorSearchForm({ onSearch }) {
  const [rut, setRut] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleChange = (event) => {
    setRut(formatRut(event.target.value));
    setError("");
    setFeedback("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!rut.trim()) {
      setError("El RUT es obligatorio.");
      return;
    }

    if (!isValidRut(rut)) {
      setError("Ingresa un RUT valido con digito verificador correcto.");
      return;
    }

    const provider = onSearch(rut);

    if (!provider) {
      setFeedback("No se encontro un proveedor asociado al RUT ingresado en los datos mock.");
    }
  };

  return (
    <form className="filter-panel" onSubmit={handleSubmit} noValidate>
      <div className="field-group field-group-full">
        <label htmlFor="rut">RUT del proveedor</label>
        <input
          id="rut"
          name="rut"
          type="text"
          inputMode="text"
          placeholder="12.345.678-5"
          value={rut}
          onChange={handleChange}
          aria-describedby={error ? "rut-error" : feedback ? "rut-feedback" : undefined}
          aria-invalid={error ? "true" : "false"}
        />
      </div>

      {error ? (
        <p className="field-error" id="rut-error" role="alert">
          {error}
        </p>
      ) : null}

      {!error && feedback ? (
        <p className="field-help" id="rut-feedback" role="status" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <div className="filter-actions">
        <button className="button button-primary" type="submit">
          Buscar proveedor
        </button>
      </div>
    </form>
  );
}

export default ProveedorSearchForm;
