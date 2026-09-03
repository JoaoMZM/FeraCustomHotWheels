import { db } from "../configs/database.js";

const clienteRepository = {

    selecionar: async () => {
        const sql = `
            SELECT c.*, t.numero AS telefone 
            FROM clientes c 
            LEFT JOIN telefones t ON c.id_cliente = t.id_cliente
        `;
        const [rows] = await db.execute(sql);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = `
            SELECT c.*, t.numero AS telefone 
            FROM clientes c 
            LEFT JOIN telefones t ON c.id_cliente = t.id_cliente 
            WHERE c.id_cliente = ?
        `;
        const values = [id];
        const [rows] = await db.execute(sql, values);
        return rows[0];
    },

    criar: async (cliente) => {

        const sqlCliente = `
            INSERT INTO clientes (nome, cpf, email, senha, confirmado, token_confirmacao) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const valuesCliente = [
            cliente.nome,
            cliente.cpf,
            cliente.email,
            cliente.senha,
            cliente.confirmado || 0,
            cliente.token_confirmacao || cliente.tokenConfirmacao || null
        ];

        const [resultadoCliente] = await db.execute(sqlCliente, valuesCliente);
        const idCliente = resultadoCliente.insertId;

        const sqlTelefone = `INSERT INTO telefones (numero, id_cliente) VALUES (?,?)`;
        const valuesTelefone = [cliente.telefone, idCliente];
        await db.execute(sqlTelefone, valuesTelefone);

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
        const [rows] = await db.execute(sqlCliente, valuesCliente);

        if (cliente.telefone) {
            const sqlTelefone = 'UPDATE telefones SET numero=? WHERE id_cliente=?';
            const valuesTelefone = [cliente.telefone, cliente.id_cliente];
            await db.execute(sqlTelefone, valuesTelefone);
        }

        return rows;
    },

    deletar: async (id) => {
        const sqlTelefone = 'DELETE FROM telefones WHERE id_cliente = ?';
        await db.execute(sqlTelefone, [id]);

        const sqlCliente = 'DELETE FROM clientes WHERE id_cliente = ?';
        const values = [id];
        const [rows] = await db.execute(sqlCliente, values);
        return rows;
    },

    buscarPorCpf: async (cpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?';
        const values = [cpf];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    buscarPorEmail: async (email) => {
        const sql = 'SELECT * FROM clientes WHERE email = ?';
        const values = [email];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    buscarPorTelefone: async (numero) => {
        const sql = 'SELECT * FROM telefones WHERE numero = ?';
        const values = [numero];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    buscarClientePorTelefone: async (numero) => {
        const sql = `
            SELECT c.*, t.numero AS telefone 
            FROM clientes c 
            INNER JOIN telefones t ON c.id_cliente = t.id_cliente 
            WHERE t.numero = ?
        `;
        const values = [numero];
        const [rows] = await db.execute(sql, values);
        return rows[0];
    },

    buscarPorTokenConfirmacao: async (token) => {
        const sql = 'SELECT * FROM clientes WHERE token_confirmacao = ?';
        const values = [token];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    atualizarStatusConfirmado: async (idCliente) => {
        const sql = 'UPDATE clientes SET confirmado = 1, token_confirmacao = NULL WHERE id_cliente = ?';
        const values = [idCliente];
        const [rows] = await db.execute(sql, values);
        return rows;
    },

    salvarTokenRedefinicao: async (idCliente, token, expiracao) => {
        const sql = `UPDATE clientes SET token_redefinicao = ?, expiracao_redefinicao = ? WHERE id_cliente = ?`;
        const [resultado] = await db.execute(sql, [token, expiracao, idCliente]);
        return resultado;
    },

    buscarPorTokenRedefinicao: async (token) => {
        const sql = `SELECT * FROM clientes WHERE token_redefinicao = ?`;
        const [rows] = await db.execute(sql, [token]);
        return rows;
    },

    atualizarSenha: async (idCliente, novaSenhaHash) => {
        const sql = `
            UPDATE clientes 
            SET senha = ?, reset_token_hash = NULL, reset_token_expires = NULL, confirmado = 1 
            WHERE id_cliente = ?
        `;
        const [resultado] = await db.execute(sql, [novaSenhaHash, idCliente]);
        return resultado;
    }
};

export default clienteRepository;