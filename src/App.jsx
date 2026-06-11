import { useRef, useState } from "react";
import "./App.css";
import EmptyState from "./components/common/EmptyState";
import LoadingState from "./components/common/LoadingState";
import NoticeBanner from "./components/common/NoticeBanner";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import PageContainer from "./components/layout/PageContainer";
import LicitacionDetail from "./components/licitaciones/LicitacionDetail";
import LicitacionFilters from "./components/licitaciones/LicitacionFilters";
import LicitacionList from "./components/licitaciones/LicitacionList";
import ProveedorResultCard from "./components/proveedores/ProveedorResultCard";
import ProveedorSearchForm from "./components/proveedores/ProveedorSearchForm";
import { licitacionesMock, proveedoresMock } from "./data/mockData";
import usePagination from "./hooks/usePagination";
import { formatDateForDisplay } from "./utils/date";
import { cleanRut, formatRut, isValidRut, normalizeRutForQuery } from "./utils/rut";
import {
  fetchLicitacionDetail,
  fetchLicitaciones,
  fetchProveedorByRut,
  getMercadoPublicoErrorMessage,
  isMercadoPublicoConfigured,
} from "./services/mercadoPublicoApi";

const INITIAL_FILTERS = {
  fecha: "",
  estado: "",
};

const MOCK_REQUEST_DELAY_MS = 500;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getMaxFechaCierre(items) {
  return items.reduce((latestDate, item) => {
    return item.fechaCierre > latestDate ? item.fechaCierre : latestDate;
  }, "");
}

function getLicitacionesEmptyMessage(fechaBuscada, maxFechaCierre) {
  if (fechaBuscada && maxFechaCierre && fechaBuscada > maxFechaCierre) {
    return `No hay licitaciones con fecha de cierre posterior a ${formatDateForDisplay(maxFechaCierre)}. Prueba con una fecha igual o anterior.`;
  }

  return "Prueba otro estado o una fecha distinta para obtener resultados.";
}

function getReactiveRutError(value) {
  const cleanedRut = cleanRut(value);

  // La mascara agrega guion apenas hay suficientes caracteres para formar un DV.
  // Para no validar demasiado pronto mientras el usuario aun escribe el cuerpo,
  // solo mostramos error reactivo cuando ya hay al menos 9 caracteres limpios.
  if (cleanedRut.length < 9 || isValidRut(value)) {
    return "";
  }

  return "Ingresa un RUT valido con digito verificador correcto.";
}

function HomeView({ onNavigate }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-card">
          <p className="eyebrow">Plataforma institucional digital</p>
          <h1>Consulta licitaciones publicas con una experiencia clara y confiable</h1>
          <p className="hero-copy">
            LicitaSeguro centraliza la consulta de licitaciones y proveedores del Estado de Chile en una interfaz
            simple, responsiva y preparada para integrarse con Mercado Publico.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => onNavigate("licitaciones")}>
              Ver licitaciones
            </button>
            <button className="button button-secondary" onClick={() => onNavigate("proveedor")}>
              Buscar proveedor
            </button>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="section-kicker">Propuesta de valor</p>
          <h2>Informacion publica en un entorno claro y accesible</h2>
          <p>
            La plataforma centraliza consultas de licitaciones y proveedores con una experiencia orientada a
            legibilidad, rapidez de uso y navegacion simple.
          </p>
        </div>

        <div className="feature-grid">
          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              TS
            </span>
            <h3>Transparencia</h3>
            <p>Consulta informacion publica con estados visibles, detalle claro y enfoque en legibilidad.</p>
          </article>

          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              FL
            </span>
            <h3>Flujo guiado</h3>
            <p>La app separa inicio, listado, detalle y proveedores con una navegacion simple por estado.</p>
          </article>

          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              UX
            </span>
            <h3>Responsive</h3>
            <p>El layout se adapta desde movil a desktop con foco visible y jerarquia semantica consistente.</p>
          </article>

          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              API
            </span>
            <h3>Consulta integrada</h3>
            <p>Los modulos integran filtros, paginacion y validaciones para consultar informacion publica de forma ordenada.</p>
          </article>
        </div>
      </section>

      <section className="section-block section-highlight">
        <div className="cta-panel">
          <div>
            <p className="section-kicker">Acceso rapido</p>
            <h2>Accede rapidamente a las consultas principales</h2>
            <p>
              Revisa licitaciones disponibles o consulta proveedores desde un mismo punto de acceso, con una navegacion
              simple y enfocada en las tareas mas frecuentes.
            </p>
          </div>

          <div className="cta-list">
            <button className="button button-primary" onClick={() => onNavigate("licitaciones")}>
              Ir al listado
            </button>
            <button className="button button-secondary" onClick={() => onNavigate("proveedor")}>
              Ir a proveedores
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

