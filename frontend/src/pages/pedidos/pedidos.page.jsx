import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePedidos from '../../hooks/pedidos/usePedidos.js'
import usePedidosFiltro, { infoStatus } from '../../hooks/pedidos/usePedidosFiltros.js'
import { PaginaLoja } from '../../components/common/PaginaLoja.jsx';
import './pedidos.page.css';
import { criarCheckoutPagamento } from '../../services/api.js';

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
  const [pagandoId, setPagandoId] = useState(null);
  const [erroPagamento, setErroPagamento] = useState('');

  function alternarDetalhes(id) {
    if (pedidoAberto === id) {
      setPedidoAberto(null);
    } else {
      setPedidoAberto(id);
    }
  }

  async function pagar(idPedido) {
    setErroPagamento('');
    setPagandoId(idPedido);
    try {
      const { urlPagamento } = await criarCheckoutPagamento(idPedido);
      window.location.href = urlPagamento;
    } catch (err) {
      setErroPagamento(err.message || 'Não foi possível abrir o pagamento.');
      setPagandoId(null);
    }
  }

  return (
    <PaginaLoja largura="medio" titulo="Meus Pedidos">
      <div className="pedidos-conteudo">
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

        {erroPagamento && <p className="pedidos-mensagem" role="alert">{erroPagamento}</p>}

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
                  {pedido.status === 'Pendente' && (
                    <button
                      className="pedidos-botao pedidos-botao--pagar"
                      onClick={() => pagar(pedido.id)}
                      disabled={pagandoId === pedido.id}
                    >
                      {pagandoId === pedido.id ? 'Abrindo...' : 'Pagar agora'}
                    </button>
                  )}
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
      </div>
    </PaginaLoja>
  );
}
