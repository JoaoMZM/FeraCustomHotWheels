import { useNavigate } from "react-router-dom";
import { IconesProdutos } from "../icons/IconesProdutos";

export const ProdutosHeader = ({
  busca,
  setBusca,
  categoria,
  setCategoria,
  categorias,
  totalCarrinho,
  onSubmitBusca,
}) => {
  const navigate = useNavigate();

  return (
    <header className="produtos-header">
      <div className="produtos-header-main">
        <button
          type="button"
          className="produtos-logo"
          onClick={() => navigate("/produtos")}
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
          <button className="produtos-account" onClick={() => {navigate('/login')}}>
            <div className="produtos-account-avatar">
              <IconesProdutos name="user" size={18} />
            </div>
            <span className="produtos-account-text">
              Minha Conta
              <strong>Meus Pedidos</strong>
            </span>
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
            {totalCarrinho > 0 && (
              <span className="produtos-cart-badge">{totalCarrinho}</span>
            )}
          </button>
        </div>
      </div>

      <nav className="produtos-nav" aria-label="Categorias de produtos">
        <div className="produtos-nav-inner">
          {categorias.map((cat) => (
            <button
              key={cat.valor}
              type="button"
              className={`produtos-nav-button${categoria === cat.valor ? " ativo" : ""
                }`}
              onClick={() => setCategoria(cat.valor)}
            >
              {cat.rotulo}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};