import { Link } from "react-router-dom";
import "./Footer.css";

const LINKS = [
  { rotulo: "Catálogo", para: "/" },
  { rotulo: "Meu carrinho", para: "/carrinho" },
  { rotulo: "Meus pedidos", para: "/pedidosProdutos" },
  { rotulo: "Minha conta", para: "/minhaconta" },
  { rotulo: "Sobre a loja", para: "/sobre" },
];

const PAGAMENTOS = ["Pix", "Cartão", "Boleto"];

export const Footer = () => {
  const ano = new Date().getFullYear();

  const voltarAoTopo = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="fera-footer">
      <div className="fera-footer-faixa" aria-hidden="true" />

      <div className="fera-footer-main">
        <section className="fera-footer-marca">
          <div className="fera-footer-logo">
            <img src="/FeraCustomLogo.jpg" alt="Fera Custom" />
            <strong>FERA CUSTOM</strong>
          </div>
          <p>Miniaturas Hot Wheels customizadas, feitas com paixão.</p>
          <Link to="/sobre" className="fera-footer-botao">
            Conheça a nossa loja
          </Link>
        </section>

        <nav className="fera-footer-coluna" aria-label="Links do rodapé">
          <h2>Navegue</h2>
          <ul>
            {LINKS.map((link) => (
              <li key={link.para}>
                <Link to={link.para}>{link.rotulo}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className="fera-footer-coluna">
          <h2>Fale com a gente</h2>
          <p>
            Dúvidas sobre uma miniatura? Abra o produto e use o chat
            <strong> “Fale com o vendedor”</strong>.
          </p>
        </section>

        <section className="fera-footer-coluna">
          <h2>Pagamento seguro</h2>
          <ul className="fera-footer-pagamentos">
            {PAGAMENTOS.map((meio) => (
              <li key={meio}>{meio}</li>
            ))}
          </ul>
          <p>Processado pelo Mercado Pago.</p>
        </section>
      </div>

      <div className="fera-footer-base">
        <span>© {ano} Fera Custom. Todos os direitos reservados.</span>
        <button type="button" onClick={voltarAoTopo}>
          Voltar ao topo ↑
        </button>
      </div>
    </footer>
  );
};
