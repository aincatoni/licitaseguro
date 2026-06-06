import { useState } from "react";
import DatePickerField from "../common/DatePickerField";

const ESTADO_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "publicada", label: "Publicada" },
  { value: "cerrada", label: "Cerrada" },
  { value: "adjudicada", label: "Adjudicada" },
  { value: "desierta", label: "Desierta" },
];

function LicitacionFilters({ initialValues, onSearch, onClear }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "", form: "" }));
  };

  const handleDateChange = (value) => {
    setValues((currentValues) => ({ ...currentValues, fecha: value }));
    setErrors((currentErrors) => ({ ...currentErrors, fecha: "", form: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!values.fecha && !values.estado) {
      setErrors({ form: "Ingresa una fecha o selecciona un estado para filtrar licitaciones." });
      return;
    }

    onSearch(values);
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
        <DatePickerField label="Fecha de cierre" value={values.fecha} onChange={handleDateChange} />

        <div className="field-group">
          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" value={values.estado} onChange={handleChange}>
            {ESTADO_OPTIONS.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {errors.form ? (
        <p className="field-error" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="filter-actions">
        <button className="button button-primary" type="submit">
          Buscar
        </button>
        <button className="button button-secondary" type="button" onClick={handleClear}>
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default LicitacionFilters;
