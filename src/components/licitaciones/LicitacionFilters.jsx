import { useEffect, useRef, useState } from "react";
import DatePickerField from "../common/DatePickerField";
import SelectField from "../common/SelectField";

const ESTADO_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "publicada", label: "Publicada" },
  { value: "cerrada", label: "Cerrada" },
  { value: "adjudicada", label: "Adjudicada" },
  { value: "desierta", label: "Desierta" },
];

const SUBMIT_COOLDOWN_MS = 600;

function LicitacionFilters({ initialValues, onSearch, onClear, isLoading = false }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
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

  const handleEstadoChange = (value) => {
    setValues((currentValues) => ({ ...currentValues, estado: value }));
    setErrors((currentErrors) => ({ ...currentErrors, estado: "", form: "" }));
  };

  const handleDateChange = (value) => {
    setValues((currentValues) => ({ ...currentValues, fecha: value }));
    setErrors((currentErrors) => ({ ...currentErrors, fecha: "", form: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitLockRef.current || isCoolingDown) {
      return;
    }

    setErrors({});

    submitLockRef.current = true;
    setIsCoolingDown(true);

    try {
      await onSearch(values);
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

  const handleClear = () => {
    const resetValues = { fecha: "", estado: "" };
    setValues(resetValues);
    setErrors({});
    onClear();
  };

  return (
    <form className="filter-panel" onSubmit={handleSubmit} noValidate>
      <div className="filter-grid">
        <DatePickerField label="Fecha de cierre" value={values.fecha} onChange={handleDateChange} disabled={isLoading} />

        <SelectField
          label="Estado"
          value={values.estado}
          onChange={handleEstadoChange}
          options={ESTADO_OPTIONS}
          placeholder="Todos los estados"
          disabled={isLoading}
        />
      </div>

      {errors.form ? (
        <p className="field-error" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="filter-actions">
        <button
          className="button button-primary"
          type="submit"
          disabled={isLoading || isCoolingDown}
          onPointerDown={handleSubmitButtonPointerDown}
        >
          {isLoading ? "Buscando..." : isCoolingDown ? "Espera..." : "Buscar"}
        </button>
        <button className="button button-secondary" type="button" onClick={handleClear} disabled={isLoading}>
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default LicitacionFilters;
