import { useState } from "react";

function usePagination(items, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    goToPage: (page) => setCurrentPage(Math.max(1, Math.min(page, totalPages))),
    nextPage: () => setCurrentPage((page) => Math.min(page + 1, totalPages)),
    prevPage: () => setCurrentPage((page) => Math.max(page - 1, 1)),
    canNext: safePage < totalPages,
    canPrev: safePage > 1,
  };
}

export default usePagination;
