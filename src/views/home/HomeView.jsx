import { Link } from "react-router-dom";
import { LICITACIONES_PATH, PROVEEDORES_PATH } from "../../routes/paths";

function HomeView() {
  return (
    <>
      <section className="hero-section">
        <div className="hero-card">
          <p className="eyebrow">Plataforma institucional digital</p>
          <h1>Consulta licitaciones publicas con una experiencia clara y confiable</h1>
          <p className="hero-copy">
            LicitaSeguro centraliza la consulta de licitaciones y proveedores del Estado de Chile en una interfaz
            simple, responsiva y preparada para integrarse con Mercado Publico.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to={LICITACIONES_PATH}>
              Ver licitaciones
            </Link>
            <Link className="button button-secondary" to={PROVEEDORES_PATH}>
              Buscar proveedor
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="section-kicker">Propuesta de valor</p>
          <h2>Informacion publica en un entorno claro y accesible</h2>
          <p>
            La plataforma centraliza consultas de licitaciones y proveedores con una experiencia orientada a
            legibilidad, rapidez de uso y navegacion simple.
          </p>
        </div>

        <div className="feature-grid">
          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              TS
            </span>
            <h3>Transparencia</h3>
            <p>Consulta informacion publica con estados visibles, detalle claro y enfoque en legibilidad.</p>
          </article>

          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              FL
            </span>
            <h3>Flujo guiado</h3>
            <p>La app separa inicio, listado, detalle y proveedores con una navegacion simple por estado.</p>
          </article>

          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              UX
            </span>
            <h3>Responsive</h3>
            <p>El layout se adapta desde movil a desktop con foco visible y jerarquia semantica consistente.</p>
          </article>

          <article className="info-card">
            <span className="info-icon" aria-hidden="true">
              API
            </span>
            <h3>Consulta integrada</h3>
            <p>Los modulos integran filtros, paginacion y validaciones para consultar informacion publica de forma ordenada.</p>
          </article>
        </div>
      </section>

      <section className="section-block section-highlight">
        <div className="cta-panel">
          <div>
            <p className="section-kicker">Acceso rapido</p>
            <h2>Accede rapidamente a las consultas principales</h2>
            <p>
              Revisa licitaciones disponibles o consulta proveedores desde un mismo punto de acceso, con una navegacion
              simple y enfocada en las tareas mas frecuentes.
            </p>
          </div>

          <div className="cta-list">
            <Link className="button button-primary" to={LICITACIONES_PATH}>
              Ir al listado
            </Link>
            <Link className="button button-secondary" to={PROVEEDORES_PATH}>
              Ir a proveedores
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeView;
