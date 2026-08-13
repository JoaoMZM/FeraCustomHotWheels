import { Produto } from "../models/Produto.js";
import { produtoRepository } from "../repositories/produto.repository.js";

export const produtoController = {

    buscarTodosProdutos: async (req, res) => {
        try {
            const resultado = await produtoRepository.selecionarTodos();

            if (!resultado || resultado.length === 0) {
                return res.status(200).json({ message: 'A tabela não contém dados', data: [] });
            }

            return res.status(200).json({ message: 'Dados recebidos', data: resultado });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    buscarProdutoPorID: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (isNaN(id) || id <= 0) {
                return res.status(400).json({ message: 'ID informado é inválido' });
            }

            const resultado = await produtoRepository.selecionarPorId(id);

            if (!resultado) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            return res.status(200).json(resultado);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar produto', errorMessage: error.message });
        }
    },

    incluirProduto: async (req, res) => {
        try {
            const { 
                nome, nome_produto,
                descricao, descricao_produto,
                valor, preco, preco_produto,
                estoque, estoque_produto,
                idCategoria, id_categoria,
                cor,
                limitado,
                modelo,
                imagem, caminhoImagem: caminhoBody
            } = req.body;

            // Pega o caminho do arquivo (se veio do Multer) ou do Body JSON
            const caminhoImagem = req.file 
                ? `uploads/image/${req.file.filename}` 
                : (imagem || caminhoBody || null);

            // Tratamento do booleano limitado
            let limitadoBool = null;
            if (limitado !== undefined && limitado !== null) {
                limitadoBool = limitado === 'true' || limitado === true;
            }

            // Instancia a classe Produto
            const produto = Produto.criar({
                nome: nome || nome_produto,
                descricao: descricao || descricao_produto,
                valor: valor || preco || preco_produto,
                estoque: estoque ?? estoque_produto,
                idCategoria: idCategoria || id_categoria,
                cor: cor || null,
                limitado: limitadoBool,
                modelo: modelo || null,
                caminhoImagem: caminhoImagem
            });

            const resultado = await produtoRepository.inserirProduto(produto);

            return res.status(201).json({ 
                message: 'Produto criado com sucesso', 
                id_produto: resultado.insertId 
            });

        } catch (error) {
            console.error(error);

            if (error.message.includes("deve ter") || error.message.includes("obrigatório") || error.message.includes("inválido")) {
                return res.status(400).json({ message: error.message });
            }

            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    }
};

export default produtoController;