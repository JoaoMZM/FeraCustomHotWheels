import { db } from "../configs/database";

const clienteRepository = {
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
    }   
}