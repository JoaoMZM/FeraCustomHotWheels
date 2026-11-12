import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/admin/AdminHeader.jsx';
import { ChatThread } from '../../components/chat/ChatThread.jsx';
import { useConversa } from '../../hooks/chat/useConversa.js';
import {
  listarConversasAdmin,
  buscarMensagensAdmin,
  enviarMensagemAdmin,
} from '../../services/api.js';
import { montarUrlImagem } from '../../utils/produtos.js';
import './admin-produtos.page.css';
import './admin.mensagens.page.css';

const formatarData = (valor) =>
  new Date(valor).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

export default function AdminMensagensPage() {
  const navigate = useNavigate();
  const [conversas, setConversas] = useState([]);
  const [carregandoLista, setCarregandoLista] = useState(true);
  const [erroLista, setErroLista] = useState('');
  const [selecionadaId, setSelecionadaId] = useState(null);

  const carregarLista = useCallback(async () => {
    try {
      const dados = await listarConversasAdmin();
      setConversas(dados.conversas || []);
      setErroLista('');
    } catch (err) {
      setErroLista(err.message || 'Não foi possível carregar as conversas.');
    } finally {
      setCarregandoLista(false);
    }
  }, []);

  useEffect(() => {
    carregarLista();
    const timer = setInterval(() => { if (!document.hidden) carregarLista(); }, 6000);
    return () => clearInterval(timer);
  }, [carregarLista]);

  const selecionada = conversas.find((c) => c.id === selecionadaId) || null;

  const { mensagens, carregando, enviando, erro, enviarMensagem } = useConversa({
    chave: selecionadaId,
    ativo: Boolean(selecionadaId),
    carregar: (apos) => buscarMensagensAdmin(selecionadaId, apos),
    enviar: async (texto) => {
      const dados = await enviarMensagemAdmin(selecionadaId, texto);
      carregarLista();
      return dados;
    },
    intervalo: 3000,
  });

  useEffect(() => {
    if (!selecionadaId) return;
    setConversas((lista) => lista.map((c) => (c.id === selecionadaId ? { ...c, nao_lidas: 0 } : c)));
  }, [selecionadaId, mensagens.length]);

  return (
    <div className="admin-produtos-page">
      <AdminHeader />

      <main className="admin-content admin-msg-layout">
        <aside className="admin-msg-lista" aria-label="Conversas">
          {carregandoLista && <p className="admin-msg-vazio">Carregando...</p>}
          {erroLista && <p className="admin-msg-vazio" role="alert">{erroLista}</p>}
          {!carregandoLista && !erroLista && conversas.length === 0 && (
            <p className="admin-msg-vazio">Nenhuma conversa ainda. As perguntas dos clientes nas páginas dos produtos aparecem aqui.</p>
          )}

          {conversas.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`admin-msg-item ${c.id === selecionadaId ? 'ativo' : ''}`}
              onClick={() => setSelecionadaId(c.id)}
            >
              <img src={montarUrlImagem(c.imagem_produto) || '/placeholder.jpg'} alt="" />
              <span className="admin-msg-item-texto">
                <strong>{c.nome_cliente}</strong>
                <small>{c.nome_produto}</small>
                <span className="admin-msg-previa">{c.ultima_mensagem}</span>
              </span>
              <span className="admin-msg-item-meta">
                <small>{formatarData(c.ultima_mensagem_em)}</small>
                {Number(c.nao_lidas) > 0 && <span className="admin-msg-badge">{c.nao_lidas}</span>}
              </span>
            </button>
          ))}
        </aside>

        <section className="admin-msg-conversa">
          {selecionada ? (
            <>
              <header className="admin-msg-conversa-topo">
                <strong>{selecionada.nome_cliente}</strong>
                <button type="button" onClick={() => navigate(`/produtos/${selecionada.id_produto}`)}>
                  {selecionada.nome_produto} ↗
                </button>
              </header>
              <ChatThread
                mensagens={mensagens}
                meuLado="vendedor"
                carregando={carregando}
                enviando={enviando}
                erro={erro}
                onEnviar={enviarMensagem}
                nomeOutroLado={selecionada.nome_cliente}
                textoVazio="Sem mensagens."
              />
            </>
          ) : (
            <p className="admin-msg-vazio admin-msg-vazio--centro">Selecione uma conversa.</p>
          )}
        </section>
      </main>
    </div>
  );
}
