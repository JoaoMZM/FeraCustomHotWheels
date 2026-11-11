import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { sincronizarPagamento } from '../../services/api.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { PaginaLoja } from '../../components/common/PaginaLoja.jsx';
import './pagamentoRetorno.page.css';

const TELAS = {
  aprovado: { icone: '✓', titulo: 'Pagamento aprovado!', texto: 'Recebemos seu pagamento. Seu pedido já está em preparo.', tom: 'ok' },
  analise: { icone: '…', titulo: 'Pagamento em análise', texto: 'Assim que for confirmado, o status do pedido é atualizado automaticamente. Pix e boleto podem levar alguns minutos ou horas.', tom: 'espera' },
  recusado: { icone: '!', titulo: 'Pagamento não aprovado', texto: 'O pagamento foi recusado. Você pode tentar novamente com outro meio de pagamento em "Meus pedidos".', tom: 'erro' },
  indefinido: { icone: '?', titulo: 'Ainda não há pagamento confirmado', texto: 'Se você acabou de pagar, aguarde um instante e verifique de novo.', tom: 'espera' },
};

const escolherTela = (statusPagamento) => {
  if (statusPagamento === 'Aprovado') return TELAS.aprovado;
  if (statusPagamento === 'Recusado' || statusPagamento === 'Cancelado') return TELAS.recusado;
  if (statusPagamento === 'Pendente' || statusPagamento === 'Em análise') return TELAS.analise;
  return TELAS.indefinido;
};

export default function PagamentoRetornoPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { logado } = useAuth();
  const idPedido = params.get('external_reference');

  const [estado, setEstado] = useState({ carregando: true, statusPagamento: null, erro: '' });

  const verificar = useCallback(async () => {
    setEstado((e) => ({ ...e, carregando: true, erro: '' }));
    try {
      const dados = await sincronizarPagamento(idPedido);
      setEstado({ carregando: false, statusPagamento: dados.statusPagamento, erro: '' });
    } catch (err) {
      setEstado({ carregando: false, statusPagamento: null, erro: err.message || 'Não foi possível verificar o pagamento.' });
    }
  }, [idPedido]);

  useEffect(() => {
    if (logado === true && idPedido) verificar();
  }, [logado, idPedido, verificar]);

  if (!idPedido) {
    return (
      <PaginaLoja largura="estreito">
        <div className="pg-card pg-card--erro">
          <h1>Pedido não identificado</h1>
          <button type="button" onClick={() => navigate('/pedidosProdutos')}>Ver meus pedidos</button>
        </div>
      </PaginaLoja>
    );
  }

  if (logado === false) {
    return (
      <PaginaLoja largura="estreito">
        <div className="pg-card">
          <h1>Entre para ver seu pagamento</h1>
          <button type="button" onClick={() => navigate('/login')}>Entrar</button>
        </div>
      </PaginaLoja>
    );
  }

  if (estado.carregando) {
    return (
      <PaginaLoja largura="estreito">
        <div className="pg-card"><p>Confirmando seu pagamento...</p></div>
      </PaginaLoja>
    );
  }

  const tela = estado.erro ? null : escolherTela(estado.statusPagamento);

  return (
    <PaginaLoja largura="estreito">
      <div className={`pg-card pg-card--${tela ? tela.tom : 'erro'}`}>
        <div className="pg-icone" aria-hidden="true">{tela ? tela.icone : '!'}</div>
        <h1>{tela ? tela.titulo : 'Erro ao verificar'}</h1>
        <p>{tela ? tela.texto : estado.erro}</p>
        <p className="pg-pedido">Pedido #{idPedido}</p>

        <div className="pg-acoes">
          <button type="button" onClick={() => navigate('/pedidosProdutos')}>Ver meus pedidos</button>
          {(!tela || tela.tom !== 'ok') && (
            <button type="button" className="pg-secundario" onClick={verificar}>Verificar novamente</button>
          )}
          <button type="button" className="pg-secundario" onClick={() => navigate('/')}>Voltar à loja</button>
        </div>
      </div>
    </PaginaLoja>
  );
}
