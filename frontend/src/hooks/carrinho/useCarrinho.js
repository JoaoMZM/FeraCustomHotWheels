import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'carrinho';

function carregarCarrinho() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useCarrinho() {
  const [itens, setItens] = useState(carregarCarrinho);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  }, [itens]);

  const adicionarItem = useCallback((produto, quantidade = 1) => {
    setItens((atual) => {
      const existente = atual.find((item) => item.id === produto.id);
      if (existente) {
        return atual.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      return [...atual, { ...produto, quantidade }];
    });
  }, []);

  const removerItem = useCallback((produtoId) => {
    setItens((atual) => atual.filter((item) => item.id !== produtoId));
  }, []);

  const atualizarQuantidade = useCallback((produtoId, quantidade) => {
    if (quantidade <= 0) {
      setItens((atual) => atual.filter((item) => item.id !== produtoId));
      return;
    }
    setItens((atual) =>
      atual.map((item) =>
        item.id === produtoId ? { ...item, quantidade } : item
      )
    );
  }, []);

  const limparCarrinho = useCallback(() => {
    setItens([]);
  }, []);

  const totalItens = useMemo(
    () => itens.reduce((soma, item) => soma + item.quantidade, 0),
    [itens]
  );

  const totalPreco = useMemo(
    () => itens.reduce((soma, item) => soma + item.preco * item.quantidade, 0),
    [itens]
  );

  return {
    itens,
    adicionarItem,
    removerItem,
    atualizarQuantidade,
    limparCarrinho,
    totalItens,
    totalPreco,
  };
}