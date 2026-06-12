import { useRef, useState } from "react";
import { proveedoresMock } from "../../data/mockData";
import { cleanRut, formatRut, isValidRut, normalizeRutForQuery } from "../../utils/rut";
import { fetchProveedorByRut, getMercadoPublicoErrorMessage, isMercadoPublicoConfigured } from "../../services/mercadoPublicoApi";

const MOCK_REQUEST_DELAY_MS = 500;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function getReactiveRutError(value) {
  const cleanedRut = cleanRut(value);

  // La mascara agrega guion apenas hay suficientes caracteres para formar un DV.
  // Para no validar demasiado pronto mientras el usuario aun escribe el cuerpo,
  // solo mostramos error reactivo cuando ya hay al menos 9 caracteres limpios.
  if (cleanedRut.length < 9 || isValidRut(value)) {
    return "";
  }

  return "Ingresa un RUT valido con digito verificador correcto.";
}

function useProveedorSearch() {
  const [proveedorResult, setProveedorResult] = useState(null);
  const [proveedorRut, setProveedorRut] = useState("");
  const [proveedorValidationError, setProveedorValidationError] = useState("");
  const [proveedorFeedback, setProveedorFeedback] = useState("");
  const [proveedorError, setProveedorError] = useState("");
  const [proveedorNotice, setProveedorNotice] = useState("");
  const [isProveedorLoading, setIsProveedorLoading] = useState(false);
  const proveedorSearchRequestRef = useRef(0);
  const proveedorLoadingRef = useRef(false);
  const proveedorAbortRef = useRef(null);

  const handleProveedorRutChange = (nextValue) => {
    const formattedRut = formatRut(nextValue);

    setProveedorRut(formattedRut);
    setProveedorValidationError(getReactiveRutError(formattedRut));
    setProveedorFeedback("");
    setProveedorError("");
    setProveedorNotice("");
    setProveedorResult(null);
  };

  const handleProveedorSearch = async () => {
    const rut = proveedorRut;
    const normalizedRut = normalizeRutForQuery(rut);

    if (!rut.trim()) {
      setProveedorResult(null);
      setProveedorFeedback("");
      setProveedorError("");
      setProveedorNotice("");
      setProveedorValidationError("El RUT es obligatorio.");
      return;
    }

    if (!isValidRut(rut)) {
      setProveedorResult(null);
      setProveedorFeedback("");
      setProveedorError("");
      setProveedorNotice("");
      setProveedorValidationError("Ingresa un RUT valido con digito verificador correcto.");
      return;
    }

    setProveedorValidationError("");

    if (proveedorLoadingRef.current) {
      return;
    }

    const requestId = proveedorSearchRequestRef.current + 1;

    proveedorSearchRequestRef.current = requestId;
    proveedorLoadingRef.current = true;

    setProveedorResult(null);
    setProveedorFeedback("");
    setProveedorError("");
    setProveedorNotice("");
    setIsProveedorLoading(true);

    if (!isMercadoPublicoConfigured()) {
      try {
        await wait(MOCK_REQUEST_DELAY_MS);

        const provider = proveedoresMock.find((item) => item.rut === normalizedRut) ?? null;

        if (proveedorSearchRequestRef.current !== requestId) {
          return;
        }

        setProveedorResult(provider);
        setProveedorFeedback(provider ? "" : "No se encontro un proveedor asociado al RUT ingresado.");
        setProveedorNotice("");
      } finally {
        if (proveedorSearchRequestRef.current === requestId) {
          setIsProveedorLoading(false);
          proveedorLoadingRef.current = false;
        }
      }

      return;
    }

    if (proveedorAbortRef.current) {
      proveedorAbortRef.current.abort();
    }

    const abortController = new AbortController();
    proveedorAbortRef.current = abortController;

    try {
      const provider = await fetchProveedorByRut(rut, { signal: abortController.signal });

      if (proveedorSearchRequestRef.current !== requestId) {
        return;
      }

      setProveedorResult(provider);
      setProveedorFeedback(provider ? "" : "No se encontro un proveedor asociado al RUT ingresado.");
      setProveedorNotice("");
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      if (proveedorSearchRequestRef.current !== requestId) {
        return;
      }

      setProveedorResult(null);
      setProveedorFeedback("");
      setProveedorNotice("");
      setProveedorError(getMercadoPublicoErrorMessage(error));
    } finally {
      if (proveedorSearchRequestRef.current === requestId) {
        setIsProveedorLoading(false);
        proveedorLoadingRef.current = false;
      }
    }
  };

  return {
    proveedorResult,
    proveedorRut,
    proveedorValidationError,
    proveedorFeedback,
    proveedorError,
    proveedorNotice,
    isProveedorLoading,
    handleProveedorRutChange,
    handleProveedorSearch,
  };
}

export default useProveedorSearch;
