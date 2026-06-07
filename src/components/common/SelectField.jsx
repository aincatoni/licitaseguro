import { useEffect, useId, useMemo, useRef, useState } from "react";

function SelectField({ label, value, onChange, options, placeholder = "Selecciona una opcion", disabled = false }) {
  const inputId = useId();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <div className="field-group">
      <label htmlFor={inputId}>{label}</label>

      <div className="date-picker" ref={containerRef}>
        <button
          id={inputId}
          type="button"
          className={selectedOption ? "date-picker__trigger" : "date-picker__trigger date-picker__trigger-placeholder"}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          <span>{selectedOption?.label ?? placeholder}</span>
          <span className="date-picker__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M6.7 9.3a1 1 0 0 1 1.4 0L12 13.17l3.9-3.88a1 1 0 0 1 1.4 1.42l-4.6 4.58a1 1 0 0 1-1.4 0L6.7 10.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </span>
        </button>

        {isOpen ? (
          <div className="date-picker__popover select-field__popover" role="dialog" aria-label={`Seleccionar ${label.toLowerCase()}`}>
            <div className="select-field__options" role="listbox" aria-labelledby={inputId}>
              {options.map((option) => {
                const isSelected = option.value === value;
                const optionClassName = [
                  "select-field__option",
                  isSelected ? "select-field__option-selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={option.value || "empty"}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={optionClassName}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SelectField;
