const ESTADO_LABELS = {
  publicada: "Publicada",
  cerrada: "Cerrada",
  adjudicada: "Adjudicada",
  desierta: "Desierta",
};

export function mapEstadoLabel(estado) {
  return ESTADO_LABELS[String(estado || "").toLowerCase()] ?? "Estado desconocido";
}
