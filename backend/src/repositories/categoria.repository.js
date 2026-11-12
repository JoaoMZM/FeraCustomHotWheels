import { db } from "../configs/database.js";

export const categoriaRepository = {
    criar: async (categoria) => {
        const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?,?)'
        const values = [categoria.nome, categoria.descricao];
        const [rows] = await db.execute(sql, values)
        return rows;
    },

    buscarPorNome: async (nome) => {
        const sql = 'SELECT * FROM categorias WHERE LOWER(nome) = LOWER(?) LIMIT 1';
        const [rows] = await db.execute(sql, [nome]);
        return rows[0] ?? null;
    },

    selecionar: async () => {
        const sql = 'SELECT * FROM categorias'
        const [rows] = await db.execute(sql)
        return rows
    },

    selecionarPorId: async (id) => {
        const sql = 'SELECT * FROM categorias WHERE id_categoria = ?';
        const values = [id];
        const [rows] = await db.execute(sql, values);
        return rows;
    },
}
