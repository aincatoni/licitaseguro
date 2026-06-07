const ESTADO_LABELS = {
  5: "Publicada",
  6: "Cerrada",
  7: "Desierta",
  8: "Adjudicada",
  18: "Revocada",
  19: "Suspendida",
  publicada: "Publicada",
  cerrada: "Cerrada",
  adjudicada: "Adjudicada",
  desierta: "Desierta",
  revocada: "Revocada",
  suspendida: "Suspendida",
  activas: "Activas",
};

export function normalizeEstadoValue(estado) {
  const rawValue = String(estado || "").trim();

  if (!rawValue) {
    return "desconocido";
  }

  const normalized = rawValue.toLowerCase();

  if (normalized === "5") {
    return "publicada";
  }

  if (normalized === "6") {
    return "cerrada";
  }

  if (normalized === "7") {
    return "desierta";
  }

  if (normalized === "8") {
    return "adjudicada";
  }

  if (normalized === "18") {
    return "revocada";
  }

  if (normalized === "19") {
    return "suspendida";
  }

  if (normalized === "activa" || normalized === "activas") {
    return "publicada";
  }

  return normalized;
}

export function mapEstadoLabel(estado) {
  return ESTADO_LABELS[String(estado || "").toLowerCase()] ?? ESTADO_LABELS[String(estado || "")] ?? "Estado desconocido";
}

export function estadoToApiCode(estado) {
  const normalized = String(estado || "").trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  const stateMap = {
    publicada: "5",
    cerrada: "6",
    desierta: "7",
    adjudicada: "8",
    revocada: "18",
    suspendida: "19",
    activas: "activas",
  };

  return stateMap[normalized] ?? "";
}
