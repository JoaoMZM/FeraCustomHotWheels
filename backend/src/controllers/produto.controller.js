import { Produto } from "../models/Produto.js";
import { produtoRepository } from "../repositories/produto.repository.js";

export const produtoController = {

    buscarTodosProdutos: async (req, res) => {
        try {
            const resultado = await produtoRepository.selecionar();

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
    },
    editar: async (req, res) => {
        try {
            const {
                nome,
                descricao,
                preco,
                estoque,
                cor,
                limitado,
                modelo,
                id_categoria,
                id_produto
            } = req.body;

            const produtoAtual = await produtoRepository.selecionarPorId(id_produto);
            const produto = Produto.editar({ nome, descricao, preco, estoque, cor, limitado, modelo, id_categoria, id_produto }, produtoAtual);

            const result = await produtoRepository.atualizar(produto);
            return res.status(204).json({ message: 'Sucesso ao editar produto', result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ errorMessage: 'Erro interno do servidor' });
        }
    },
    desativar: async (req, res) => {
        const idProduto = req.params.idProduto;
        const ativo = req.body;

        if (!idProduto || ativo == null || ativo == undefined || typeof ativo != true) {
            return res.status(400).json({ message: "Envie todos os tipos de maneira correta" });
        }

        const result = await produtoRepository.desativar(ativo, idProduto);


        return res.status(204).json({ errorMessage: ativo ? 'Produto ativado com sucesso' : 'Produto desativado com sucesso', result })
    }
};
export default produtoController;