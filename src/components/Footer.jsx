export default function Footer() {
  return (
    <footer className="ftr-footer">
      <p className="ftr-text">
        &copy; 2025 <span className="ftr-brand">EsportsTorneos</span>. Todos los derechos reservados.
      </p>
      <div className="ftr-links">
        <a href="/terminos" className="ftr-link">Términos de uso</a>
        <a href="/privacidad" className="ftr-link">Privacidad</a>
        <a href="mailto:contacto@esportstorneos.com" className="ftr-link">Contacto</a>
      </div>
    </footer>
  );
}