import { useCallback, useRef, useState } from "react";
import { licitacionesMock } from "../../data/mockData";
import usePagination from "../common/usePagination";
import { formatDateForDisplay } from "../../utils/date";
import {
  fetchLicitacionDetail,
  fetchLicitaciones,
  getMercadoPublicoErrorMessage,
  isMercadoPublicoConfigured,
} from "../../services/mercadoPublicoApi";

const INITIAL_FILTERS = {
  fecha: "",
  estado: "",
};

const DEFAULT_EMPTY_MESSAGE = "Prueba otro estado o una fecha distinta para obtener resultados.";
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

  return DEFAULT_EMPTY_MESSAGE;
}

function useLicitaciones() {
  const [appliedFilters, setAppliedFilters] = useState(INITIAL_FILTERS);
  const [licitaciones, setLicitaciones] = useState(licitacionesMock);
  const [selectedLicitacion, setSelectedLicitacion] = useState(null);
  const [licitacionesError, setLicitacionesError] = useState("");
  const [licitacionesNotice, setLicitacionesNotice] = useState("");
  const [licitacionesEmptyMessage, setLicitacionesEmptyMessage] = useState(DEFAULT_EMPTY_MESSAGE);
  const [detailError, setDetailError] = useState("");
  const [detailNotice, setDetailNotice] = useState("");
  const [isLicitacionesLoading, setIsLicitacionesLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const licitacionesSearchRequestRef = useRef(0);
  const licitacionesLoadingRef = useRef(false);
  const licitacionesAbortRef = useRef(null);
  const hasLoadedInitialLicitacionesRef = useRef(false);

  const pagination = usePagination(licitaciones, 10);
  const { goToPage } = pagination;

  const handleLicitacionesSearch = useCallback(async ({ fecha, estado }, options = {}) => {
    const { preserveFallbackOnError = false } = options;

    if (licitacionesLoadingRef.current) {
      return;
    }

    const requestId = licitacionesSearchRequestRef.current + 1;

    licitacionesSearchRequestRef.current = requestId;
    licitacionesLoadingRef.current = true;

    setAppliedFilters({ fecha, estado });
    setLicitacionesError("");
    setDetailError("");
    setSelectedLicitacion(null);
    goToPage(1);

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

      setLicitacionesEmptyMessage(DEFAULT_EMPTY_MESSAGE);
    } finally {
      if (licitacionesSearchRequestRef.current === requestId) {
        setIsLicitacionesLoading(false);
        licitacionesLoadingRef.current = false;
      }
    }
  }, [goToPage]);

  const ensureInitialLicitacionesLoaded = useCallback(() => {
    if (!isMercadoPublicoConfigured() || hasLoadedInitialLicitacionesRef.current) {
      return;
    }

    hasLoadedInitialLicitacionesRef.current = true;
    void handleLicitacionesSearch(INITIAL_FILTERS, { preserveFallbackOnError: true });
  }, [handleLicitacionesSearch]);

  const handleLicitacionesClear = useCallback(() => {
    if (isMercadoPublicoConfigured()) {
      void handleLicitacionesSearch(INITIAL_FILTERS, { preserveFallbackOnError: true });
      return;
    }

    setAppliedFilters(INITIAL_FILTERS);
    setLicitaciones(licitacionesMock);
    goToPage(1);
    setLicitacionesError("");
    setSelectedLicitacion(null);
    setDetailError("");
    setDetailNotice("");
    setLicitacionesNotice("");
    setLicitacionesEmptyMessage(DEFAULT_EMPTY_MESSAGE);
  }, [goToPage, handleLicitacionesSearch]);

  const loadLicitacionDetail = useCallback(async (codigo) => {
    const fallbackLicitacion =
      licitaciones.find((item) => item.codigo === codigo) ?? licitacionesMock.find((item) => item.codigo === codigo) ?? null;

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
  }, [licitaciones]);

  return {
    appliedFilters,
    licitaciones,
    selectedLicitacion,
    licitacionesError,
    licitacionesNotice,
    licitacionesEmptyMessage,
    detailError,
    detailNotice,
    isLicitacionesLoading,
    isDetailLoading,
    pagination,
    ensureInitialLicitacionesLoaded,
    handleLicitacionesSearch,
    handleLicitacionesClear,
    loadLicitacionDetail,
  };
}

export default useLicitaciones;
