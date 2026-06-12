import LoadingState from "../../components/common/LoadingState";
import NoticeBanner from "../../components/common/NoticeBanner";
import PageIntro from "../../components/common/PageIntro";
import LicitacionFilters from "../../components/licitaciones/LicitacionFilters";
import LicitacionList from "../../components/licitaciones/LicitacionList";

function LicitacionesView({
  filters,
  onSearch,
  onClear,
  items,
  pagination,
  isLoading,
  error,
  notice,
  emptyMessage,
}) {
  return (
    <>
      <section className="section-block section-block-tight">
        <PageIntro
          kicker="Modulo principal"
          title="Licitaciones publicas"
          description="Filtra por fecha de cierre y estado para revisar licitaciones de forma rapida y ordenada."
        />

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
          <LicitacionList items={items} pagination={pagination} emptyMessage={emptyMessage} />
        )}
      </section>
    </>
  );
}

export default LicitacionesView;
