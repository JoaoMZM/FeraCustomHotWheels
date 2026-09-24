import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePedidos from '../../hooks/usePedidos.js'
import usePedidosFiltro, { infoStatus } from '../../hooks/usePedidosFiltros.js'
import { IconesProdutos } from '../../components/icons/IconesProdutos.jsx';
import './pedidos.page.css';

function formatarPreco(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarData(data) {
  return new Date(data).toLocaleDateString('pt-BR');
}

export default function PedidosPage() {
  const navigate = useNavigate();
  const { pedidos, carregando, erro, buscarPedidos } = usePedidos();
  const { aba, setAba, lista, totais } = usePedidosFiltro(pedidos);
  const [pedidoAberto, setPedidoAberto] = useState(null);

  function alternarDetalhes(id) {
    if (pedidoAberto === id) {
      setPedidoAberto(null);
    } else {
      setPedidoAberto(id);
    }
  }

  return (
    <div className="produtos-page">
      <header className="produtos-header">
        <div className="produtos-header-main">
          <button
            type="button"
            className="produtos-logo"
            onClick={() => navigate('/')}
            aria-label="Ir para produtos"
          >
            <img src="/FeraCustomLogo.jpg" alt="Fera Custom" />
            <strong>FERA CUSTOM</strong>
          </button>

          <div className="produtos-header-actions">
            <button type="button" className="produtos-back" onClick={() => navigate('/')}>
              Voltar para a loja
            </button>
            <button
              type="button"
              className="produtos-icon-button"
              aria-label="Carrinho"
              onClick={() => navigate('/carrinho')}
            >
              <IconesProdutos name="cart" size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="pedidos-content">
        <h1 className="pedidos-titulo">Meus Pedidos</h1>

        <div className="pedidos-abas">
          <button
            className={aba === 'todos' ? 'pedidos-aba ativo' : 'pedidos-aba'}
            onClick={() => setAba('todos')}
          >
            Todos ({totais.todos})
          </button>
          <button
            className={aba === 'abertos' ? 'pedidos-aba ativo' : 'pedidos-aba'}
            onClick={() => setAba('abertos')}
          >
            Em aberto ({totais.abertos})
          </button>
          <button
            className={aba === 'finalizados' ? 'pedidos-aba ativo' : 'pedidos-aba'}
            onClick={() => setAba('finalizados')}
          >
            Finalizados ({totais.finalizados})
          </button>
          <button
            className={aba === 'cancelados' ? 'pedidos-aba ativo' : 'pedidos-aba'}
            onClick={() => setAba('cancelados')}
          >
            Cancelados ({totais.cancelados})
          </button>
        </div>

        {carregando && <p className="pedidos-mensagem">Carregando pedidos...</p>}

        {erro && (
          <div className="pedidos-mensagem">
            <p>{erro}</p>
            <button className="pedidos-botao" onClick={buscarPedidos}>
              Tentar novamente
            </button>
          </div>
        )}

        {!carregando && !erro && lista.length === 0 && (
          <div className="pedidos-mensagem">
            <p>Nenhum pedido encontrado.</p>
            <button className="pedidos-botao" onClick={() => navigate('/')}>
              Ver produtos
            </button>
          </div>
        )}

        {!carregando && !erro && lista.map((pedido) => {
          const status = infoStatus(pedido.status);
          const itens = pedido.itens || [];

          return (
            <div className="pedido-card" key={pedido.id}>
              <div className="pedido-topo">
                <div>
                  <strong>#{pedido.id}</strong>
                  <span className="pedido-data">
                    Data: {formatarData(pedido.data_pedido)}
                  </span>
                </div>
                <span className={'pedido-status pedido-status--' + status.tipo}>
                  {status.texto}
                </span>
              </div>

              <div className="pedido-resumo">
                <p>
                  {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                </p>
                <div className="pedido-resumo-direita">
                  <strong className="pedido-total">{formatarPreco(pedido.total)}</strong>
                  <button
                    className="pedidos-botao"
                    onClick={() => alternarDetalhes(pedido.id)}
                  >
                    {pedidoAberto === pedido.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                  </button>
                </div>
              </div>

              {pedidoAberto === pedido.id && (
                <div className="pedido-itens">
                  {itens.map((item, index) => (
                    <div className="pedido-item" key={index}>
                      {item.imagem && <img src={item.imagem} alt={item.nome} />}
                      <div className="pedido-item-info">
                        <span>{item.nome}</span>
                        <small>Qtd: {item.quantidade}</small>
                      </div>
                      <strong>{formatarPreco(item.preco * item.quantidade)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}