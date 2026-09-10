import { Link } from "react-router-dom";
import "./footer.css";

const CATEGORIAS_FOOTER = [
  { valor: "mainline", rotulo: "Mainline" },
  { valor: "premium", rotulo: "Premium" },
  { valor: "team-transport", rotulo: "Team Transport" },
  { valor: "rlc", rotulo: "RLC" },
  { valor: "customizado", rotulo: "Customizado" },
];

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="footer-fera">
      <div className="footer-fera-faixa" aria-hidden="true" />

      <div className="footer-fera-inner">
        <div className="footer-fera-col footer-fera-marca">
          <div className="footer-fera-logo">
            <img src="/public/FeraCustomLogo.jpg" alt="Fera Custom" />
            <span>FERA CUSTOM</span>
          </div>
          <p>
            Miniaturas Hot Wheels selecionadas para colecionadores que não
            abrem mão de qualidade e raridade.
          </p>
          <div className="footer-fera-social">
            <a href="#" aria-label="Instagram" target="_blank" rel="noreferrer">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
            </a>
            <a href="#" aria-label="WhatsApp" target="_blank" rel="noreferrer">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" target="_blank" rel="noreferrer">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-fera-col">
          <h3>Categorias</h3>
          <ul>
            {CATEGORIAS_FOOTER.map((cat) => (
              <li key={cat.valor}>
                <Link to="/">{cat.rotulo}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-fera-col">
          <h3>Institucional</h3>
          <ul>
            <li><Link to="/">Sobre a Fera Custom</Link></li>
            <li><a href="#">Trabalhe conosco</a></li>
            <li><a href="#">Política de Privacidade</a></li>
            <li><a href="#">Termos de Uso</a></li>
          </ul>
        </div>

        <div className="footer-fera-col">
          <h3>Atendimento</h3>
          <ul>
            <li><a href="#">Central de Ajuda</a></li>
            <li><a href="#">Trocas e Devoluções</a></li>
            <li><a href="#">Rastrear Pedido</a></li>
            <li><a href="mailto:feracustom1@gmail.com">feracustom1@gmail.com</a></li>
          </ul>
        </div>

        <div className="footer-fera-col footer-fera-newsletter">
          <h3>Fique por dentro</h3>
          <p>Lançamentos e raridades direto no seu e-mail.</p>
          <form
            className="footer-fera-newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="feracustom1@gmail.com" required aria-label="E-mail" />
            <button type="submit">Assinar</button>
          </form>
        </div>
      </div>

      <div className="footer-fera-bottom">
        <span>© {anoAtual} Fera Custom. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
}