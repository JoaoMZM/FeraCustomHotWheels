import { useEffect, useRef, useState } from 'react';
import './chat.css';

const LIMITE = 1000;

const formatarHora = (valor) => {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return '';
  const hoje = new Date().toDateString() === data.toDateString();
  return hoje
    ? data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : data.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
};


export function ChatThread({ mensagens, meuLado, carregando, enviando, erro, onEnviar, textoVazio, nomeOutroLado }) {
  const [texto, setTexto] = useState('');
  const fimRef = useRef(null);
  const listaRef = useRef(null);
  const quantidadeAnterior = useRef(0);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const primeiraCarga = quantidadeAnterior.current === 0;
    const pertoDoFim = lista.scrollHeight - lista.scrollTop - lista.clientHeight < 120;
    if (mensagens.length > quantidadeAnterior.current && (primeiraCarga || pertoDoFim)) {
      fimRef.current?.scrollIntoView({ block: 'end' });
    }
    quantidadeAnterior.current = mensagens.length;
  }, [mensagens]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || enviando) return;
    const ok = await onEnviar(texto);
    if (ok) {
      setTexto('');
      setTimeout(() => fimRef.current?.scrollIntoView({ block: 'end' }), 0);
    }
  };

  const aoTeclar = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) enviar(e);
  };

  return (
    <div className="chat-thread">
      <div className="chat-lista" ref={listaRef} role="log" aria-live="polite">
        {carregando && mensagens.length === 0 && <p className="chat-vazio">Carregando conversa...</p>}
        {!carregando && mensagens.length === 0 && <p className="chat-vazio">{textoVazio}</p>}

        {mensagens.map((m) => (
          <div key={m.id} className={`chat-balao-linha ${m.remetente === meuLado ? 'chat-balao-linha--meu' : ''}`}>
            <div className={`chat-balao ${m.remetente === meuLado ? 'chat-balao--meu' : 'chat-balao--outro'}`}>
              {m.remetente !== meuLado && nomeOutroLado && <span className="chat-balao-autor">{nomeOutroLado}</span>}
              <p>{m.texto}</p>
              <time dateTime={m.criada_em}>{formatarHora(m.criada_em)}</time>
            </div>
          </div>
        ))}
        <div ref={fimRef} />
      </div>

      {erro && <div className="chat-erro" role="alert">{erro}</div>}

      <form className="chat-form" onSubmit={enviar}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value.slice(0, LIMITE))}
          onKeyDown={aoTeclar}
          placeholder="Escreva sua mensagem..."
          rows={1}
          aria-label="Mensagem"
        />
        <button type="submit" disabled={enviando || !texto.trim()}>
          {enviando ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
      {texto.length > LIMITE - 100 && <small className="chat-contador">{texto.length}/{LIMITE}</small>}
    </div>
  );
}
