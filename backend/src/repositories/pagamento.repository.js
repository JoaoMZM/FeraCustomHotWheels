import { db } from "../configs/database.js";

const GATEWAY = 'mercadopago';

export const STATUS_PAGAMENTO = Object.freeze({
    approved: 'Aprovado',
    authorized: 'Pendente',
    pending: 'Pendente',
    in_process: 'Em análise',
    in_mediation: 'Em análise',
    rejected: 'Recusado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    charged_back: 'Reembolsado',
});

const traduzirStatus = (statusGateway) => STATUS_PAGAMENTO[statusGateway] ?? 'Pendente';

const pagamentoRepository = {

    buscarPedido: async (idPedido) => {
        const [rows] = await db.execute(
            'SELECT id_pedido, status_pedido, valor_total, id_cliente FROM pedidos WHERE id_pedido = ?;',
            [idPedido]
        );
        return rows[0] || null;
    },

    itensDoPedido: async (idPedido) => {
        const [rows] = await db.execute(
            `SELECT i.id_produto, i.quantidade, i.preco_unitario, p.nome, p.descricao
             FROM itens_pedido i
             INNER JOIN produtos p ON p.id_produto = i.id_produto
             WHERE i.id_pedido = ?;`,
            [idPedido]
        );
        return rows;
    },

    listarPorPedido: async (idPedido) => {
        const [rows] = await db.execute(
            `SELECT id_pagamento, metodo_pagamento, status_pagamento, valor, data_pagamento, atualizado_em
             FROM pagamentos WHERE id_pedido = ? ORDER BY id_pagamento DESC;`,
            [idPedido]
        );
        return rows;
    },

    temPagamentoAprovado: async (idPedido) => {
        const [rows] = await db.execute(
            "SELECT 1 FROM pagamentos WHERE id_pedido = ? AND status_pagamento = 'Aprovado' LIMIT 1;",
            [idPedido]
        );
        return rows.length > 0;
    },

    criarTentativa: async ({ idPedido, valor, idPreferencia, emailPagador }) => {
        const [result] = await db.execute(
            `INSERT INTO pagamentos (id_pedido, metodo_pagamento, status_pagamento, valor, gateway, id_preferencia, email_pagador)
             VALUES (?, 'checkout_pro', 'Pendente', ?, ?, ?, ?);`,
            [idPedido, valor, GATEWAY, idPreferencia, emailPagador]
        );
        return result.insertId;
    },

    aplicarPagamentoGateway: async (pagamento) => {
        const idPedido = Number(pagamento.external_reference);
        if (!Number.isInteger(idPedido) || idPedido <= 0) {
            return { ignorado: true, motivo: 'external_reference inválida' };
        }

        const statusPagamento = traduzirStatus(pagamento.status);
        const idGateway = String(pagamento.id);
        const valorPago = Number(pagamento.transaction_amount);

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [pedidos] = await conn.execute(
                'SELECT id_pedido, status_pedido, valor_total FROM pedidos WHERE id_pedido = ? FOR UPDATE;',
                [idPedido]
            );
            const pedido = pedidos[0];

            if (!pedido) {
                await conn.rollback();
                return { ignorado: true, motivo: 'pedido não encontrado' };
            }

            if (statusPagamento === 'Aprovado' && Math.abs(valorPago - Number(pedido.valor_total)) > 0.009) {
                await conn.rollback();
                console.error(`[pagamento] Valor divergente no pedido ${idPedido}: pago ${valorPago}, esperado ${pedido.valor_total}`);
                return { ignorado: true, motivo: 'valor divergente' };
            }

            const metodo = pagamento.payment_type_id || pagamento.payment_method_id || 'checkout_pro';
            const parcelas = pagamento.installments ?? null;
            const emailPagador = pagamento.payer?.email ?? null;

            let [linhas] = await conn.execute(
                'SELECT id_pagamento FROM pagamentos WHERE gateway = ? AND id_pagamento_gateway = ? LIMIT 1;',
                [GATEWAY, idGateway]
            );
            if (linhas.length === 0) {
                [linhas] = await conn.execute(
                    `SELECT id_pagamento FROM pagamentos
                     WHERE id_pedido = ? AND gateway = ? AND id_pagamento_gateway IS NULL
                     ORDER BY id_pagamento DESC LIMIT 1;`,
                    [idPedido, GATEWAY]
                );
            }

            if (linhas.length > 0) {
                await conn.execute(
                    `UPDATE pagamentos
                     SET status_pagamento = ?, metodo_pagamento = ?, id_pagamento_gateway = ?,
                         valor = ?, email_pagador = COALESCE(?, email_pagador), numero_parcelas = ?
                     WHERE id_pagamento = ?;`,
                    [statusPagamento, metodo, idGateway, valorPago, emailPagador, parcelas, linhas[0].id_pagamento]
                );
            } else {
                await conn.execute(
                    `INSERT INTO pagamentos
                       (id_pedido, metodo_pagamento, status_pagamento, valor, gateway, id_pagamento_gateway, email_pagador, numero_parcelas)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
                    [idPedido, metodo, statusPagamento, valorPago, GATEWAY, idGateway, emailPagador, parcelas]
                );
            }

            let novoStatusPedido = pedido.status_pedido;

            if (statusPagamento === 'Aprovado' && pedido.status_pedido === 'Pendente') {
                novoStatusPedido = 'Em Processamento';
            } else if (
                statusPagamento === 'Reembolsado' &&
                ['Pendente', 'Em Processamento'].includes(pedido.status_pedido)
            ) {
                novoStatusPedido = 'Cancelado';
                await conn.execute(
                    `UPDATE produtos p
                     INNER JOIN itens_pedido i ON i.id_produto = p.id_produto
                     SET p.estoque = p.estoque + i.quantidade
                     WHERE i.id_pedido = ?;`,
                    [idPedido]
                );
            }

            if (novoStatusPedido !== pedido.status_pedido) {
                await conn.execute('UPDATE pedidos SET status_pedido = ? WHERE id_pedido = ?;', [novoStatusPedido, idPedido]);
            }

            await conn.commit();
            return { idPedido, statusPagamento, statusPedido: novoStatusPedido };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },
};

export default pagamentoRepository;
