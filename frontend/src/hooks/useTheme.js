import { useState, useEffect } from 'react';

const CHAVE = 'tema';

export function temaInicial() {
  const salvo = localStorage.getItem(CHAVE);
  if (salvo === 'claro' || salvo === 'escuro') return salvo;

  // se nunca escolheu, usa a preferência do sistema operacional
  const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefereEscuro ? 'escuro' : 'claro';
}

// Aplica o tema na tag <html> (usado pelo useTheme e na carga do app)
export function aplicarTema(tema) {
  if (tema === 'escuro') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export default function useTheme() {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    aplicarTema(tema);
    localStorage.setItem(CHAVE, tema);
  }, [tema]);

  function alternarTema() {
    setTema((atual) => (atual === 'escuro' ? 'claro' : 'escuro'));
  }

  return { tema, alternarTema };
}
