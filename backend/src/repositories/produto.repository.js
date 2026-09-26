import { db } from "../configs/database.js";

export const produtoRepository = {
    selecionar: async () => {
        const sql = 'SELECT * FROM produtos;';
        const [rows] = await db.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = "SELECT * FROM produtos WHERE id_produto = ?;";
        const [rows] = await db.execute(sql, [id]);
        return rows;
    },

    atualizar: async (produto) => {
        const sql = 'UPDATE produtos SET nome = ?, descricao = ?, preco = ?, estoque = ?, cor = ?, limitado = ?, modelo = ?, id_categoria = ? WHERE id_produto = ?;';
        const values = [produto.nome, produto.descricao, produto.preco, produto.estoque, produto.cor, produto.limitado, produto.modelo, produto.id_categoria, produto.id_produto];
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
                descricao, 
                preco, 
                estoque, 
                cor, 
                limitado, 
                modelo,
                imagem_produto,
                id_categoria
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            produto.nome ?? produto.nome_produto,
            produto.descricao ?? produto.descricao_produto,
            produto.valor ?? produto.preco ?? produto.preco_produto,
            produto.estoque ?? produto.estoque_produto,
            produto.cor ?? null,
            produto.limitado ?? null,
            produto.modelo ?? null,
            produto.caminhoImagem ?? produto.imagem_produto ?? null,
            produto.idCategoria ?? produto.id_categoria
        ];

        const [result] = await db.execute(sql, values);
        return result;
    }
};