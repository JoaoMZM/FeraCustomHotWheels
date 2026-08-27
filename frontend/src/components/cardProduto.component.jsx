import { useState } from "react";


export default function CardProduto({ produto, onAdicionarCarrinho, onClickCard }) {
  const [carregando, setCarregando] = useState(false);
  const [adicionado, setAdicionado] = useState(false);

  const {
    nome_produto,
    descricao_produto,
    preco_produto,
    estoque_produto,
    cor,
    limitado,
    modelo,
    imagem_produto,
    categoria,
  } = produto || {};

  const semEstoque = !estoque_produto || estoque_produto <= 0;

  const precoFormatado =
    typeof preco_produto === "number"
      ? preco_produto.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
      : null;

  const handleAdicionar = async (e) => {
    e.stopPropagation();

    if (semEstoque || !onAdicionarCarrinho) return;

    setCarregando(true);

    try {
      await onAdicionarCarrinho(produto);

      setAdicionado(true);
      setTimeout(() => setAdicionado(false), 1500);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className={`produto-card${semEstoque ? " produto-card-indisponivel" : ""}`}
      onClick={() => onClickCard && onClickCard(produto)}
    >
      <div className="produto-card-imagem">
        {imagem_produto ? (
          <img src={imagem_produto} alt={nome_produto} loading="lazy" />
        ) : (
          <div className="produto-card-imagem-placeholder">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="7" width="18" height="10" rx="2" />
              <circle cx="7.5" cy="17" r="1.8" />
              <circle cx="16.5" cy="17" r="1.8" />
              <path d="M3 12h18" />
            </svg>
          </div>
        )}

        {limitado && (
          <span className="produto-card-badge produto-card-badge-limitado">
            Edição Limitada
          </span>
        )}

        {semEstoque && (
          <span className="produto-card-badge produto-card-badge-indisponivel">
            Esgotado
          </span>
        )}
      </div>

      <div className="produto-card-info">
        {categoria?.nome_categoria && (
          <span className="produto-card-categoria">
            {categoria.nome_categoria}
          </span>
        )}

        <h3 className="produto-card-nome">{nome_produto}</h3>

        {descricao_produto && (
          <p className="produto-card-descricao">{descricao_produto}</p>
        )}

        <div className="produto-card-detalhes">
          {modelo && (
            <span className="produto-card-detalhe">
              <strong>Modelo:</strong> {modelo}
            </span>
          )}

          {cor && (
            <span className="produto-card-detalhe">
              <strong>Cor:</strong> {cor}
            </span>
          )}
        </div>

        <div className="produto-card-rodape">
          <span className="produto-card-preco">{precoFormatado}</span>

          <button
            type="button"
            className="btn-adicionar-produto"
            disabled={semEstoque || carregando}
            onClick={handleAdicionar}
          >
            {carregando ? (
              <span className="spinner" aria-hidden="true"></span>
            ) : adicionado ? (
              "Adicionado!"
            ) : semEstoque ? (
              "Esgotado"
            ) : (
              <>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Adicionar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
