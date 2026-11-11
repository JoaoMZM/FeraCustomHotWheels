import { useState, useEffect, useCallback, useMemo } from "react";
import { listarPedidosAdmin } from "../services/api.js";

export const STATUS_PEDIDO = [
  "Pendente",
  "Em Processamento",
  "Enviado",
  "Entregue",
  "Cancelado",
];

export function useAdminPedidos() {
  const [pedidosRaw, setPedidosRaw] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [pedidoAberto, setPedidoAberto] = useState(null);

  const carregarPedidos = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const resposta = await listarPedidosAdmin();
      setPedidosRaw(resposta.data?.result || []);
    } catch (err) {
      setErro(
        err.response?.data?.message ||
          err.message ||
          "Erro ao carregar a lista de pedidos."
      );
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarPedidos();
  }, [carregarPedidos]);

  const pedidos = useMemo(() => {
    return pedidosRaw.map((p) => ({
      id: p.id_pedido,
      status: p.status_pedido,
      data: p.data_pedido,
      total: Number(p.valor_total || 0),
      cliente: {
        id: p.id_cliente,
        nome: p.nome_cliente || "Cliente removido",
        email: p.email_cliente || "-",
        cpf: p.cpf_cliente || "",
        telefone: p.telefone_cliente || "",
      },
      enderecoOrigem: p.endereco_origem || null,
      enderecos: (p.enderecos || []).map((e) => ({
        id: e.id_endereco,
        rua: e.rua,
        numero: e.numero,
        bairro: e.bairro,
        cidade: e.cidade,
        uf: e.uf,
        cep: e.cep,
        complemento: e.complemento,
      })),
      itens: (p.itens || []).map((i) => ({
        id: i.id_item_pedido,
        idProduto: i.id_produto,
        nome: i.nome_produto || "Produto removido",
        sku: i.sku_produto || "",
        quantidade: i.quantidade,
        precoUnitario: Number(i.preco_unitario || 0),
        subtotal: Number(i.subtotal || 0),
      })),
    }));
  }, [pedidosRaw]);

  const contagemPorStatus = useMemo(() => {
    const contagem = { todos: pedidos.length };
    for (const status of STATUS_PEDIDO) {
      contagem[status] = pedidos.filter((p) => p.status === status).length;
    }
    return contagem;
  }, [pedidos]);

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return pedidos.filter((p) => {
      if (statusFiltro !== "todos" && p.status !== statusFiltro) return false;
      if (!termo) return true;

      return (
        String(p.id).includes(termo.replace("#", "")) ||
        p.cliente.nome.toLowerCase().includes(termo) ||
        p.cliente.email.toLowerCase().includes(termo)
      );
    });
  }, [pedidos, busca, statusFiltro]);

  const alternarDetalhes = (id) => {
    setPedidoAberto((atual) => (atual === id ? null : id));
  };

  return {
    pedidos: pedidosFiltrados,
    contagemPorStatus,
    carregando,
    erro,
    busca,
    setBusca,
    statusFiltro,
    setStatusFiltro,
    pedidoAberto,
    alternarDetalhes,
    recarregar: carregarPedidos,
  };
}