function LicitacionesView({
  filters,
  onSearch,
  onClear,
  items,
  onViewDetail,
  pagination,
  isLoading,
  error,
  notice,
  emptyMessage,
}) {
  return (
    <>
      <section className="section-block section-block-tight">
        <div className="section-heading section-heading-left">
          <p className="section-kicker">Modulo principal</p>
          <h1>Licitaciones publicas</h1>
          <p>Filtra por fecha de cierre y estado para revisar licitaciones de forma rapida y ordenada.</p>
        </div>

        <LicitacionFilters initialValues={filters} onSearch={onSearch} onClear={onClear} isLoading={isLoading} />
      </section>

      <section className="section-block section-block-tight">
        <NoticeBanner tone="info" message={notice} />
        <NoticeBanner tone="error" message={error} />
        {isLoading ? (
          <LoadingState
            title="Cargando licitaciones..."
            message="Consultando Mercado Publico y preparando los resultados del listado."
          />
        ) : (
          <LicitacionList
            items={items}
            onViewDetail={onViewDetail}
            pagination={pagination}
            emptyMessage={emptyMessage}
          />
        )}
      </section>
    </>
  );
}

function ProveedorView({ result, rut, onRutChange, onSearch, validationError, feedback, isLoading, error, notice }) {
  return (
    <>
      <section className="section-block section-block-tight">
        <div className="section-heading section-heading-left">
          <p className="section-kicker">Busqueda por RUT</p>
          <h1>Consulta de proveedor</h1>
          <p>El formulario aplica limpieza, formateo y validacion del RUT antes de consultar la informacion del proveedor.</p>
        </div>

        <ProveedorSearchForm
          rut={rut}
          onRutChange={onRutChange}
          onSearch={onSearch}
          error={validationError}
          feedback={feedback}
          isLoading={isLoading}
        />
      </section>

      <section className="section-block section-block-tight">
        <NoticeBanner tone="info" message={notice} />
        <NoticeBanner tone="error" message={error} />
        {isLoading ? (
          <LoadingState
            title="Buscando proveedor..."
            message="Validando el RUT y consultando la informacion disponible en Mercado Publico."
          />
        ) : null}

        {!isLoading && result ? (
          <ProveedorResultCard proveedor={result} />
        ) : null}

        {!isLoading && !result ? (
          <EmptyState
            title="Aun no hay proveedor seleccionado"
            message="Ingresa un RUT valido para revisar si existe una coincidencia disponible para la consulta de proveedor."
          />
        ) : null}
      </section>
    </>
  );
}

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [licitaciones, setLicitaciones] = useState(licitacionesMock);
  const [selectedLicitacion, setSelectedLicitacion] = useState(null);
  const [licitacionesError, setLicitacionesError] = useState("");
  const [licitacionesNotice, setLicitacionesNotice] = useState("");
  const [licitacionesEmptyMessage, setLicitacionesEmptyMessage] = useState("Prueba otro estado o una fecha distinta para obtener resultados.");
  const [detailError, setDetailError] = useState("");
  const [detailNotice, setDetailNotice] = useState("");
  const [isLicitacionesLoading, setIsLicitacionesLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const licitacionesSearchRequestRef = useRef(0);
  const licitacionesLoadingRef = useRef(false);
  const licitacionesAbortRef = useRef(null);
  const hasLoadedInitialLicitacionesRef = useRef(false);
  const [proveedorResult, setProveedorResult] = useState(null);
  const [proveedorRut, setProveedorRut] = useState("");
  const [proveedorValidationError, setProveedorValidationError] = useState("");
  const [proveedorFeedback, setProveedorFeedback] = useState("");
  const [proveedorError, setProveedorError] = useState("");
  const [proveedorNotice, setProveedorNotice] = useState("");
  const [isProveedorLoading, setIsProveedorLoading] = useState(false);
  const proveedorSearchRequestRef = useRef(0);
  const proveedorLoadingRef = useRef(false);
  const proveedorAbortRef = useRef(null);

  const pagination = usePagination(licitaciones, 10);

  const handleNavigate = (view) => {
    setCurrentView(view);

    if (view === "licitaciones" && isMercadoPublicoConfigured() && !hasLoadedInitialLicitacionesRef.current) {
      hasLoadedInitialLicitacionesRef.current = true;
      void handleLicitacionesSearch(INITIAL_FILTERS, { preserveFallbackOnError: true });
    }
  };

  const handleLicitacionesSearch = async ({ fecha, estado }, options = {}) => {
    const { preserveFallbackOnError = false } = options;

    if (licitacionesLoadingRef.current) {
      return;
    }

    const requestId = licitacionesSearchRequestRef.current + 1;

    licitacionesSearchRequestRef.current = requestId;
    licitacionesLoadingRef.current = true;

    setAppliedFilters({ fecha, estado });
    setCurrentView("licitaciones");
    setLicitacionesError("");
    setDetailError("");
    setSelectedLicitacion(null);
    pagination.goToPage(1);

    setIsLicitacionesLoading(true);

    if (!isMercadoPublicoConfigured()) {
      try {
        await wait(MOCK_REQUEST_DELAY_MS);

        const maxFechaCierre = getMaxFechaCierre(licitacionesMock);

        const filteredItems = licitacionesMock.filter((item) => {
          const matchesFecha = !fecha || item.fechaCierre === fecha;
          const matchesEstado = !estado || item.estado === estado;
          return matchesFecha && matchesEstado;
        });

        if (licitacionesSearchRequestRef.current !== requestId) {
          return;
        }

        setLicitaciones(filteredItems);
        setLicitacionesEmptyMessage(getLicitacionesEmptyMessage(fecha, maxFechaCierre));
        setLicitacionesNotice("");
      } finally {
        if (licitacionesSearchRequestRef.current === requestId) {
          setIsLicitacionesLoading(false);
          licitacionesLoadingRef.current = false;
        }
      }

      return;
    }

    if (licitacionesAbortRef.current) {
      licitacionesAbortRef.current.abort();
    }

    const abortController = new AbortController();
    licitacionesAbortRef.current = abortController;

    try {
      const results = await fetchLicitaciones({ fecha, estado }, { signal: abortController.signal });

      if (licitacionesSearchRequestRef.current !== requestId) {
        return;
      }

      setLicitaciones(results.items);
      setLicitacionesEmptyMessage(getLicitacionesEmptyMessage(fecha, results.maxFechaCierre));
      setLicitacionesNotice("");
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      if (licitacionesSearchRequestRef.current !== requestId) {
        return;
      }

      if (preserveFallbackOnError) {
        setLicitaciones((currentItems) => (currentItems.length > 0 ? currentItems : licitacionesMock));
        setLicitacionesNotice("No fue posible actualizar las licitaciones desde Mercado Publico. Se muestran datos de respaldo.");
        setLicitacionesError("");
      } else {
        setLicitaciones([]);
        setLicitacionesNotice("");
        setLicitacionesError(getMercadoPublicoErrorMessage(error));
      }

      setLicitacionesEmptyMessage("Prueba otro estado o una fecha distinta para obtener resultados.");
    } finally {
      if (licitacionesSearchRequestRef.current === requestId) {
        setIsLicitacionesLoading(false);
        licitacionesLoadingRef.current = false;
      }
    }
  };

  const handleLicitacionesClear = () => {
    if (isMercadoPublicoConfigured()) {
      void handleLicitacionesSearch(INITIAL_FILTERS, { preserveFallbackOnError: true });
      return;
    }

    setAppliedFilters(INITIAL_FILTERS);
    setLicitaciones(licitacionesMock);
    pagination.goToPage(1);
    setLicitacionesError("");
    setSelectedLicitacion(null);
    setDetailError("");
    setDetailNotice("");
    setLicitacionesNotice("");
    setLicitacionesEmptyMessage("Prueba otro estado o una fecha distinta para obtener resultados.");
  };

  const handleViewDetail = async (codigo) => {
    const fallbackLicitacion =
      licitaciones.find((item) => item.codigo === codigo) ?? licitacionesMock.find((item) => item.codigo === codigo) ?? null;

    setCurrentView("detalle");
    setDetailError("");
    setDetailNotice("");

    if (!isMercadoPublicoConfigured()) {
      setIsDetailLoading(true);

      await wait(MOCK_REQUEST_DELAY_MS);

      setSelectedLicitacion(fallbackLicitacion);
      setIsDetailLoading(false);
      return;
    }

    setSelectedLicitacion(fallbackLicitacion);
    setIsDetailLoading(true);

    try {
      const detail = await fetchLicitacionDetail(codigo);
      setSelectedLicitacion(detail);
      setDetailNotice("");
    } catch (error) {
      if (fallbackLicitacion) {
        setDetailNotice("No fue posible actualizar el detalle desde Mercado Publico. Se muestran los datos disponibles del listado.");
      } else {
        setDetailError(getMercadoPublicoErrorMessage(error));
      }
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleProveedorRutChange = (nextValue) => {
    const formattedRut = formatRut(nextValue);

    setProveedorRut(formattedRut);
    setProveedorValidationError(getReactiveRutError(formattedRut));
    setProveedorFeedback("");
    setProveedorError("");
    setProveedorNotice("");
    setProveedorResult(null);
  };

  const handleProveedorSearch = async () => {
    const rut = proveedorRut;
    const normalizedRut = normalizeRutForQuery(rut);

    if (!rut.trim()) {
      setCurrentView("proveedor");
      setProveedorResult(null);
      setProveedorFeedback("");
      setProveedorError("");
      setProveedorNotice("");
      setProveedorValidationError("El RUT es obligatorio.");
      return;
    }

    if (!isValidRut(rut)) {
      setCurrentView("proveedor");
      setProveedorResult(null);
      setProveedorFeedback("");
      setProveedorError("");
      setProveedorNotice("");
      setProveedorValidationError("Ingresa un RUT valido con digito verificador correcto.");
      return;
    }

    setProveedorValidationError("");

    if (proveedorLoadingRef.current) {
      return;
    }

    const requestId = proveedorSearchRequestRef.current + 1;

    proveedorSearchRequestRef.current = requestId;
    proveedorLoadingRef.current = true;

    setCurrentView("proveedor");
    setProveedorResult(null);
    setProveedorFeedback("");
    setProveedorError("");
    setProveedorNotice("");
    setIsProveedorLoading(true);

    if (!isMercadoPublicoConfigured()) {
      try {
        await wait(MOCK_REQUEST_DELAY_MS);

        const provider = proveedoresMock.find((item) => item.rut === normalizedRut) ?? null;

        if (proveedorSearchRequestRef.current !== requestId) {
          return;
        }

        setProveedorResult(provider);
        setProveedorFeedback(provider ? "" : "No se encontro un proveedor asociado al RUT ingresado.");
        setProveedorNotice("");
      } finally {
        if (proveedorSearchRequestRef.current === requestId) {
          setIsProveedorLoading(false);
          proveedorLoadingRef.current = false;
        }
      }

      return;
    }

    if (proveedorAbortRef.current) {
      proveedorAbortRef.current.abort();
    }
    const abortController = new AbortController();
    proveedorAbortRef.current = abortController;

    try {
      const provider = await fetchProveedorByRut(rut, { signal: abortController.signal });

      if (proveedorSearchRequestRef.current !== requestId) {
        return;
      }

      setProveedorResult(provider);
      setProveedorFeedback(provider ? "" : "No se encontro un proveedor asociado al RUT ingresado.");
      setProveedorNotice("");
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      if (proveedorSearchRequestRef.current !== requestId) {
        return;
      }

      setProveedorResult(null);
      setProveedorFeedback("");
      setProveedorNotice("");
      setProveedorError(getMercadoPublicoErrorMessage(error));
      return;
    } finally {
      if (proveedorSearchRequestRef.current === requestId) {
        setIsProveedorLoading(false);
        proveedorLoadingRef.current = false;
      }
    }
  };

  return (
    <div className="app-shell">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      <PageContainer>
        {currentView === "home" && <HomeView onNavigate={handleNavigate} />}

        {currentView === "licitaciones" && (
          <LicitacionesView
            filters={appliedFilters}
            onSearch={handleLicitacionesSearch}
            onClear={handleLicitacionesClear}
            items={licitaciones}
            onViewDetail={handleViewDetail}
            pagination={pagination}
            isLoading={isLicitacionesLoading}
            error={licitacionesError}
            notice={licitacionesNotice}
            emptyMessage={licitacionesEmptyMessage}
          />
        )}

        {currentView === "detalle" && isDetailLoading && (
          <section className="section-block section-block-tight">
            <LoadingState
              title="Cargando detalle de licitacion..."
              message="Consultando el codigo seleccionado para obtener la informacion completa del proceso."
            />
          </section>
        )}

        {currentView === "detalle" && !isDetailLoading && selectedLicitacion && (
          <section className="section-block section-block-tight">
            <NoticeBanner tone="info" message={detailNotice} />
            <LicitacionDetail licitacion={selectedLicitacion} onBack={() => handleNavigate("licitaciones")} />
          </section>
        )}

        {currentView === "detalle" && !isDetailLoading && !selectedLicitacion && (
          <section className="section-block section-block-tight">
            <EmptyState
              title={detailError ? "No fue posible cargar la licitacion" : "No se encontro la licitacion"}
              message={detailError || "Selecciona una licitacion desde el listado para revisar su detalle completo."}
              actionLabel="Volver al listado"
              onAction={() => handleNavigate("licitaciones")}
            />
          </section>
        )}

        {currentView === "proveedor" && (
          <ProveedorView
            result={proveedorResult}
            rut={proveedorRut}
            onRutChange={handleProveedorRutChange}
            onSearch={handleProveedorSearch}
            validationError={proveedorValidationError}
            feedback={proveedorFeedback}
            isLoading={isProveedorLoading}
            error={proveedorError}
            notice={proveedorNotice}
          />
        )}
      </PageContainer>

      <Footer />
    </div>
  );
}

export default App;
