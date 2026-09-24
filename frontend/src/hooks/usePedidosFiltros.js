import { useState } from 'react';

const STATUS = {
  pendente: { texto: 'Pendente', tipo: 'aberto' },
  pago: { texto: 'Pago', tipo: 'aberto' },
  enviado: { texto: 'A caminho', tipo: 'aberto' },
  entregue: { texto: 'Entregue', tipo: 'finalizado' },
  cancelado: { texto: 'Cancelado', tipo: 'cancelado' },
};

export function infoStatus(status) {
  const chave = String(status).toLowerCase();
  return STATUS[chave] || { texto: status, tipo: 'aberto' };
}

export default function usePedidosFiltro(pedidos) {
  const [aba, setAba] = useState('todos');

  const abertos = pedidos.filter((p) => infoStatus(p.status).tipo === 'aberto');
  const finalizados = pedidos.filter((p) => infoStatus(p.status).tipo === 'finalizado');
  const cancelados = pedidos.filter((p) => infoStatus(p.status).tipo === 'cancelado');

  let lista = pedidos;
  if (aba === 'abertos') lista = abertos;
  if (aba === 'finalizados') lista = finalizados;
  if (aba === 'cancelados') lista = cancelados;

  const totais = {
    todos: pedidos.length,
    abertos: abertos.length,
    finalizados: finalizados.length,
    cancelados: cancelados.length,
  };

  return { aba, setAba, lista, totais };
}