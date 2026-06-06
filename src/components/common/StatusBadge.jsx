import { mapEstadoLabel } from "../../utils/licitaciones";

function StatusBadge({ estado }) {
  const label = mapEstadoLabel(estado);
  const toneClass = `status-badge status-badge-${String(estado || "desconocido").toLowerCase()}`;

  return <span className={toneClass}>{label}</span>;
}

export default StatusBadge;
