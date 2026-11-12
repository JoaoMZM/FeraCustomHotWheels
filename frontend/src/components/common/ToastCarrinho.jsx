import { useEffect } from 'react';
import './ToastCarrinho.css';

export function ToastCarrinho({ mensagem, tipo = 'sucesso', chave, onFechar, duracao = 3500 }) {
  useEffect(() => {
    if (!mensagem) return undefined;
    const timer = setTimeout(onFechar, duracao);
    return () => clearTimeout(timer);
  }, [mensagem, chave, onFechar, duracao]);

  if (!mensagem) return null;

  return (
    <div className={`toast-carrinho toast-carrinho--${tipo}`} role="status" aria-live="polite">
      <span>{mensagem}</span>
      <button type="button" onClick={onFechar} aria-label="Fechar aviso">
        ×
      </button>
    </div>
  );
}
