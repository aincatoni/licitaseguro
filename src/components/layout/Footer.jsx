function Footer() {
  return (
    <footer className="site-footer" id="ayuda">
      <div className="site-footer__inner">
        <div className="site-footer__column site-footer__column-brand">
          <h2>LicitaSeguro</h2>
          <p>
            Plataforma oficial para consultar licitaciones publicas y proveedores del Estado de Chile.
          </p>
        </div>

        <div className="site-footer__column">
          <h2>Enlaces</h2>
          <ul className="footer-links">
            <li>
              <a href="#">Sobre LicitaSeguro</a>
            </li>
            <li>
              <a href="#">Preguntas frecuentes</a>
            </li>
            <li>
              <a href="#">Terminos y condiciones</a>
            </li>
          </ul>
        </div>

        <div className="site-footer__column">
          <h2>Contacto</h2>
          <ul className="footer-contact">
            <li>Telefono: +56 2 1234 5678</li>
            <li>Email: contacto@licitaseguro.cl</li>
          </ul>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>
          © 2026 LicitaSeguro
          <br />
          Hecho con amor por Ain Cortes Catoni en el Bosque.
          <br />
          Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
