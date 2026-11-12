import enderecoRepository from "../repositories/endereco.repository.js";
import { validarEndereco } from "../utils/validarEndereco.js";

const enderecoController = {

    obterMeuEndereco: async (req, res) => {
        try {
            const endereco = await enderecoRepository.buscarPorCliente(req.id_cliente);

            return res.status(200).json({ endereco });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },

    salvarMeuEndereco: async (req, res) => {
        try {
            const { erro, endereco } = validarEndereco(req.body);

            if (erro) {
                return res.status(400).json({ message: erro });
            }

            const salvo = await enderecoRepository.salvar(req.id_cliente, endereco);

            return res.status(200).json({ message: "Endereço salvo com sucesso!", endereco: salvo });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    }
};

export default enderecoController;
