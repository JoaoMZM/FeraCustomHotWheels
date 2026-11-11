import { useState, useEffect } from 'react';
import { listarPedidos } from '../../services/api.js';
import { montarUrlImagem } from '../../utils/produtos.js';

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
      const lista = Array.isArray(dados) ? dados : dados.pedidos || [];
      setPedidos(
        lista.map((pedido) => ({
          ...pedido,
          itens: (pedido.itens || []).map((item) => ({
            ...item,
            imagem: item.imagem || montarUrlImagem(item.imagem_produto),
          })),
        }))
      );
    } catch (error) {
      setErro(error.message || 'Não foi possível carregar seus pedidos.');
    } finally {
      setCarregando(false);
    }
  }

  return { pedidos, carregando, erro, buscarPedidos };
}