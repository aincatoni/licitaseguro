import { formatDateForField } from "../utils/date";
import { formatRut, normalizeRutForQuery } from "../utils/rut";
import { normalizeEstadoValue } from "../utils/licitaciones";
import { sanitizeText } from "../utils/text";

const BASE_URL = "https://api.mercadopublico.cl/servicios/v1";
const MERCADO_PUBLICO_TICKET = sanitizeText(import.meta.env.VITE_MERCADO_PUBLICO_TICKET).replace(/^['"]|['"]$/g, "");

const ERROR_MESSAGES = {
  config: "Configura VITE_MERCADO_PUBLICO_TICKET en .env para usar la API real de Mercado Publico.",
  network: "No fue posible conectar con Mercado Publico. Revisa tu conexion e intenta nuevamente.",
  response: "Mercado Publico respondio con un formato inesperado.",
};

const REQUEST_COOLDOWN_MS = 2500;
let nextAvailableRequestAt = 0;

class MercadoPublicoError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "MercadoPublicoError";
    this.code = code;
  }
}

function createUrl(pathname, params) {
  const url = new URL(`${BASE_URL}${pathname}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url;
}

function getRequiredTicket() {
  if (!MERCADO_PUBLICO_TICKET) {
    throw new MercadoPublicoError("config", ERROR_MESSAGES.config);
  }

  return MERCADO_PUBLICO_TICKET;
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

async function waitForRequestWindow(signal) {
  const remainingDelay = nextAvailableRequestAt - Date.now();

  if (remainingDelay <= 0) {
    return;
  }

  if (signal?.aborted) {
    throw new DOMException("The operation was aborted.", "AbortError");
  }

  await wait(remainingDelay);

  if (signal?.aborted) {
    throw new DOMException("The operation was aborted.", "AbortError");
  }
}

async function requestJson(pathname, params, options = {}) {
  const ticket = getRequiredTicket();
  const url = createUrl(pathname, { ...params, ticket });
  const allowedErrorCodes = options.allowedErrorCodes ?? [];
  const signal = options.signal;

  await waitForRequestWindow(signal);
  nextAvailableRequestAt = Date.now() + REQUEST_COOLDOWN_MS;

  let response;

  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw error;
    }
    throw new MercadoPublicoError("network", ERROR_MESSAGES.network);
  }

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new MercadoPublicoError("response", ERROR_MESSAGES.response);
  }

  if (!response.ok) {
    if (allowedErrorCodes.includes(payload?.Codigo)) {
      return payload;
    }

    throw new MercadoPublicoError("network", ERROR_MESSAGES.network);
  }

  return payload;
}

function getCurrentApiDateValue() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}${month}${year}`;
}

function toDateOnly(dateValue) {
  const sanitized = sanitizeText(dateValue);
  return sanitized ? sanitized.slice(0, 10) : "";
}

function formatCurrency(amount, currency) {
  if (amount === null || amount === undefined || amount === "") {
    return "--";
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${amount} ${sanitizeText(currency)}`.trim();
  }

  const formattedAmount = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: sanitizeText(currency) || "CLP",
    maximumFractionDigits: 0,
  }).format(numericAmount);

  return formattedAmount;
}

function getProveedorAdjudicado(items) {
  const adjudicados = items?.Listado || [];
  const adjudicado = adjudicados.find((item) => item?.Adjudicacion?.NombreProveedor);
  return sanitizeText(adjudicado?.Adjudicacion?.NombreProveedor);
}

function normalizeLicitacionListItem(item) {
  return {
    codigo: sanitizeText(item?.CodigoExterno),
    nombre: sanitizeText(item?.Nombre),
    organismo: sanitizeText(item?.Comprador?.NombreOrganismo || item?.NombreOrganismo),
    estado: normalizeEstadoValue(item?.Estado || item?.CodigoEstado),
    fechaPublicacion: toDateOnly(item?.FechaPublicacion || item?.Fechas?.FechaPublicacion),
    fechaCierre: toDateOnly(item?.FechaCierre || item?.Fechas?.FechaCierre),
    monto: formatCurrency(item?.MontoEstimado, item?.Moneda),
    region: sanitizeText(item?.Comprador?.RegionUnidad || item?.RegionUnidad),
    modalidad: sanitizeText(item?.Tipo),
    proveedorAdjudicado: getProveedorAdjudicado(item?.Items),
    contacto: sanitizeText(item?.EmailResponsableContrato || item?.EmailResponsablePago),
    descripcion: sanitizeText(item?.Descripcion || item?.Nombre),
  };
}

function getMaxFechaCierre(items) {
  return items.reduce((latestDate, item) => {
    return item.fechaCierre > latestDate ? item.fechaCierre : latestDate;
  }, "");
}

function normalizeProveedorResult(item, rut) {
  return {
    codigoEmpresa: sanitizeText(item?.CodigoEmpresa),
    rut: normalizeRutForQuery(rut),
    rutFormateado: formatRut(rut),
    razonSocial: sanitizeText(item?.NombreEmpresa),
    region: "--",
    rubro: "--",
    correo: "--",
    telefono: "--",
    estado: "Proveedor encontrado en Mercado Publico",
    resumen: "Mercado Publico expone el codigo interno y la razon social para esta consulta por RUT.",
  };
}

export function isMercadoPublicoConfigured() {
  return Boolean(MERCADO_PUBLICO_TICKET);
}

export function getMercadoPublicoConfigMessage() {
  return ERROR_MESSAGES.config;
}

export function getMercadoPublicoErrorMessage(error) {
  if (error instanceof MercadoPublicoError) {
    return error.message;
  }

  return ERROR_MESSAGES.network;
}

export async function fetchLicitaciones(filters, { signal } = {}) {
  const payload = await requestJson(
    "/publico/licitaciones.json",
    {
      // La API rechaza fechas futuras, por eso siempre consultamos con la fecha actual
      // y aplicamos los filtros visibles de la UI sobre la fecha de cierre retornada.
      fecha: getCurrentApiDateValue(),
    },
    { signal },
  );

  if (!Array.isArray(payload?.Listado)) {
    throw new MercadoPublicoError("response", ERROR_MESSAGES.response);
  }

  let items = payload.Listado.map(normalizeLicitacionListItem);
  const maxFechaCierre = getMaxFechaCierre(items);

  if (filters.fecha) {
    items = items.filter((item) => item.fechaCierre === filters.fecha);
  }

  if (filters.estado) {
    items = items.filter((item) => item.estado === filters.estado);
  }

  return {
    items,
    maxFechaCierre,
  };
}

export async function fetchLicitacionDetail(codigo) {
  const payload = await requestJson("/publico/licitaciones.json", { codigo });
  const item = payload?.Listado?.[0];

  if (!item) {
    throw new MercadoPublicoError("response", "No se encontro la licitacion solicitada en Mercado Publico.");
  }

  return normalizeLicitacionListItem(item);
}

export async function fetchProveedorByRut(rut, { signal } = {}) {
  const payload = await requestJson(
    "/Publico/Empresas/BuscarProveedor",
    {
      rutempresaproveedor: formatRut(rut),
    },
    {
      allowedErrorCodes: [10200],
      signal,
    },
  );

  const item = payload?.listaEmpresas?.[0];

  if (!item) {
    return null;
  }

  return normalizeProveedorResult(item, rut);
}

export function createMockNotice(entity) {
  return `${formatDateForField(new Date().toISOString().slice(0, 10))}: ${entity} funciona con datos mock porque no hay ticket expuesto para el cliente.`;
}
