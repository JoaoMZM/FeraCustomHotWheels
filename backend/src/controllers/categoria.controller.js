import { Categoria } from "../models/Categorias.js";
import { categoriaRepository } from "../repositories/categoria.repository.js";

export const categoriaController = {

    selecionar: async (req, res) => {
        try {
            const result = await categoriaRepository.selecionar();

            if (!result || result.length === 0) {
                return res.status(200).json({ message: 'A tabela não contém dados', data: [] });
            }

            return res.status(200).json({ message: 'Dados recebidos', data: result });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    selecionarPorId: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ message: 'ID informado é inválido' });
            }

            const result = await categoriaRepository.selecionarPorId(id);

            if (!result) {
                return res.status(404).json({ message: 'Categoria não encontrada' });
            }

            return res.status(200).json(result);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    criar: async (req, res) => {
        try {
            const { nome, nome_categoria, descricao, descricao_categoria } = req.body;

            const categoria = Categoria.criar({nome: nome || nome_categoria, descricao: descricao || descricao_categoria});

            const result = await categoriaRepository.criar(categoria);

            return res.status(201).json({ 
                message: 'Categoria criada com sucesso', 
                id_categoria: result.insertId 
            });

        } catch (error) {
            console.error(error);

            if (error.message.includes("deve ter") || error.message.includes("obrigatório") || error.message.includes("máximo")) {
                return res.status(400).json({ message: error.message });
            }

            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    }
};

export default categoriaController;