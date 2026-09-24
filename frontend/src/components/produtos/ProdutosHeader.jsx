import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { IconesProdutos } from "../icons/IconesProdutos";

export const ProdutosHeader = ({
  busca,
  setBusca,
  categoria,
  setCategoria,
  categorias,
  precoMin,
  setPrecoMin,
  precoMax,
  setPrecoMax,
  totalCarrinho,
  onSubmitBusca,
  onLimparFiltros,
}) => {
  const navigate = useNavigate();

  const [menuAberto, setMenuAberto] = useState(false);
  const [posicao, setPosicao] = useState({ top: 0, left: 0 });

  const botaoFiltroRef = useRef(null);
  const painelFiltroRef = useRef(null);

  const abrirFiltro = () => {
    if (botaoFiltroRef.current) {
      const rect = botaoFiltroRef.current.getBoundingClientRect();
      setPosicao({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setMenuAberto((prev) => !prev);
  };

  useEffect(() => {
    const handleClickFora = (e) => {
      if (!document.body.contains(e.target)) return;

      const clicouNoBotao = botaoFiltroRef.current?.contains(e.target);
      const clicouNoPainel = painelFiltroRef.current?.contains(e.target);

      if (!clicouNoBotao && !clicouNoPainel) {
        setMenuAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const selecionarFaixaPreco = (min, max) => {
    setPrecoMin(min);
    setPrecoMax(max);
  };

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
          <button
            type="button"
            className="produtos-account"
            onClick={() => navigate("/pedidosProdutos")}
          >

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

          <button
            type="button"
            ref={botaoFiltroRef}
            className={`produtos-nav-button filtro${menuAberto ? " ativo" : ""
              }`}
            onClick={abrirFiltro}
            aria-expanded={menuAberto}
          >
            Filtrar produtos
            <IconesProdutos name="chevron" size={12} />
          </button>
        </div>
      </nav>

      {menuAberto &&
        createPortal(
          <div
            ref={painelFiltroRef}
            className="nav-mega-painel"
            style={{
              position: "fixed",
              top: posicao.top,
              left: posicao.left,
              zIndex: 9999,
            }}
          >

            <div className="nav-mega-header">
              <span>Filtrar produtos</span>

              <button
                type="button"
                className="nav-mega-fechar"
                onClick={() => setMenuAberto(false)}
                aria-label="Fechar filtros"
              >
                <IconesProdutos name="close" size={16} />
              </button>
            </div>

            <div className="nav-mega-corpo">

              <div className="nav-mega-coluna">
                <strong>Categoria</strong>

                <div className="nav-mega-lista">
                  {categorias.map((cat) => (
                    <button
                      key={cat.valor}
                      type="button"
                      className={`nav-mega-item${categoria === cat.valor ? " ativo" : ""
                        }`}
                      onClick={() => setCategoria(cat.valor)}
                    >
                      {cat.rotulo}

                      {categoria === cat.valor && (
                        <IconesProdutos name="check" size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="nav-mega-divisor" aria-hidden="true" />

              <div className="nav-mega-coluna">
                <strong>Faixa de preço</strong>

                <div className="nav-mega-chips">
                  <button
                    type="button"
                    className={`nav-mega-chip${precoMin === "" && precoMax === "50" ? " ativo" : ""
                      }`}
                    onClick={() => selecionarFaixaPreco("", "50")}
                  >
                    Até R$ 50
                  </button>

                  <button
                    type="button"
                    className={`nav-mega-chip${precoMin === "50" && precoMax === "100" ? " ativo" : ""
                      }`}
                    onClick={() => selecionarFaixaPreco("50", "100")}
                  >
                    R$ 50 – R$ 100
                  </button>

                  <button
                    type="button"
                    className={`nav-mega-chip${precoMin === "100" && precoMax === "200" ? " ativo" : ""
                      }`}
                    onClick={() => selecionarFaixaPreco("100", "200")}
                  >
                    R$ 100 – R$ 200
                  </button>

                  <button
                    type="button"
                    className={`nav-mega-chip${precoMin === "200" && precoMax === "" ? " ativo" : ""
                      }`}
                    onClick={() => selecionarFaixaPreco("200", "")}
                  >
                    Acima de R$ 200
                  </button>
                </div>

                <span className="nav-mega-label-custom">
                  Ou defina um valor exato
                </span>

                <div className="nav-mega-preco-custom">
                  <div className="nav-mega-preco-input">
                    <span>R$</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Mín"
                      value={precoMin}
                      onChange={(e) => setPrecoMin(e.target.value)}
                    />
                  </div>

                  <span className="nav-mega-preco-ate">até</span>

                  <div className="nav-mega-preco-input">
                    <span>R$</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Máx"
                      value={precoMax}
                      onChange={(e) => setPrecoMax(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="nav-mega-rodape">
              <button
                type="button"
                className="nav-mega-limpar"
                onClick={() => {
                  onLimparFiltros();
                  setMenuAberto(false);
                }}
              >
                Limpar todos os filtros
              </button>

              <button
                type="button"
                className="nav-mega-aplicar"
                onClick={() => setMenuAberto(false)}
              >
                Ver resultados
              </button>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};