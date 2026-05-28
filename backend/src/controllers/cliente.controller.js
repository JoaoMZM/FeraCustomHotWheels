import { Cliente } from "../models/Cliente.js";
import { validarCPF } from "../utils/validarCpf.js";
import clienteRepository from "../repositories/cliente.repository.js";
import { validarEmail } from "../utils/validarEmail.js";
import { validarTelefone } from "../utils/validarNumero.js";

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

            if (!nome || !cpf || !email || !senha || !telefone) {
                return res.status(400).json({ sucesso: false, message: "Campos obrigatórios não informados" });
            }

            if (!validarCPF(cpf)) {
                return res.status(400).json({ sucesso: false, message: "CPF inválido" });
            }

            const clienteExistente = await clienteRepository.buscarPorCpf(cpf);
            
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

            const cliente = Cliente.criar({ nome, cpf, email, senha, telefone });

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

            const clienteAtual = await clienteRepository.selecionarPorId(id);

            if (!clienteAtual) {
                return res.status(404).json({ message: "Cliente não encontrado" });
            }

            const clienteEditado = Cliente.editar({ nome, cpf, email, senha, telefone }, clienteAtual);

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
    }
};

export default clienteController;