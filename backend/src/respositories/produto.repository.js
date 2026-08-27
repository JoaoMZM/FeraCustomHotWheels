import { db } from "../configs/database.js";

const produtoRepository = {
    selecionar: async () => {
        const sql = 'SELECT * FROM produtos;';
        const [rows] = await db.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = 'SELECT * FROM produtos WHERE id_produto = ?;';
        const [rows] = await db.execute(sql, id);
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
}

export default produtoRepository;