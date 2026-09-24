import { useState, useEffect, useCallback } from 'react';

const API_BASE = '/api';

export function useProdutos({ busca = '', categoria = '' } = {}) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const buscarProdutos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (busca) params.set('busca', busca);
      if (categoria) params.set('categoria', categoria);

      const res = await fetch(`${API_BASE}/produtos?${params.toString()}`);
      if (!res.ok) throw new Error('Não foi possível carregar os produtos');
      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      setError(err.message);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }, [busca, categoria]);

  useEffect(() => {
    buscarProdutos();
  }, [buscarProdutos]);

  return { produtos, loading, error, recarregar: buscarProdutos };
}

export function useProduto(id) {
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let ativo = true;

    async function buscar() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/produtos/${id}`);
        if (!res.ok) throw new Error('Produto não encontrado');
        const data = await res.json();
        if (ativo) setProduto(data);
      } catch (err) {
        if (ativo) setError(err.message);
      } finally {
        if (ativo) setLoading(false);
      }
    }

    buscar();
    return () => {
      ativo = false;
    };
  }, [id]);

  return { produto, loading, error };
}