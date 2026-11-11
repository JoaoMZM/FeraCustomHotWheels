import { db } from "../configs/database.js";

const pedidoRepository = {

    criarPedido: async (pedido, itens) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Endereço de entrega gravado junto com o pedido (histórico não muda se o cliente editar o cadastro)
            const entrega = pedido.enderecoEntrega ?? {};

            const sqlPedido = `
            INSERT INTO pedidos (
                valor_total, status_pedido, id_cliente,
                entrega_rua, entrega_numero, entrega_bairro, entrega_cidade,
                entrega_uf, entrega_cep, entrega_complemento
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
            const [resultPedido] = await connection.execute(sqlPedido, [
                pedido.valorTotal,
                pedido.status,
                pedido.idCliente,
                entrega.rua ?? null,
                entrega.numero ?? null,
                entrega.bairro ?? null,
                entrega.cidade ?? null,
                entrega.uf ?? null,
                entrega.cep ?? null,
                entrega.complemento ?? null
            ]);

            const idPedido = resultPedido.insertId;

            if (!idPedido) {
                throw new Error("Não foi possível obter o ID do pedido inserido.");
            }

            const sqlItem = `
            INSERT INTO itens_pedido (preco_unitario, subtotal, quantidade, id_produto, id_pedido) 
            VALUES (?, ?, ?, ?, ?);
        `;

            const sqlEstoque = `
            UPDATE produtos 
            SET estoque = estoque - ? 
            WHERE id_produto = ?;
        `;

            for (const item of itens) {
                await connection.execute(sqlItem, [
                    item.precoUnitario,
                    item.subTotal,
                    item.quantidade,
                    item.idProduto,
                    idPedido
                ]);

                await connection.execute(sqlEstoque, [item.quantidade, item.idProduto]);
            }

            await connection.commit();
            return { idPedido, status: "sucesso" };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    adicionarItemPedido: async (pedido, item) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();
            const idProduto = item.idProduto;
            const idPedido = pedido.id;

            const sqlItem = 'INSERT INTO itens_pedido (quantidade, preco_unitario, subtotal, id_pedido, id_produto) VALUES (?, ?, ?, ?, ?);';
            const valuesItem = [item.quantidade, item.precoUnitario, item.subTotal, idPedido, idProduto];
            const [rowsItem] = await conn.execute(sqlItem, valuesItem);

            const sqlEstoque = 'UPDATE produtos SET estoque_produto = estoque_produto - ? WHERE id_produto = ?;';
            await conn.execute(sqlEstoque, [item.quantidade, idProduto]);

            const sqlPed = 'UPDATE pedidos SET valor_total = ? WHERE id_pedido = ?;';
            const valuesPed = [pedido.valorTotal, idPedido];
            const [rowsPed] = await conn.execute(sqlPed, valuesPed);

            await conn.commit();
            return { rowsItem, rowsPed };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    selectPedidos: async () => {
        const sql = "SELECT * FROM pedidos;";
        const [rows] = await db.execute(sql);
        return rows;
    },

    listarPedidosDoCliente: async (idCliente) => {
        const [pedidos] = await db.execute(
            `SELECT p.id_pedido, p.status_pedido, p.data_pedido, p.valor_total,
                    (SELECT pg.status_pagamento FROM pagamentos pg
                     WHERE pg.id_pedido = p.id_pedido ORDER BY pg.id_pagamento DESC LIMIT 1) AS status_pagamento
             FROM pedidos p
             WHERE p.id_cliente = ?
             ORDER BY p.data_pedido DESC, p.id_pedido DESC;`,
            [idCliente]
        );

        if (pedidos.length === 0) return [];

        const ids = pedidos.map((p) => p.id_pedido);
        const [itens] = await db.query(
            `SELECT i.id_pedido, i.quantidade, i.preco_unitario, pr.nome, pr.imagem_produto
             FROM itens_pedido i
             INNER JOIN produtos pr ON pr.id_produto = i.id_produto
             WHERE i.id_pedido IN (?);`,
            [ids]
        );

        return pedidos.map((p) => ({
            id: p.id_pedido,
            status: p.status_pedido,
            data_pedido: p.data_pedido,
            total: Number(p.valor_total),
            status_pagamento: p.status_pagamento,
            itens: itens
                .filter((i) => i.id_pedido === p.id_pedido)
                .map((i) => ({
                    nome: i.nome,
                    quantidade: i.quantidade,
                    preco: Number(i.preco_unitario),
                    imagem_produto: i.imagem_produto,
                })),
        }));
    },

    selectPedidosId: async (id) => {
        const sql = "SELECT * FROM pedidos WHERE id_pedido = ?;";
        const [rows] = await db.execute(sql, [id]);
        return rows;
    },

    atualizarItemPedido: async (item, idPedido, quantidadeAntiga) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const idProduto = item.idProduto;

            const sqlItem = 'UPDATE itens_pedido SET quantidade = ?, preco_unitario = ?, subtotal = ?, id_pedido = ?, id_produto = ? WHERE id_item_pedido = ?;';
            const valuesItem = [item.quantidade, item.precoUnitario, item.subTotal, idPedido, idProduto, item.id];
            const [rowsItem] = await conn.execute(sqlItem, valuesItem);

            const diferencaQuantidade = item.quantidade - quantidadeAntiga;
            const sqlEstoque = 'UPDATE produtos SET estoque = estoque - ? WHERE id_produto = ?;';
            const valuesEstoque = [diferencaQuantidade, idProduto];
            const [rowsEstoque] = await conn.execute(sqlEstoque, valuesEstoque);

            const sqlSoma = 'SELECT COALESCE(SUM(subtotal), 0) AS novo_total FROM itens_pedido WHERE id_pedido = ?;';
            const [resultSoma] = await conn.execute(sqlSoma, [idPedido]);
            const novoValorTotal = resultSoma[0].novo_total;

            const sqlPed = 'UPDATE pedidos SET valor_total = ? WHERE id_pedido = ?;';
            const valuesPed = [novoValorTotal, idPedido];
            const [rowsPed] = await conn.execute(sqlPed, valuesPed);

            await conn.commit();
            return { rowsItem, rowsEstoque, rowsPed };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    buscarItemPorId: async (id) => {
        const sql = "SELECT * FROM itens_pedido WHERE id_item_pedido = ?;";
        const [rows] = await db.execute(sql, [id]);
        return rows;
    },

    deletarItemPedido: async (id, itemDeletado, idPedido) => {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            const sqlDelete = 'DELETE FROM itens_pedido WHERE id_item_pedido = ?;';
            const [rowsDelete] = await conn.execute(sqlDelete, [id]);

            const sqlEstoque = 'UPDATE produtos SET estoque = estoque + ? WHERE id_produto = ?;';
            const valuesEstoque = [itemDeletado.quantidade, itemDeletado.idProduto];
            const [rowsEstoque] = await conn.execute(sqlEstoque, valuesEstoque);

            const sqlSoma = 'SELECT COALESCE(SUM(subtotal), 0) AS novo_total FROM itens_pedido WHERE id_pedido = ?;';
            const [resultSoma] = await conn.execute(sqlSoma, [idPedido]);
            const novoValorTotal = resultSoma[0].novo_total;

            const sqlPed = 'UPDATE pedidos SET valor_total = ? WHERE id_pedido = ?;';
            const valuesPed = [novoValorTotal, idPedido];
            const [rowsPed] = await conn.execute(sqlPed, valuesPed);

            await conn.commit();
            return { rowsDelete, rowsEstoque, rowsPed };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    // Lista todos os pedidos para o painel do administrador.
    // Cada pedido já vem com: dados do cliente, telefone, endereço(s) e itens.
    listarPedidosAdmin: async () => {
        const sqlPedidos = `
        SELECT 
            p.id_pedido,
            p.status_pedido,
            p.data_pedido,
            p.valor_total,
            p.id_cliente,
            p.entrega_rua,
            p.entrega_numero,
            p.entrega_bairro,
            p.entrega_cidade,
            p.entrega_uf,
            p.entrega_cep,
            p.entrega_complemento,
            c.nome AS nome_cliente,
            c.email AS email_cliente,
            c.cpf AS cpf_cliente
        FROM pedidos p
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
        ORDER BY p.data_pedido DESC, p.id_pedido DESC;
    `;
        const [pedidos] = await db.execute(sqlPedidos);

        if (pedidos.length === 0) {
            return [];
        }

        const idsPedidos = pedidos.map((pedido) => pedido.id_pedido);
        const idsClientes = [...new Set(
            pedidos.map((pedido) => pedido.id_cliente).filter(Boolean)
        )];

        // Itens de todos os pedidos listados (com nome e imagem do produto)
        const sqlItens = `
        SELECT
            ip.id_item_pedido,
            ip.id_pedido,
            ip.id_produto,
            ip.quantidade,
            ip.preco_unitario,
            ip.subtotal,
            pr.nome AS nome_produto,
            pr.sku AS sku_produto,
            pr.imagem_produto
        FROM itens_pedido ip
        LEFT JOIN produtos pr ON ip.id_produto = pr.id_produto
        WHERE ip.id_pedido IN (?)
        ORDER BY ip.id_item_pedido ASC;
    `;
        const [itens] = await db.query(sqlItens, [idsPedidos]);

        // Endereços e telefones dos clientes que fizeram os pedidos
        let enderecos = [];
        let telefones = [];

        if (idsClientes.length > 0) {
            const sqlEnderecos = `
            SELECT
                id_endereco,
                id_cliente,
                rua,
                numero,
                bairro,
                cidade,
                uf,
                cep,
                complemento
            FROM enderecos
            WHERE id_cliente IN (?);
        `;
            [enderecos] = await db.query(sqlEnderecos, [idsClientes]);

            const sqlTelefones = `
            SELECT id_cliente, numero
            FROM telefones
            WHERE id_cliente IN (?);
        `;
            [telefones] = await db.query(sqlTelefones, [idsClientes]);
        }

        const itensPorPedido = new Map();
        for (const item of itens) {
            if (!itensPorPedido.has(item.id_pedido)) {
                itensPorPedido.set(item.id_pedido, []);
            }
            itensPorPedido.get(item.id_pedido).push(item);
        }

        const enderecosPorCliente = new Map();
        for (const endereco of enderecos) {
            if (!enderecosPorCliente.has(endereco.id_cliente)) {
                enderecosPorCliente.set(endereco.id_cliente, []);
            }
            enderecosPorCliente.get(endereco.id_cliente).push(endereco);
        }

        const telefonePorCliente = new Map();
        for (const telefone of telefones) {
            if (!telefonePorCliente.has(telefone.id_cliente)) {
                telefonePorCliente.set(telefone.id_cliente, telefone.numero);
            }
        }

        return pedidos.map((pedido) => {
            // Pedidos novos guardam o endereço de entrega; pedidos antigos (sem esse dado)
            // usam o endereço atual do cadastro do cliente.
            const temEnderecoNoPedido = Boolean(pedido.entrega_rua);

            const enderecosDoPedido = temEnderecoNoPedido
                ? [{
                    id_endereco: `pedido-${pedido.id_pedido}`,
                    rua: pedido.entrega_rua,
                    numero: pedido.entrega_numero,
                    bairro: pedido.entrega_bairro,
                    cidade: pedido.entrega_cidade,
                    uf: pedido.entrega_uf,
                    cep: pedido.entrega_cep,
                    complemento: pedido.entrega_complemento
                }]
                : (enderecosPorCliente.get(pedido.id_cliente) ?? []);

            let enderecoOrigem = null;
            if (temEnderecoNoPedido) enderecoOrigem = 'pedido';
            else if (enderecosDoPedido.length > 0) enderecoOrigem = 'cadastro';

            return {
                ...pedido,
                telefone_cliente: telefonePorCliente.get(pedido.id_cliente) ?? null,
                endereco_origem: enderecoOrigem,
                enderecos: enderecosDoPedido,
                itens: itensPorPedido.get(pedido.id_pedido) ?? []
            };
        });
    },

    atualizarStatusPedido: async (idPedido, novoStatus) => {
        const sql = `UPDATE pedidos SET status_pedido = ? WHERE id_pedido = ?;`;
        const [result] = await db.execute(sql, [novoStatus, idPedido]);
        return result;
    }
};

export default pedidoRepository;