import { db } from "../configs/database.js";

export const produtoRepository = {
    selecionar: async () => {
        const sql = 'SELECT * FROM produtos;';
        const [rows] = await db.execute(sql);
        return rows;
    },

    selecionarAtivos: async () => {
        const sql = 'SELECT * FROM produtos WHERE ativo = 1;';
        const [rows] = await db.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = "SELECT * FROM produtos WHERE id_produto = ?;";
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    },

    selecionarPorIdAtivo: async (id) => {
        const sql = "SELECT * FROM produtos WHERE id_produto = ? AND ativo = 1;";
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null;
    },

    buscarProdutosPorCategoria: async (idOuNome) => {
        const sql = `SELECT p.* FROM produtos p INNER JOIN categorias c ON p.id_categoria = c.id_categoria WHERE p.id_categoria = ? OR c.nome = ?`;
        const [rows] = await db.execute(sql, [idOuNome, idOuNome]);
        return rows;
    },

    buscarProdutosPorCategoriaAtivos: async (idOuNome) => {
        const sql = `SELECT p.* FROM produtos p INNER JOIN categorias c ON p.id_categoria = c.id_categoria WHERE (p.id_categoria = ? OR c.nome = ?) AND p.ativo = 1`;
        const [rows] = await db.execute(sql, [idOuNome, idOuNome]);
        return rows;
    },

    atualizar: async (produto) => {
        const sql = 'UPDATE produtos SET nome = ?, sku = ?, descricao = ?, preco = ?, preco_original = ?, estoque = ?, id_categoria = ?, imagem_produto = ? WHERE id_produto = ?;';
        const values = [
            produto.nome,
            produto.sku,
            produto.descricao,
            produto.valor,
            produto.precoOriginal,
            produto.estoque,
            produto.idCategoria,
            produto.caminhoImagem,
            produto.id
        ];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    desativar: async (ativo, idProduto) => {
        const sql = 'UPDATE produtos SET ativo = ? WHERE id_produto = ?;';
        const values = [ativo, idProduto];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    inserirProduto: async (produto) => {
        const sql = `
            INSERT INTO produtos (
                nome,
                sku,
                descricao,
                preco,
                preco_original,
                estoque,
                imagem_produto,
                id_categoria
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            produto.nome,
            produto.sku,
            produto.descricao,
            produto.valor,
            produto.precoOriginal,
            produto.estoque,
            produto.caminhoImagem,
            produto.idCategoria
        ];

        const [result] = await db.execute(sql, values);
        return result;
    }
};