import { db } from "../configs/database.js";

const enderecoRepository = {

    buscarPorCliente: async (idCliente) => {
        const sql = `
            SELECT id_endereco, rua, numero, bairro, cidade, uf, cep, complemento, id_cliente
            FROM enderecos
            WHERE id_cliente = ?
            LIMIT 1;
        `;
        const [rows] = await db.execute(sql, [idCliente]);
        return rows[0] || null;
    },

    criar: async (idCliente, endereco) => {
        const sql = `
            INSERT INTO enderecos (rua, numero, bairro, cidade, cep, uf, complemento, id_cliente)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const [result] = await db.execute(sql, [
            endereco.rua,
            endereco.numero,
            endereco.bairro,
            endereco.cidade,
            endereco.cep,
            endereco.uf,
            endereco.complemento,
            idCliente
        ]);
        return result;
    },

    atualizarPorCliente: async (idCliente, endereco) => {
        const sql = `
            UPDATE enderecos
            SET rua = ?, numero = ?, bairro = ?, cidade = ?, cep = ?, uf = ?, complemento = ?
            WHERE id_cliente = ?;
        `;
        const [result] = await db.execute(sql, [
            endereco.rua,
            endereco.numero,
            endereco.bairro,
            endereco.cidade,
            endereco.cep,
            endereco.uf,
            endereco.complemento,
            idCliente
        ]);
        return result;
    },

    salvar: async (idCliente, endereco) => {
        const existente = await enderecoRepository.buscarPorCliente(idCliente);

        if (existente) {
            await enderecoRepository.atualizarPorCliente(idCliente, endereco);
        } else {
            await enderecoRepository.criar(idCliente, endereco);
        }

        return enderecoRepository.buscarPorCliente(idCliente);
    }
};

export default enderecoRepository;
