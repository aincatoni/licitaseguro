import { useCallback, useState } from "react";

function usePagination(items, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = useCallback((page) => {
    setCurrentPage(() => {
      const nextTotalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
      return Math.max(1, Math.min(page, nextTotalPages));
    });
  }, [items.length, itemsPerPage]);

  const nextPage = useCallback(() => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }, []);

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    canNext: safePage < totalPages,
    canPrev: safePage > 1,
  };
}

export default usePagination;
