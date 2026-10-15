import { useContext } from 'react';
import { CarrinhoContext } from '../../contexts/CarrinhoContext.jsx';

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext);

  if (!contexto) {
    throw new Error('useCarrinho precisa estar dentro de <CarrinhoProvider>.');
  }

  return contexto;
}