import React from 'react';
import { useProdutoDetalhes } from '../../hooks/produtos/useDetalhesProdutos.js';
import { BreadcrumbProduto } from '../../components/produtos/BreadcrumbProduto.jsx';
import { GaleriaProduto } from '../../components/produtos/GaleriaProduto.jsx';
import { InfoProduto } from '../../components/produtos/InfoProduto.jsx';
import { PaginaLoja } from '../../components/common/PaginaLoja.jsx';
import { ChatProduto } from '../../components/chat/ChatProduto.jsx';
import './produtosDetalhes.page.css';

export default function ProdutosDetalhesPage() {
  const {
    produto,
    carregando,
    erro,
    imagemAtiva,
    setImagemAtiva,
    quantidade,
    setQuantidade,
    adicionado,
    enviando,
    handleAdicionar,
    navigate,
  } = useProdutoDetalhes();

  if (carregando) {
    return (
      <PaginaLoja largura="medio">
        <p className="detalhes-loading">Carregando detalhes do produto...</p>
      </PaginaLoja>
    );
  }

  if (erro || !produto) {
    return (
      <PaginaLoja largura="medio">
        <div className="detalhes-erro">
          <h2>{erro || 'Produto não encontrado'}</h2>
          <button className="btn btn-primario" onClick={() => navigate('/')}>Voltar ao Catálogo</button>
        </div>
      </PaginaLoja>
    );
  }

  return (
    <PaginaLoja>
      <div className="produtos-detalhes-page">
        <BreadcrumbProduto nomeProduto={produto.nome} />

        <div className="detalhes-grid">
          <GaleriaProduto
            imagens={produto.imagens}
            imagemAtiva={imagemAtiva}
            setImagemAtiva={setImagemAtiva}
            nomeProduto={produto.nome}
          />

          <InfoProduto
            produto={produto}
            quantidade={quantidade}
            setQuantidade={setQuantidade}
            handleAdicionar={handleAdicionar}
            enviando={enviando}
            adicionado={adicionado}
          />
        </div>

        <ChatProduto idProduto={produto.id} nomeProduto={produto.nome} />
      </div>
    </PaginaLoja>
  );
}
