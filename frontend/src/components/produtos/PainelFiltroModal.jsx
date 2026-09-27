import { createPortal } from "react-dom";
import { IconesProdutos } from "../icons/IconesProdutos";

export const PainelFiltroModal = ({
  painelFiltroRef,
  posicao,
  setMenuAberto,
  listaCategorias,
  categoria,
  setCategoria,
  precoMin,
  setPrecoMin,
  precoMax,
  setPrecoMax,
  selecionarFaixaPreco,
  onLimparFiltros,
}) => {
  return createPortal(
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
            {listaCategorias.map((cat) => (
              <button
                key={cat.valor}
                type="button"
                className={`nav-mega-item${categoria === cat.valor ? " ativo" : ""}`}
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
              className={`nav-mega-chip${precoMin === "" && precoMax === "50" ? " ativo" : ""}`}
              onClick={() => selecionarFaixaPreco("", "50")}
            >
              Até R$ 50
            </button>

            <button
              type="button"
              className={`nav-mega-chip${precoMin === "50" && precoMax === "100" ? " ativo" : ""}`}
              onClick={() => selecionarFaixaPreco("50", "100")}
            >
              R$ 50 – R$ 100
            </button>

            <button
              type="button"
              className={`nav-mega-chip${precoMin === "100" && precoMax === "200" ? " ativo" : ""}`}
              onClick={() => selecionarFaixaPreco("100", "200")}
            >
              R$ 100 – R$ 200
            </button>

            <button
              type="button"
              className={`nav-mega-chip${precoMin === "200" && precoMax === "" ? " ativo" : ""}`}
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
  );
};