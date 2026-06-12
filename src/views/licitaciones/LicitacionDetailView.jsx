import EmptyState from "../../components/common/EmptyState";
import LoadingState from "../../components/common/LoadingState";
import NoticeBanner from "../../components/common/NoticeBanner";
import LicitacionDetail from "../../components/licitaciones/LicitacionDetail";

import { LICITACIONES_PATH } from "../../routes/paths";

function LicitacionDetailView({ isLoading, licitacion, notice, error }) {
  if (isLoading) {
    return (
      <section className="section-block section-block-tight">
        <LoadingState
          title="Cargando detalle de licitacion..."
          message="Consultando el codigo seleccionado para obtener la informacion completa del proceso."
        />
      </section>
    );
  }

  if (licitacion) {
    return (
      <section className="section-block section-block-tight">
        <NoticeBanner tone="info" message={notice} />
        <LicitacionDetail licitacion={licitacion} />
      </section>
    );
  }

  return (
    <section className="section-block section-block-tight">
      <EmptyState
        title={error ? "No fue posible cargar la licitacion" : "No se encontro la licitacion"}
        message={error || "Selecciona una licitacion desde el listado para revisar su detalle completo."}
        actionLabel="Volver al listado"
        href={LICITACIONES_PATH}
      />
    </section>
  );
}

export default LicitacionDetailView;
