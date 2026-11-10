import { useNavigate } from "react-router-dom";
import "./Footer.css";

export const Footer = () => {
  const navigate = useNavigate();
  const ano = new Date().getFullYear();

  return (
    <footer className="fera-footer">
      <div className="fera-footer-main">
        <div className="fera-footer-marca">
          <img src="/FeraCustomLogo.jpg" alt="Fera Custom" />
          <div>
            <strong>FERA CUSTOM</strong>
            <p>Miniaturas Hot Wheels customizadas, feitas com paixão.</p>
          </div>
        </div>

        <button
          type="button"
          className="fera-footer-botao"
          onClick={() => navigate("/sobre")}
        >
          Conheça a nossa loja
        </button>
      </div>

      <div className="fera-footer-base">
        <span>© {ano} Fera Custom. Todos os direitos reservados.</span>
      </div>
    </footer>
  );
};
