import crypto from 'crypto';
import { db } from "../configs/database.js";

const MENSAGEM_SQL = `id_mensagem AS id, remetente, texto, criada_em, lida_em`;

const chatRepository = {

    buscarConversa: async (idProduto, idCliente) => {
        const [rows] = await db.execute(
            'SELECT * FROM conversas WHERE id_produto = ? AND id_cliente = ? LIMIT 1;',
            [idProduto, idCliente]
        );
        return rows[0] || null;
    },

    buscarConversaPorId: async (idConversa) => {
        const [rows] = await db.execute(
            `SELECT c.*, p.nome AS nome_produto, cl.nome AS nome_cliente
             FROM conversas c
             INNER JOIN produtos p ON p.id_produto = c.id_produto
             INNER JOIN clientes cl ON cl.id_cliente = c.id_cliente
             WHERE c.id_conversa = ? LIMIT 1;`,
            [idConversa]
        );
        return rows[0] || null;
    },

    obterOuCriarConversa: async (idProduto, idCliente) => {
        await db.execute(
            `INSERT INTO conversas (id_conversa, id_produto, id_cliente) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE id_conversa = id_conversa;`,
            [crypto.randomUUID(), idProduto, idCliente]
        );
        return chatRepository.buscarConversa(idProduto, idCliente);
    },

    listarMensagens: async (idConversa, apos = 0, limite = 200) => {
        const [rows] = await db.query(
            `SELECT ${MENSAGEM_SQL} FROM mensagens
             WHERE id_conversa = ? AND id_mensagem > ?
             ORDER BY id_mensagem ASC LIMIT ?;`,
            [idConversa, apos, limite]
        );
        return rows;
    },

    inserirMensagem: async ({ idConversa, remetente, idAutor, texto }) => {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            const [result] = await conn.execute(
                'INSERT INTO mensagens (id_conversa, remetente, id_autor, texto) VALUES (?, ?, ?, ?);',
                [idConversa, remetente, idAutor, texto]
            );
            await conn.execute(
                'UPDATE conversas SET ultima_mensagem_em = CURRENT_TIMESTAMP WHERE id_conversa = ?;',
                [idConversa]
            );

            const [rows] = await conn.execute(
                `SELECT ${MENSAGEM_SQL} FROM mensagens WHERE id_mensagem = ?;`,
                [result.insertId]
            );

            await conn.commit();
            return rows[0];
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    },

    marcarComoLidas: async (idConversa, remetenteDoOutroLado) => {
        await db.execute(
            `UPDATE mensagens SET lida_em = CURRENT_TIMESTAMP
             WHERE id_conversa = ? AND remetente = ? AND lida_em IS NULL;`,
            [idConversa, remetenteDoOutroLado]
        );
    },

    contarMensagensRecentes: async (idAutor, segundos = 60) => {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS total FROM mensagens
             WHERE id_autor = ? AND criada_em > (NOW() - INTERVAL ? SECOND);`,
            [idAutor, segundos]
        );
        return rows[0].total;
    },

    listarConversasAdmin: async () => {
        const [rows] = await db.execute(
            `SELECT c.id_conversa AS id, c.id_produto, p.nome AS nome_produto, p.imagem_produto,
                    c.id_cliente, cl.nome AS nome_cliente, c.ultima_mensagem_em,
                    (SELECT m.texto FROM mensagens m WHERE m.id_conversa = c.id_conversa
                     ORDER BY m.id_mensagem DESC LIMIT 1) AS ultima_mensagem,
                    (SELECT COUNT(*) FROM mensagens m WHERE m.id_conversa = c.id_conversa
                     AND m.remetente = 'cliente' AND m.lida_em IS NULL) AS nao_lidas
             FROM conversas c
             INNER JOIN produtos p ON p.id_produto = c.id_produto
             INNER JOIN clientes cl ON cl.id_cliente = c.id_cliente
             ORDER BY c.ultima_mensagem_em DESC;`
        );
        return rows;
    },
};

export default chatRepository;
