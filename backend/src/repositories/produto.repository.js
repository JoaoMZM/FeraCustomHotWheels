import { db } from "../configs/database.js";

export const produtoRepository = {

    selecionarTodos: async () => {
        const sql = `
            SELECT 
                p.id_produto, 
                p.nome, 
                p.descricao, 
                p.preco, 
                p.estoque, 
                p.cor, 
                p.limitado, 
                p.modelo, 
                p.imagem_produto,
                p.id_categoria, 
                c.nome AS categorias 
            FROM produtos p 
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = `
            SELECT 
                p.id_produto, 
                p.nome, 
                p.descricao, 
                p.preco, 
                p.estoque, 
                p.cor, 
                p.limitado, 
                p.modelo, 
                p.imagem_produto,
                p.id_categoria, 
                c.nome AS categorias 
            FROM produtos p 
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
            WHERE p.id_produto = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows[0] || null; 
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