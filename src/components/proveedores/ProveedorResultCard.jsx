import { fallbackText } from "../../utils/text";

function ProveedorResultCard({ proveedor }) {
  return (
    <article className="detail-panel">
      <header className="detail-header">
        <div>
          <p className="detail-code">Proveedor encontrado</p>
          <h2>{fallbackText(proveedor.razonSocial)}</h2>
          <p>{fallbackText(proveedor.resumen, "Resultado disponible para la consulta de proveedor por RUT.")}</p>
        </div>
      </header>

      <dl className="detail-grid">
        <div className="detail-row">
          <dt>Codigo empresa</dt>
          <dd>{fallbackText(proveedor.codigoEmpresa)}</dd>
        </div>
        <div className="detail-row">
          <dt>RUT</dt>
          <dd>{fallbackText(proveedor.rutFormateado)}</dd>
        </div>
        <div className="detail-row">
          <dt>Region</dt>
          <dd>{fallbackText(proveedor.region)}</dd>
        </div>
        <div className="detail-row">
          <dt>Rubro</dt>
          <dd>{fallbackText(proveedor.rubro)}</dd>
        </div>
        <div className="detail-row">
          <dt>Correo</dt>
          <dd>{fallbackText(proveedor.correo)}</dd>
        </div>
        <div className="detail-row">
          <dt>Telefono</dt>
          <dd>{fallbackText(proveedor.telefono)}</dd>
        </div>
        <div className="detail-row">
          <dt>Estado</dt>
          <dd>{fallbackText(proveedor.estado)}</dd>
        </div>
      </dl>
    </article>
  );
}

export default ProveedorResultCard;
