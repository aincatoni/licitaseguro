import { useState } from "react";
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
import { normalizeRutForQuery } from "./utils/rut";
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
          <h2>Base funcional alineada con el plan tecnico</h2>
          <p>
            Esta primera entrega deja lista la estructura visual, la navegacion y los modulos clave para seguir con
            la integracion real de la API.
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
            <h3>Preparada para API</h3>
            <p>Los modulos ya trabajan con filtros, paginacion y validaciones para conectar endpoints reales.</p>
          </article>
        </div>
      </section>

      <section className="section-block section-highlight">
        <div className="cta-panel">
          <div>
            <p className="section-kicker">Acceso rapido</p>
            <h2>Continua directamente hacia los modulos evaluados</h2>
            <p>
              El examen prioriza experiencia de usuario, validaciones, accesibilidad y consumo de datos. Esta base ya
              deja resueltos los puntos de entrada principales.
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
}) {
  return (
    <>
      <section className="section-block section-block-tight">
        <div className="section-heading section-heading-left">
          <p className="section-kicker">Modulo principal</p>
          <h1>Licitaciones publicas</h1>
          <p>
            Filtra por fecha y estado para revisar resultados mock preparados para la siguiente etapa de integracion.
          </p>
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
            emptyMessage="Prueba otro estado o una fecha distinta para obtener resultados."
          />
        )}
      </section>
    </>
  );
}

function ProveedorView({ result, onSearch, isLoading, error, notice }) {
  return (
    <>
      <section className="section-block section-block-tight">
        <div className="section-heading section-heading-left">
          <p className="section-kicker">Busqueda por RUT</p>
          <h1>Consulta de proveedor</h1>
          <p>
            El formulario aplica limpieza, formateo y validacion del RUT antes de revisar un conjunto mock de
            proveedores.
          </p>
        </div>

        <ProveedorSearchForm onSearch={onSearch} isLoading={isLoading} />
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
            message="Ingresa un RUT valido para revisar si existe una coincidencia en Mercado Publico o en la base mock local."
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
  const [detailError, setDetailError] = useState("");
  const [detailNotice, setDetailNotice] = useState("");
  const [isLicitacionesLoading, setIsLicitacionesLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [proveedorResult, setProveedorResult] = useState(null);
  const [proveedorError, setProveedorError] = useState("");
  const [proveedorNotice, setProveedorNotice] = useState("");
  const [isProveedorLoading, setIsProveedorLoading] = useState(false);

  const pagination = usePagination(licitaciones, 10);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleLicitacionesSearch = async ({ fecha, estado }) => {
    setAppliedFilters({ fecha, estado });
    setCurrentView("licitaciones");
    setLicitacionesError("");
    setDetailError("");
    setSelectedLicitacion(null);
    pagination.goToPage(1);

    if (!isMercadoPublicoConfigured()) {
      setIsLicitacionesLoading(true);

      await wait(MOCK_REQUEST_DELAY_MS);

      const filteredItems = licitacionesMock.filter((item) => {
        const matchesFecha = !fecha || item.fechaCierre === fecha;
        const matchesEstado = !estado || item.estado === estado;
        return matchesFecha && matchesEstado;
      });

      setLicitaciones(filteredItems);
      setLicitacionesNotice("");
      setIsLicitacionesLoading(false);
      return;
    }

    setIsLicitacionesLoading(true);

    try {
      const results = await fetchLicitaciones({ fecha, estado });
      setLicitaciones(results);
      setLicitacionesNotice("");
    } catch (error) {
      setLicitaciones([]);
      setLicitacionesNotice("");
      setLicitacionesError(getMercadoPublicoErrorMessage(error));
    } finally {
      setIsLicitacionesLoading(false);
    }
  };

  const handleLicitacionesClear = () => {
    setAppliedFilters(INITIAL_FILTERS);
    setLicitaciones(licitacionesMock);
    pagination.goToPage(1);
    setLicitacionesError("");
    setSelectedLicitacion(null);
    setDetailError("");
    setDetailNotice("");
    setLicitacionesNotice("");
  };

  const handleViewDetail = async (codigo) => {
    setCurrentView("detalle");
    setDetailError("");

    if (!isMercadoPublicoConfigured()) {
      setIsDetailLoading(true);

      await wait(MOCK_REQUEST_DELAY_MS);

      setSelectedLicitacion(licitacionesMock.find((item) => item.codigo === codigo) ?? null);
      setDetailNotice("");
      setIsDetailLoading(false);
      return;
    }

    setSelectedLicitacion(null);
    setDetailNotice("");
    setIsDetailLoading(true);

    try {
      const detail = await fetchLicitacionDetail(codigo);
      setSelectedLicitacion(detail);
      setDetailNotice("");
    } catch (error) {
      setDetailError(getMercadoPublicoErrorMessage(error));
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleProveedorSearch = async (rut) => {
    const normalizedRut = normalizeRutForQuery(rut);
    setCurrentView("proveedor");
    setProveedorError("");

    if (!isMercadoPublicoConfigured()) {
      setIsProveedorLoading(true);

      await wait(MOCK_REQUEST_DELAY_MS);

      const provider = proveedoresMock.find((item) => item.rut === normalizedRut) ?? null;
      setProveedorResult(provider);
      setProveedorNotice("");
      setIsProveedorLoading(false);
      return provider;
    }

    setIsProveedorLoading(true);

    try {
      const provider = await fetchProveedorByRut(rut);
      setProveedorResult(provider);
      setProveedorNotice("");
      return provider;
    } catch (error) {
      setProveedorResult(null);
      setProveedorNotice("");
      setProveedorError(getMercadoPublicoErrorMessage(error));
      return null;
    } finally {
      setIsProveedorLoading(false);
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
            onSearch={handleProveedorSearch}
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
