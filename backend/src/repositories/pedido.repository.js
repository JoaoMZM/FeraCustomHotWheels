import { db } from "../configs/database.js";

const pedidoRepository = {

    criarPedido: async (pedido, itens) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const sqlPedido = `
            INSERT INTO pedidos (valor_total, status_pedido, id_cliente) 
            VALUES (?, ?, ?);
        `;

            const [resultPedido] = await connection.execute(sqlPedido, [
                pedido.valorTotal,
                pedido.status,
                pedido.idCliente
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

    listarPedidosAdmin: async () => {
        const sql = `
        SELECT 
            p.id_pedido,
            p.status_pedido,
            p.data_pedido,
            p.valor_total,
            p.id_cliente,
            c.nome AS nome_cliente,
            c.email AS email_cliente
        FROM pedidos p
        LEFT JOIN clientes c ON p.id_cliente = c.id_cliente
        ORDER BY p.data_pedido DESC;
    `;
        const [pedidos] = await db.execute(sql);
        return pedidos;
    },

    atualizarStatusPedido: async (idPedido, novoStatus) => {
        const sql = `UPDATE pedidos SET status_pedido = ? WHERE id_pedido = ?;`;
        const [result] = await db.execute(sql, [novoStatus, idPedido]);
        return result;
    }
};

export default pedidoRepository;