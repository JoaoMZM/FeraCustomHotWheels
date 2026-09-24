import { useState, useEffect } from 'react';
import { listarPedidos } from '../../src/services/api.js';

export default function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarPedidos();
  }, []);

  async function buscarPedidos() {
    try {
      setCarregando(true);
      setErro('');

      const dados = await listarPedidos();
      setPedidos(Array.isArray(dados) ? dados : dados.pedidos || []);
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar seus pedidos.');
    } finally {
      setCarregando(false);
    }
  }

  return { pedidos, carregando, erro, buscarPedidos };
}