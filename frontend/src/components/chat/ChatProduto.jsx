import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useConversa } from '../../hooks/chat/useConversa.js';
import { buscarConversaDoProduto, enviarMensagemProduto } from '../../services/api.js';
import { ChatThread } from './ChatThread.jsx';
import './chat.css';

export function ChatProduto({ idProduto, nomeProduto }) {
  const navigate = useNavigate();
  const { logado } = useAuth();

  const { mensagens, carregando, enviando, erro, enviarMensagem } = useConversa({
    chave: idProduto,
    ativo: logado === true,
    carregar: (apos) => buscarConversaDoProduto(idProduto, apos),
    enviar: (texto) => enviarMensagemProduto(idProduto, texto),
  });

  return (
    <section className="chat-produto" aria-labelledby="chat-titulo">
      <header className="chat-produto-topo">
        <div>
          <h2 id="chat-titulo">Fale com o vendedor</h2>
          <p>Tire dúvidas sobre <strong>{nomeProduto}</strong> antes de comprar.</p>
        </div>
      </header>

      {logado === true ? (
        <ChatThread
          mensagens={mensagens}
          meuLado="cliente"
          carregando={carregando}
          enviando={enviando}
          erro={erro}
          onEnviar={enviarMensagem}
          nomeOutroLado="Vendedor"
          textoVazio="Nenhuma mensagem ainda. Pergunte sobre disponibilidade, personalização, prazo..."
        />
      ) : (
        <div className="chat-login">
          <p>{logado === null ? 'Verificando sua sessão...' : 'Entre na sua conta para conversar com o vendedor.'}</p>
          {logado === false && (
            <button type="button" onClick={() => navigate('/login')}>Entrar</button>
          )}
        </div>
      )}
    </section>
  );
}
