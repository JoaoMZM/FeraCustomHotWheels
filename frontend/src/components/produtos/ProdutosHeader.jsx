import { useNavigate } from "react-router-dom";
import { IconesProdutos } from "../icons/IconesProdutos";
import useTheme from "../../hooks/useTheme";

export const ProdutosHeader = ({ busca, setBusca, onSubmitBusca }) => {
  const navigate = useNavigate();
  const { tema, alternarTema } = useTheme();

  return (
    <header className="produtos-header">
      <div className="produtos-header-main">
        <button
          type="button"
          className="produtos-logo"
          onClick={() => navigate("/")}
          aria-label="Ir para produtos"
        >
          <img src="/FeraCustomLogo.jpg" alt="Fera Custom" />
          <strong>FERA CUSTOM</strong>
        </button>

        <form className="produtos-search" onSubmit={onSubmitBusca}>
          <input
            type="text"
            placeholder="Buscar miniaturas, linhas..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar produtos"
          />

          <button type="submit" aria-label="Buscar produtos">
            <IconesProdutos name="search" size={18} />
          </button>
        </form>

        <div className="produtos-header-actions">
          <button
            type="button"
            className="produtos-account"
            onClick={() => {
              if (localStorage.getItem("payload")) {
                navigate("/pedidos");
              } else {
                navigate("/login");
              }
            }}
          >
            <div className="produtos-account-avatar">
              <IconesProdutos name="user" size={18} />
            </div>

            <span className="produtos-account-text">
              Minha Conta
              <strong>Meus Pedidos</strong>
            </span>
          </button>

          {/* Botão de modo claro/escuro */}
          <button
            type="button"
            className="produtos-tema-botao"
            onClick={alternarTema}
            aria-label={tema === "escuro" ? "Ativar modo claro" : "Ativar modo escuro"}
            title={tema === "escuro" ? "Modo claro" : "Modo escuro"}
          >
            {tema === "escuro" ? "☀️" : "🌙"}
          </button>

          <button
            type="button"
            className="produtos-icon-button"
            aria-label="Favoritos"
          >
            <IconesProdutos name="heart" size={20} />
          </button>

          <button
            type="button"
            className="produtos-icon-button"
            aria-label="Carrinho"
            onClick={() => navigate("/carrinho")}
          >
            <IconesProdutos name="cart" size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};