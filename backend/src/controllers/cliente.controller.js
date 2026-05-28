import { Cliente } from "../models/Cliente.js";
import { validarCPF } from "../utils/validarCpf.js";
import clienteRepository from "../repositories/cliente.repository.js";
import { validarEmail } from "../utils/validarEmail.js";
import { validarTelefone } from "../utils/validarNumero.js";
import { limparNumero } from "../utils/limparNumero.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const clienteController = {

    buscarTodosClientes: async (req, res) => {
        try {
            // CORREÇÃO: Adicionado o "await" e os parênteses "()"
            const resultado = await clienteRepository.selecionar();

            if (!resultado || resultado.length === 0) {
                return res.status(200).json({ message: 'A tabela não contém dados', data: [] });
            }

            return res.status(200).json({ message: 'Dados recebidos', data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    buscarClientePorID: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const resultado = await clienteRepository.selecionarPorId(id);

            if (!resultado) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            return res.status(200).json(resultado);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar cliente', errorMessage: error.message });
        }
    },

    incluirCliente: async (req, res) => {
        try {
            const { nome, cpf, email, senha, telefone } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(senha, salt);

            const cpfLimpo = limparNumero(cpf);
            const telefoneLimpo = limparNumero(telefone);
            if (!nome || !cpf || !email || !senha || !telefone) {
                return res.status(400).json({ sucesso: false, message: "Campos obrigatórios não informados" });
            }

            if (!validarCPF(cpf)) {
                return res.status(400).json({ sucesso: false, message: "CPF inválido" });
            }

            const clienteExistente = await clienteRepository.buscarPorCpf(cpfLimpo);

            if (clienteExistente && clienteExistente.length > 0) {
                return res.status(400).json({ sucesso: false, message: "CPF já cadastrado" });
            }

            if (!validarEmail(email)) {
                return res.status(400).json({ sucesso: false, message: "E-mail inválido" });
            }

            const clienteExistente2 = await clienteRepository.buscarPorEmail(email);

            if (clienteExistente2 && clienteExistente2.length > 0) {
                return res.status(400).json({ sucesso: false, message: "E-mail já cadastrado" });
            }

            if (!validarTelefone(telefone)) {
                return res.status(400).json({ sucesso: false, message: "Telefone inválido" });
            }

            const cliente = Cliente.criar({ nome, cpf: cpfLimpo, email, senha: hashedPassword, telefone: telefoneLimpo });

            const resultado = await clienteRepository.criar(cliente);

            return res.status(201).json({ sucesso: true, message: "Cliente criado com sucesso", result: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ sucesso: false, message: "Erro no servidor", errorMessage: error.message });
        }
    },

    atualizarCliente: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!id) {
                return res.status(400).json({ message: "ID é obrigatório" });
            }

            // CORREÇÃO: Removi id_cliente (que já vem pelo req.params.id) e adicionei o telefone
            const { nome, cpf, email, senha, telefone } = req.body;
            const cpfLimpo = limparNumero(cpf);
            const telefoneLimpo = limparNumero(telefone);
            const clienteAtual = await clienteRepository.selecionarPorId(id);

            if (!clienteAtual) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            const clienteEditado = Cliente.editar({ nome, cpf: cpfLimpo, email, senha, telefone: telefoneLimpo }, clienteAtual);

            const resultado = await clienteRepository.editar(clienteEditado);

            return res.status(200).json({ message: "Cliente atualizado com sucesso", result: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor", errorMessage: error.message });
        }
    },

    excluirCliente: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const cliente = await clienteRepository.selecionarPorId(id);

            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            const exclusao = await clienteRepository.deletar(id);

            return res.status(200).json({ message: 'Cliente excluído com sucesso', detalhes: exclusao });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },
    loginCliente: async (req, res) => {
        try {
            const { authMethod, senha } = req.body;
            const cookieOptions = {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            };
            if (!authMethod || !senha) return res.status(400).json({ message: "Informe todos os campos" });

            const usuario = await clienteRepository.buscarPorEmail(authMethod);

            console.log(authMethod, usuario)

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const validPassword = await bcrypt.compare(senha, usuario[0].senha);

            if (!validPassword) return res.status(400).json({ message: "Senha inválida" });

            const token = jwt.sign({ id_cliente: usuario[0].id_cliente }, process.env.TOKEN_SECRET, { expiresIn: '1m' });

            res.clearCookie('token', cookieOptions);

            res.cookie('token', token, { ...cookieOptions, maxAge: 60000 });

            return res.status(200).json({ message: "Login realizado com sucesso!" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },
    logoutCliente: async (req, res) => {
        try {
            const cookieOptions = {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax'
            };
            
            res.clearCookie('token', cookieOptions);

            return res.status(200).json({ message: "Logout realizado com sucesso!" });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro ao tentar fazer logout." });
        }
    },
    testeLogin: async (req, res) => {
        try {
            return res.status(200).json({ message: "Você está logado com token" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    }
};

export default clienteController;