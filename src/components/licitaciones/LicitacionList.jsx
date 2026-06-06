import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import LicitacionCard from "./LicitacionCard";

function LicitacionList({ items, onViewDetail, pagination }) {
  if (!items.length) {
    return (
      <EmptyState
        title="No se encontraron licitaciones"
        message="Prueba otro estado o una fecha distinta para obtener resultados en esta vista mock."
      />
    );
  }

  return (
    <div className="results-stack">
      <div className="results-summary">
        <strong>{items.length}</strong> resultado{items.length === 1 ? "" : "s"} encontrado{items.length === 1 ? "" : "s"}
      </div>

      <div className="results-grid">
        {pagination.paginatedItems.map((item) => (
          <LicitacionCard key={item.codigo} item={item} onViewDetail={onViewDetail} />
        ))}
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        canPrev={pagination.canPrev}
        canNext={pagination.canNext}
        onPrev={pagination.prevPage}
        onNext={pagination.nextPage}
      />
    </div>
  );
}

export default LicitacionList;
