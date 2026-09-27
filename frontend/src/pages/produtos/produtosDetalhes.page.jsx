import React, { useState } from 'react';
import { useProdutoDetalhes } from '../../hooks/produtos/useDetalhesProdutos.js';
import { BreadcrumbProduto } from '../../components/produtos/BreadcrumbProduto.jsx';
import { GaleriaProduto } from '../../components/produtos/GaleriaProduto.jsx';
import { InfoProduto } from '../../components/produtos/InfoProduto.jsx';
import { ProdutosHeader } from '../../components/produtos/ProdutosHeader.jsx';
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

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todos');
  const [precoMin, setPrecoMin] = useState('');
  const [precoMax, setPrecoMax] = useState('');

  const handleSubmitBusca = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const params = new URLSearchParams();
    if (busca) params.append('busca', busca);
    if (categoria && categoria !== 'todos') params.append('categoria', categoria);
    if (precoMin) params.append('precoMin', precoMin);
    if (precoMax) params.append('precoMax', precoMax);

    navigate(`/produtos?${params.toString()}`);
  };

  const handleSelectCategoria = (catValor) => {
    setCategoria(catValor);
    if (catValor === 'todos') {
      navigate('/produtos');
    } else {
      navigate(`/produtos?categoria=${catValor}`);
    }
  };

  const handleLimparFiltros = () => {
    setBusca('');
    setCategoria('todos');
    setPrecoMin('');
    setPrecoMax('');
  };

  if (carregando) {
    return (
      <div className="detalhes-loading">
        <p>Carregando detalhes do produto...</p>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="detalhes-erro">
        <h2>{erro || 'Produto não encontrado'}</h2>
        <button onClick={() => navigate('/produtos')}>Voltar ao Catálogo</button>
      </div>
    );
  }

  return (
    <div className="produtos-detalhes-page">
      <ProdutosHeader
        busca={busca}
        setBusca={setBusca}
        categoria={categoria}
        setCategoria={handleSelectCategoria}

        precoMin={precoMin}
        setPrecoMin={setPrecoMin}
        precoMax={precoMax}
        setPrecoMax={setPrecoMax}
        onLimparFiltros={handleLimparFiltros}
        onSubmitBusca={handleSubmitBusca}
      />

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
    </div>
  );
}