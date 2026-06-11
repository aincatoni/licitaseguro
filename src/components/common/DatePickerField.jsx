import { useEffect, useId, useMemo, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { es } from "date-fns/locale";
import { formatDateForField, parseDateValue, toApiDateValue } from "../../utils/date";

const START_MONTH = new Date(2015, 0, 1);
const END_MONTH = new Date(new Date().getFullYear(), 11, 1);

function isSameCalendarMonth(leftDate, rightDate) {
  return leftDate.getFullYear() === rightDate.getFullYear() && leftDate.getMonth() === rightDate.getMonth();
}

function DatePickerField({ label, value, onChange, placeholder = "Selecciona una fecha", disabled = false }) {
  const inputId = useId();
  const containerRef = useRef(null);
  const selectedDate = parseDateValue(value);
  const [isOpen, setIsOpen] = useState(false);
  const [isYearViewOpen, setIsYearViewOpen] = useState(false);
  const [month, setMonth] = useState(selectedDate ?? new Date());
  const [yearPageStart, setYearPageStart] = useState(START_MONTH.getFullYear());

  const yearOptions = useMemo(() => {
    const years = [];

    for (let year = START_MONTH.getFullYear(); year <= END_MONTH.getFullYear(); year += 1) {
      years.push(year);
    }

    return years;
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
        setIsYearViewOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsYearViewOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const monthLabel = new Intl.DateTimeFormat("es-CL", {
    month: "long",
  }).format(month);

  const currentYear = month.getFullYear();
  const systemYear = new Date().getFullYear();
  const pageSize = 12;
  const yearPageEnd = Math.min(yearPageStart + pageSize - 1, END_MONTH.getFullYear());
  const visibleYears = yearOptions.filter((year) => year >= yearPageStart && year <= yearPageEnd);
  const canGoPrevious = isYearViewOpen
    ? yearPageStart > START_MONTH.getFullYear()
    : !isSameCalendarMonth(month, START_MONTH);
  const canGoNext = isYearViewOpen
    ? yearPageEnd < END_MONTH.getFullYear()
    : !isSameCalendarMonth(month, END_MONTH);

  const handleSelect = (date) => {
    if (!date) {
      return;
    }

    onChange(toApiDateValue(date));
    setMonth(date);
    setIsOpen(false);
    setIsYearViewOpen(false);
  };

  const handlePreviousMonth = () => {
    if (!canGoPrevious) {
      return;
    }

    if (isYearViewOpen) {
      setYearPageStart((currentValue) => Math.max(START_MONTH.getFullYear(), currentValue - pageSize));
      return;
    }

    setMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    if (!canGoNext) {
      return;
    }

    if (isYearViewOpen) {
      setYearPageStart((currentValue) => Math.min(END_MONTH.getFullYear() - (pageSize - 1), currentValue + pageSize));
      return;
    }

    setMonth((currentMonth) => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleYearSelect = (year) => {
    setMonth((currentMonth) => new Date(year, currentMonth.getMonth(), 1));
    setIsYearViewOpen(false);
  };

  const handleToggleYearView = () => {
    const nextValue = !isYearViewOpen;
    setIsYearViewOpen(nextValue);

    if (nextValue) {
      const alignedStart = Math.floor((currentYear - START_MONTH.getFullYear()) / pageSize) * pageSize + START_MONTH.getFullYear();
      setYearPageStart(alignedStart);
    }
  };

  return (
    <div className="field-group">
      <label htmlFor={inputId}>{label}</label>

      <div className="date-picker" ref={containerRef}>
        <button
          id={inputId}
          type="button"
          className={value ? "date-picker__trigger" : "date-picker__trigger date-picker__trigger-placeholder"}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => setIsOpen((currentValue) => !currentValue)}
        >
          <span>{value ? formatDateForField(value) : placeholder}</span>
          <span className="date-picker__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1Zm12 8H5v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8ZM6 8h12V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1Z" />
            </svg>
          </span>
        </button>

        {isOpen ? (
          <div className="date-picker__popover" role="presentation">
            <div className="date-picker__header">
              <div className="date-picker__header-main">
                <span className="date-picker__month-label">
                  {isYearViewOpen ? "Selecciona un año" : monthLabel}
                </span>

                <button
                  type="button"
                  className="date-picker__year-trigger"
                  aria-pressed={isYearViewOpen}
                  onClick={handleToggleYearView}
                >
                  <span>{currentYear}</span>
                  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                    <path d="M6.7 9.3a1 1 0 0 1 1.4 0L12 13.17l3.9-3.88a1 1 0 0 1 1.4 1.42l-4.6 4.58a1 1 0 0 1-1.4 0L6.7 10.7a1 1 0 0 1 0-1.4Z" />
                  </svg>
                </button>
              </div>

                  {!isYearViewOpen ? (
                    <div className="date-picker__nav">
                      <button type="button" className="date-picker__nav-button" onClick={handlePreviousMonth} disabled={!canGoPrevious} aria-label="Mes anterior">
                        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                          <path d="M14.7 5.3a1 1 0 0 1 0 1.4L9.41 12l5.3 5.3a1 1 0 1 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0Z" />
                        </svg>
                      </button>
                      <button type="button" className="date-picker__nav-button" onClick={handleNextMonth} disabled={!canGoNext} aria-label="Mes siguiente">
                        <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
                          <path d="M9.3 18.7a1 1 0 0 1 0-1.4l5.3-5.3-5.3-5.3a1 1 0 0 1 1.4-1.4l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4 0Z" />
                        </svg>
                      </button>
                    </div>
                  ) : null}
            </div>

            <div className="date-picker__body">
              {isYearViewOpen ? (
                <div key={`years-${yearPageStart}`} className="date-picker__panel date-picker__panel-enter">
                  <div className="date-picker__year-panel" role="listbox" aria-label="Seleccionar año">
                    {visibleYears.map((year) => {
                      const isSelected = year === currentYear;
                      const isCurrentSystemYear = year === systemYear;
                      const className = [
                        "date-picker__year-option",
                        isSelected ? "date-picker__year-option-selected" : "",
                        !isSelected && isCurrentSystemYear ? "date-picker__year-option-current" : "",
                      ]
                        .filter(Boolean)
                        .join(" ");

                      return (
                        <button
                          key={year}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          className={className}
                          onClick={() => handleYearSelect(year)}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div key={`month-${month.getFullYear()}-${month.getMonth()}`} className="date-picker__panel date-picker__panel-enter">
                  <DayPicker
                    key={`${month.getFullYear()}-${month.getMonth()}`}
                    mode="single"
                    month={month}
                    selected={selectedDate ?? undefined}
                    onMonthChange={setMonth}
                    onSelect={handleSelect}
                    locale={es}
                    showOutsideDays
                    weekStartsOn={1}
                    hideNavigation
                    className="date-picker__calendar"
                  />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DatePickerField;
