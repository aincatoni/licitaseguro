import StatusBadge from "../common/StatusBadge";
import { formatDateForDisplay } from "../../utils/date";
import { fallbackText } from "../../utils/text";

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <dt>{label}</dt>
      <dd>{fallbackText(value)}</dd>
    </div>
  );
}

function LicitacionDetail({ licitacion, onBack }) {
  return (
    <article className="detail-panel">
      <button className="detail-back-link" onClick={onBack}>
        <span aria-hidden="true">←</span>
        <span>Volver al listado</span>
      </button>

      <header className="detail-header">
        <div>
          <p className="detail-code">Licitacion {licitacion.codigo}</p>
          <h1>{fallbackText(licitacion.nombre)}</h1>
          <p>{fallbackText(licitacion.descripcion)}</p>
        </div>
        <StatusBadge estado={licitacion.estado} />
      </header>

      <dl className="detail-grid">
        <DetailRow label="Organismo" value={licitacion.organismo} />
        <DetailRow label="Region" value={licitacion.region} />
        <DetailRow label="Fecha de publicacion" value={formatDateForDisplay(licitacion.fechaPublicacion)} />
        <DetailRow label="Fecha de cierre" value={formatDateForDisplay(licitacion.fechaCierre)} />
        <DetailRow label="Monto estimado" value={licitacion.monto} />
        <DetailRow label="Proveedor adjudicado" value={licitacion.proveedorAdjudicado} />
        <DetailRow label="Modalidad" value={licitacion.modalidad} />
        <DetailRow label="Contacto" value={licitacion.contacto} />
      </dl>
    </article>
  );
}

export default LicitacionDetail;
