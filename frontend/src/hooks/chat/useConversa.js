import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Mantém uma conversa atualizada por polling incremental (só busca mensagens novas).
 *
 * @param {object}   opts
 * @param {string}   opts.chave      
 * @param {boolean}  opts.ativo      
 * @param {Function} opts.carregar   
 * @param {Function} opts.enviar     
 * @param {number}   opts.intervalo  
 */
export function useConversa({ chave, ativo = true, carregar, enviar, intervalo = 4000 }) {
  const [mensagens, setMensagens] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const ultimoId = useRef(0);
  const carregarRef = useRef(carregar);
  const enviarRef = useRef(enviar);
  carregarRef.current = carregar;
  enviarRef.current = enviar;

  const acrescentar = useCallback((novas) => {
    if (!novas || novas.length === 0) return;
    setMensagens((atuais) => {
      const conhecidas = new Set(atuais.map((m) => m.id));
      const realmenteNovas = novas.filter((m) => !conhecidas.has(m.id));
      if (realmenteNovas.length === 0) return atuais;
      const todas = [...atuais, ...realmenteNovas];
      ultimoId.current = Math.max(ultimoId.current, ...todas.map((m) => m.id));
      return todas;
    });
  }, []);

  useEffect(() => {
    setMensagens([]);
    setErro('');
    setCarregando(true);
    ultimoId.current = 0;

    if (!ativo || !chave) {
      setCarregando(false);
      return undefined;
    }

    let cancelado = false;
    let buscando = false;

    const buscar = async () => {
      if (buscando || cancelado) return;
      buscando = true;
      try {
        const dados = await carregarRef.current(ultimoId.current);
        if (!cancelado) acrescentar(dados?.mensagens);
      } catch {
      } finally {
        buscando = false;
        if (!cancelado) setCarregando(false);
      }
    };

    buscar();

    const timer = setInterval(() => {
      if (!document.hidden) buscar();
    }, intervalo);
    const aoVoltar = () => { if (!document.hidden) buscar(); };
    document.addEventListener('visibilitychange', aoVoltar);

    return () => {
      cancelado = true;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', aoVoltar);
    };
  }, [chave, ativo, intervalo, acrescentar]);

  const enviarMensagem = useCallback(async (texto) => {
    const limpo = texto.trim();
    if (!limpo || enviando) return false;

    setEnviando(true);
    setErro('');
    try {
      const dados = await enviarRef.current(limpo);
      acrescentar([dados.mensagem]);
      return true;
    } catch (e) {
      setErro(e.message || 'Não foi possível enviar a mensagem.');
      return false;
    } finally {
      setEnviando(false);
    }
  }, [enviando, acrescentar]);

  return { mensagens, carregando, enviando, erro, enviarMensagem };
}
