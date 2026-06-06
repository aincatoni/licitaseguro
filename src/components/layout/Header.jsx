import { useState } from "react";

const NAV_ITEMS = [
  { id: "home", label: "Inicio" },
  { id: "licitaciones", label: "Licitaciones" },
  { id: "proveedor", label: "Buscar proveedor" },
];

function Header({ currentView, onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (view) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__row">
          <button className="brand-button" onClick={() => handleNavigate("home")}>
            <span className="brand-mark" aria-hidden="true">
              LS
            </span>
            <span>
              <strong>LicitaSeguro</strong>
              <small>Consulta ciudadana y empresarial</small>
            </span>
          </button>

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
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === currentView;
            return (
              <button
                key={item.id}
                className={isActive ? "nav-link nav-link-active" : "nav-link"}
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleNavigate(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Header;
