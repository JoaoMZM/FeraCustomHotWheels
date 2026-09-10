import { randomUUID } from 'node:crypto';
import { db } from "../configs/database.js";

const clienteRepository = {
    selecionar: async () => {
        const sql = `
            SELECT c.*, t.numero AS telefone 
            FROM clientes c 
            LEFT JOIN telefones t ON c.id_cliente = t.id_cliente
        `;
        const [rows] = await db.query(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = `
            SELECT c.*, t.numero AS telefone 
            FROM clientes c 
            LEFT JOIN telefones t ON c.id_cliente = t.id_cliente 
            WHERE c.id_cliente = ?
        `;
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    criar: async (cliente) => {
        const idCliente = randomUUID();

        const sqlCliente = `
            INSERT INTO clientes (id_cliente, nome, cpf, email, senha, confirmado, token_confirmacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const valuesCliente = [
            idCliente,
            cliente.nome,
            cliente.cpf,
            cliente.email,
            cliente.senha,
            cliente.confirmado ? 1 : 0,
            cliente.token_confirmacao || cliente.tokenConfirmacao || null
        ];

        await db.query(sqlCliente, valuesCliente);

        const sqlTelefone = `INSERT INTO telefones (id_telefone, numero, id_cliente) VALUES (?, ?, ?)`;
        const valuesTelefone = [randomUUID(), cliente.telefone, idCliente];
        await db.query(sqlTelefone, valuesTelefone);

        return {
            id_cliente: idCliente,
            nome: cliente.nome,
            cpf: cliente.cpf,
            email: cliente.email,
            telefone: cliente.telefone
        };
    },

    editar: async (cliente) => {
        const sqlCliente = 'UPDATE clientes SET nome=?, cpf=?, email=?, senha=? WHERE id_cliente=?';
        const valuesCliente = [cliente.nome, cliente.cpf, cliente.email, cliente.senha, cliente.id_cliente];
        const [result] = await db.query(sqlCliente, valuesCliente);

        if (cliente.telefone) {
            const sqlTelefone = 'UPDATE telefones SET numero=? WHERE id_cliente=?';
            const valuesTelefone = [cliente.telefone, cliente.id_cliente];
            await db.query(sqlTelefone, valuesTelefone);
        }

        return result.affectedRows;
    },

    deletar: async (id) => {
        const sqlTelefone = 'DELETE FROM telefones WHERE id_cliente = ?';
        await db.query(sqlTelefone, [id]);

        const sqlCliente = 'DELETE FROM clientes WHERE id_cliente = ?';
        const [result] = await db.query(sqlCliente, [id]);
        return result.affectedRows;
    },

    buscarPorCpf: async (cpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?';
        const [rows] = await db.query(sql, [cpf]);
        return rows;
    },

    buscarPorEmail: async (email) => {
        const sql = 'SELECT * FROM clientes WHERE email = ?';
        const [rows] = await db.query(sql, [email]);
        return rows;
    },

    buscarPorTelefone: async (numero) => {
        const sql = 'SELECT * FROM telefones WHERE numero = ?';
        const [rows] = await db.query(sql, [numero]);
        return rows;
    },

    buscarClientePorTelefone: async (numero) => {
        const sql = `
            SELECT c.*, t.numero AS telefone 
            FROM clientes c 
            INNER JOIN telefones t ON c.id_cliente = t.id_cliente 
            WHERE t.numero = ?
        `;
        const [rows] = await db.query(sql, [numero]);
        return rows[0];
    },

    buscarPorTokenConfirmacao: async (token) => {
        const sql = 'SELECT * FROM clientes WHERE token_confirmacao = ?';
        const [rows] = await db.query(sql, [token]);
        return rows;
    },

    atualizarStatusConfirmado: async (idCliente) => {
        const sql = 'UPDATE clientes SET confirmado = 1, token_confirmacao = NULL WHERE id_cliente = ?';
        const [result] = await db.query(sql, [idCliente]);
        return result.affectedRows;
    },

    salvarTokenRedefinicao: async (idCliente, token, expiracao) => {
        const sql = `UPDATE clientes SET reset_token_hash = ?, reset_token_expires = ? WHERE id_cliente = ?`;
        const [result] = await db.query(sql, [token, expiracao, idCliente]);
        return result.affectedRows;
    },

    buscarPorTokenRedefinicao: async (token) => {
        const sql = `SELECT * FROM clientes WHERE reset_token_hash = ?`;
        const [rows] = await db.query(sql, [token]);
        return rows;
    },

    atualizarSenha: async (idCliente, novaSenhaHash) => {
        const sql = `
            UPDATE clientes 
            SET senha = ?, reset_token_hash = NULL, reset_token_expires = NULL, confirmado = 1 
            WHERE id_cliente = ?
        `;
        const [result] = await db.query(sql, [novaSenhaHash, idCliente]);
        return result.affectedRows;
    }
};

export default clienteRepository;