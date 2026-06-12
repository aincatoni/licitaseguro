import { useEffect } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import "./App.css";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import PageContainer from "./components/layout/PageContainer";
import useLicitaciones from "./hooks/licitaciones/useLicitaciones";
import useProveedorSearch from "./hooks/proveedores/useProveedorSearch";
import { HOME_PATH, LICITACIONES_PATH, PROVEEDORES_PATH } from "./routes/paths";
import HomeView from "./views/home/HomeView";
import LicitacionDetailView from "./views/licitaciones/LicitacionDetailView";
import LicitacionesView from "./views/licitaciones/LicitacionesView";
import ProveedorView from "./views/proveedores/ProveedorView";

function LicitacionesRoute({ licitacionesState }) {
  const {
    appliedFilters,
    ensureInitialLicitacionesLoaded,
    handleLicitacionesClear,
    handleLicitacionesSearch,
    isLicitacionesLoading,
    licitaciones,
    licitacionesEmptyMessage,
    licitacionesError,
    licitacionesNotice,
    pagination,
  } = licitacionesState;

  useEffect(() => {
    ensureInitialLicitacionesLoaded();
  }, [ensureInitialLicitacionesLoaded]);

  return (
    <LicitacionesView
      filters={appliedFilters}
      onSearch={handleLicitacionesSearch}
      onClear={handleLicitacionesClear}
      items={licitaciones}
      pagination={pagination}
      isLoading={isLicitacionesLoading}
      error={licitacionesError}
      notice={licitacionesNotice}
      emptyMessage={licitacionesEmptyMessage}
    />
  );
}

function LicitacionDetailRoute({ licitacionesState }) {
  const { detailError, detailNotice, isDetailLoading, loadLicitacionDetail, selectedLicitacion } = licitacionesState;
  const { codigo } = useParams();

  useEffect(() => {
    if (codigo) {
      void loadLicitacionDetail(codigo);
    }
  }, [codigo, loadLicitacionDetail]);

  return (
    <LicitacionDetailView
      isLoading={isDetailLoading}
      licitacion={selectedLicitacion}
      notice={detailNotice}
      error={detailError}
    />
  );
}

function App() {
  const licitacionesState = useLicitaciones();
  const proveedorState = useProveedorSearch();

  return (
    <div className="app-shell">
      <Header />

      <PageContainer>
        <Routes>
          <Route path={HOME_PATH} element={<HomeView />} />
          <Route path={LICITACIONES_PATH} element={<LicitacionesRoute licitacionesState={licitacionesState} />} />
          <Route path={`${LICITACIONES_PATH}/:codigo`} element={<LicitacionDetailRoute licitacionesState={licitacionesState} />} />
          <Route
            path={PROVEEDORES_PATH}
            element={
              <ProveedorView
                result={proveedorState.proveedorResult}
                rut={proveedorState.proveedorRut}
                onRutChange={proveedorState.handleProveedorRutChange}
                onSearch={proveedorState.handleProveedorSearch}
                validationError={proveedorState.proveedorValidationError}
                feedback={proveedorState.proveedorFeedback}
                isLoading={proveedorState.isProveedorLoading}
                error={proveedorState.proveedorError}
                notice={proveedorState.proveedorNotice}
              />
            }
          />
          <Route path="*" element={<Navigate to={HOME_PATH} replace />} />
        </Routes>
      </PageContainer>

      <Footer />
    </div>
  );
}

export default App;
