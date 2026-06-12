import EmptyState from "../../components/common/EmptyState";
import LoadingState from "../../components/common/LoadingState";
import NoticeBanner from "../../components/common/NoticeBanner";
import PageIntro from "../../components/common/PageIntro";
import ProveedorResultCard from "../../components/proveedores/ProveedorResultCard";
import ProveedorSearchForm from "../../components/proveedores/ProveedorSearchForm";

function ProveedorView({ result, rut, onRutChange, onSearch, validationError, feedback, isLoading, error, notice }) {
  return (
    <>
      <section className="section-block section-block-tight">
        <PageIntro
          kicker="Busqueda por RUT"
          title="Consulta de proveedor"
          description="El formulario aplica limpieza, formateo y validacion del RUT antes de consultar la informacion del proveedor."
        />

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

        {!isLoading && result ? <ProveedorResultCard proveedor={result} /> : null}

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

export default ProveedorView;
