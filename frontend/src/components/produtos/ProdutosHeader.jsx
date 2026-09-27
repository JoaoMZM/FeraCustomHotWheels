import { useNavigate } from "react-router-dom";
import { IconesProdutos } from "../icons/IconesProdutos";

export const ProdutosHeader = ({
  busca = "",
  setBusca = () => { },
  totalCarrinho = 0,
  onSubmitBusca = (e) => e?.preventDefault(),
}) => {
  const navigate = useNavigate();

  const estaAutenticado = () => {
    const token = localStorage.getItem("fera_token");
    return Boolean(token && token !== "null" && token !== "undefined" && token.trim() !== "");
  };

  const navegarProtegido = (rotaDestino) => {
    if (estaAutenticado()) {
      navigate(rotaDestino);
    } else {
      localStorage.removeItem("fera_token");
      navigate("/login");
    }
  };

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
            onClick={() => navegarProtegido("/minha-conta")}
            aria-label="Ir para Minha Conta"
          >
            <div className="produtos-account-avatar">
              <IconesProdutos name="user" size={18} />
            </div>
            <span className="produtos-account-text">
              <strong>Minha Conta</strong>
            </span>
          </button>

          <button
            type="button"
            className="produtos-account"
            onClick={() => navegarProtegido("/pedidosProdutos")}
            aria-label="Ir para Meus Pedidos"
          >
            <div className="produtos-account-avatar">
              <IconesProdutos name="box" size={18} />
            </div>
            <span className="produtos-account-text">
              <strong>Meus Pedidos</strong>
            </span>
          </button>

          {/* Favoritos */}
          <button
            type="button"
            className="produtos-account"
            aria-label="Favoritos"
            onClick={() => navigate("/favoritos")}
          >
            <div className="produtos-account-avatar">
              <IconesProdutos name="heart" size={18} />
            </div>
          </button>

          <button
            type="button"
            className="produtos-account"
            aria-label="Carrinho"
            onClick={() => navigate("/carrinho")}
          >
            <div className="produtos-account-avatar" style={{ position: "relative" }}>
              <IconesProdutos name="cart" size={18} />
              {totalCarrinho > 0 && (
                <span className="produtos-cart-badge">{totalCarrinho}</span>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};