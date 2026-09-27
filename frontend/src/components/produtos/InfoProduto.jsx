import React from 'react';

export function InfoProduto({
  produto,
  quantidade,
  setQuantidade,
  handleAdicionar,
  enviando,
  adicionado,
}) {
  return (
    <div className="detalhes-info">
      <span className="categoria-tag">{produto.categoria || 'Geral'}</span>
      <h1>{produto.nome}</h1>
      {produto.sku && <small className="sku">SKU: {produto.sku}</small>}

      <div className="preco-container">
        <span className="preco-atual">
          {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      <p className="descricao">{produto.descricao || 'Sem descrição cadastrada.'}</p>

      <div className="acoes-compra">
        <div className="qtd-selector">
          <button onClick={() => setQuantidade((q) => Math.max(1, q - 1))}>-</button>
          <span>{quantidade}</span>
          <button onClick={() => setQuantidade((q) => Math.min(produto.estoque || 99, q + 1))}>+</button>
        </div>

        <button
          className="btn-add-carrinho"
          onClick={handleAdicionar}
          disabled={enviando || produto.estoque <= 0}
        >
          {enviando ? 'Adicionando...' : adicionado ? 'Adicionado!' : 'Adicionar ao Carrinho'}
        </button>
      </div>
    </div>
  );
}