import { IconesProdutos } from "../icons/IconesProdutos";

const formatarPreco = (valor) =>
  Number(valor || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const estoqueInfo = (estoque) => {
  if (estoque <= 0) {
    return {
      texto: "Esgotado",
      classe: "produto-estoque produto-estoque--esgotado",
    };
  }

  if (estoque <= 5) {
    return {
      texto: `Restam ${estoque} un.`,
      classe: "produto-estoque produto-estoque--baixo",
    };
  }

  return {
    texto: "Em estoque",
    classe: "produto-estoque produto-estoque--disponivel",
  };
};

export const ProdutoCard = ({
  produto,
  quantidade,
  onAlterarQuantidade,
  onAdicionarCarrinho,
  enviando,
  adicionado,
  favorito,
  onToggleFavorito,
}) => {
  const estoque = estoqueInfo(produto.estoque);
  const esgotado = produto.estoque <= 0;
  const temDesconto =
    produto.precoOriginal && produto.precoOriginal > produto.preco;

  return (
    <article className="produto-card">
      <div className="produto-card-imagem">
        {produto.imagemUrl ? (
          <img src={produto.imagemUrl} alt={produto.nome} />
        ) : (
          <div className="produto-card-imagem-placeholder">
            <IconesProdutos name="box" size={38} />
          </div>
        )}

        <button
          type="button"
          className={`produto-card-favorito${favorito ? " ativo" : ""}`}
          onClick={() => onToggleFavorito(produto.id)}
          aria-label="Adicionar aos favoritos"
        >
          <IconesProdutos name="heart" size={18} />
        </button>

        {produto.categoria && (
          <span className="produto-card-categoria">{produto.categoria}</span>
        )}

        <span className={estoque.classe}>{estoque.texto}</span>
      </div>

      <div className="produto-card-corpo">
        {produto.sku && (
          <span className="produto-card-sku">SKU #{produto.sku}</span>
        )}

        <span className="produto-card-nome">{produto.nome}</span>

        <div className="produto-card-preco-linha">
          {temDesconto && (
            <span className="produto-card-preco-original">
              {formatarPreco(produto.precoOriginal)}
            </span>
          )}
          <span className="produto-card-preco">
            {formatarPreco(produto.preco)}
          </span>
        </div>

        {!esgotado && (
          <div
            className="produto-card-qtd"
            aria-label={`Quantidade de ${produto.nome}`}
          >
            <button
              type="button"
              onClick={() =>
                onAlterarQuantidade(produto.id, -1, produto.estoque)
              }
              disabled={quantidade <= 1}
            >
              <IconesProdutos name="minus" size={14} />
            </button>

            <span>{quantidade}</span>

            <button
              type="button"
              onClick={() =>
                onAlterarQuantidade(produto.id, 1, produto.estoque)
              }
              disabled={quantidade >= produto.estoque}
            >
              <IconesProdutos name="plus" size={14} />
            </button>
          </div>
        )}

        <button
          type="button"
          className={`btn-add-carrinho${adicionado ? " adicionado" : ""}`}
          disabled={esgotado || enviando}
          onClick={() => onAdicionarCarrinho(produto)}
        >
          {enviando ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Adicionando...
            </>
          ) : adicionado ? (
            <>
              Adicionado!
              <IconesProdutos name="check" size={16} />
            </>
          ) : esgotado ? (
            "Produto Esgotado"
          ) : (
            <>
              Comprar
              <IconesProdutos name="cart" size={16} />
            </>
          )}
        </button>
      </div>
    </article>
  );
};