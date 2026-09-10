export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="footer-fera">
      <div className="footer-fera-inner">
        <div className="footer-fera-linha">
          <p>
            Copyright © {ano} Fera Custom. Todos os direitos reservados.
            {" "}Fera Custom Comércio Ltda. E-mail: feracustom1@gmail.com
          </p>
          <span className="footer-fera-pais">Brasil</span>
        </div>

        <nav className="footer-fera-links" aria-label="Links institucionais">
          <a href="/privacidade">Política de Privacidade</a>
          <span aria-hidden="true">|</span>
          <a href="/politica-de-vendas">Política de vendas</a>
          <span aria-hidden="true">|</span>
          <a href="/avisos-legais">Avisos legais</a>
          <span aria-hidden="true">|</span>
          <a href="/mapa-do-site">Mapa do site</a>
        </nav>
      </div>
    </footer>
  );
}