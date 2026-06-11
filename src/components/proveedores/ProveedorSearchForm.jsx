import { useEffect, useRef, useState } from "react";

const SUBMIT_COOLDOWN_MS = 600;

function ProveedorSearchForm({
  rut,
  onRutChange,
  onSearch,
  error = "",
  feedback = "",
  isLoading = false,
}) {
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const submitLockRef = useRef(false);
  const cooldownTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cooldownTimeoutRef.current) {
        window.clearTimeout(cooldownTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (event) => {
    onRutChange(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitLockRef.current || isCoolingDown) {
      return;
    }

    submitLockRef.current = true;
    setIsCoolingDown(true);

    try {
      await onSearch();
    } finally {
      cooldownTimeoutRef.current = window.setTimeout(() => {
        submitLockRef.current = false;
        setIsCoolingDown(false);
      }, SUBMIT_COOLDOWN_MS);
    }
  };

  const handleSubmitButtonPointerDown = (event) => {
    if (submitLockRef.current || isLoading || isCoolingDown) {
      event.preventDefault();
      event.stopPropagation();
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
          disabled={isLoading}
          aria-describedby={error ? "rut-error" : feedback ? "rut-feedback" : undefined}
          aria-invalid={error ? "true" : undefined}
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
        <button
          className="button button-primary"
          type="submit"
          disabled={isLoading || isCoolingDown}
          onPointerDown={handleSubmitButtonPointerDown}
        >
          {isLoading ? "Buscando..." : isCoolingDown ? "Espera..." : "Buscar proveedor"}
        </button>
      </div>
    </form>
  );
}

export default ProveedorSearchForm;
