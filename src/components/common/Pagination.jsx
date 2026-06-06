function Pagination({ currentPage, totalPages, canPrev, canNext, onPrev, onNext }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination" aria-label="Paginacion de resultados">
      <button className="button button-secondary" onClick={onPrev} disabled={!canPrev}>
        Anterior
      </button>
      <span className="pagination__status">
        Pagina {currentPage} de {totalPages}
      </span>
      <button className="button button-secondary" onClick={onNext} disabled={!canNext}>
        Siguiente
      </button>
    </nav>
  );
}

export default Pagination;
