import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDateForDisplay } from "../../utils/date";
import { getLicitacionDetailPath } from "../../routes/paths";

function LicitacionCard({ item }) {
  return (
    <article className="licitacion-card">
      <div className="licitacion-card__top">
        <div>
          <p className="licitacion-card__code">Codigo {item.codigo}</p>
          <h3>{item.nombre}</h3>
        </div>
        <StatusBadge estado={item.estado} />
      </div>

      <dl className="licitacion-meta-grid">
        <div>
          <dt>Organismo</dt>
          <dd>{item.organismo}</dd>
        </div>
        <div>
          <dt>Fecha de cierre</dt>
          <dd>{formatDateForDisplay(item.fechaCierre)}</dd>
        </div>
        <div>
          <dt>Monto estimado</dt>
          <dd>{item.monto}</dd>
        </div>
      </dl>

      <Link className="button button-secondary" to={getLicitacionDetailPath(item.codigo)}>
        Ver detalle
      </Link>
    </article>
  );
}

export default LicitacionCard;
