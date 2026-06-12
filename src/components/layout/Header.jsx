import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { HOME_PATH, LICITACIONES_PATH, PROVEEDORES_PATH } from "../../routes/paths";

const NAV_ITEMS = [
  { to: HOME_PATH, label: "Inicio", end: true },
  { to: LICITACIONES_PATH, label: "Licitaciones" },
  { to: PROVEEDORES_PATH, label: "Buscar proveedor" },
];

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__row">
          <Link className="brand-button" to={HOME_PATH} onClick={handleNavigate}>
            <span className="brand-mark" aria-hidden="true">
              LS
            </span>
            <span>
              <strong>LicitaSeguro</strong>
              <small>Consulta ciudadana y empresarial</small>
            </span>
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="main-navigation"
            aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
            onClick={() => setIsMobileMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav
          id="main-navigation"
          aria-label="Navegacion principal"
          className={isMobileMenuOpen ? "main-nav main-nav-open" : "main-nav"}
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nav-link")}
              onClick={handleNavigate}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
