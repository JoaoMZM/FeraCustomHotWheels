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

    buscarProdutosPublico: async (req, res) => {
        try {
            const resultado = await produtoRepository.selecionarAtivos();

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
            const id = req.params.id;

            if (!id || typeof id !== 'string' || id.trim() === '') {
                return res.status(400).json({ message: 'ID informado é inválido' });
            }

            const resultado = await produtoRepository.selecionarPorIdAtivo(id);

            if (!resultado) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            return res.status(200).json(resultado);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar produto', errorMessage: error.message });
        }
    },

    buscarProdutosPorCategoria: async (req, res) => {
        try {
            const { idCategoria } = req.params;
            let produtos;

            const categoriaValida = idCategoria && idCategoria !== "null" && idCategoria !== "undefined";

            if (categoriaValida) {
                produtos = await produtoRepository.buscarProdutosPorCategoriaAtivos(idCategoria);
            } else {
                produtos = await produtoRepository.selecionarAtivos();
            }

            return res.status(200).json(produtos);

        } catch (error) {
            console.error("Erro ao listar produtos:", error);
            return res.status(500).json({ mensagem: "Erro ao buscar produtos" });
        }
    },

    incluirProduto: async (req, res) => {
        try {

            console.log('BODY RECEBIDO:', req.body);
            console.log('ID_CATEGORIA RECEBIDO:', JSON.stringify(req.body.idCategoria || req.body.id_categoria));

            const {


                nome, nome_produto,
                sku,
                descricao, descricao_produto,
                valor, preco, preco_produto,
                precoOriginal, preco_original,
                estoque, estoque_produto,
                idCategoria, id_categoria,
                cor,
                limitado,
                modelo,
                imagem, caminhoImagem: caminhoBody, imagemUrl
            } = req.body;



            const caminhoImagem = req.file
                ? `uploads/image/${req.file.filename}`
                : (imagem || caminhoBody || imagemUrl || null);

            let limitadoBool = null;
            if (limitado !== undefined && limitado !== null) {
                limitadoBool = limitado === 'true' || limitado === true;
            }

            const produto = Produto.criar({
                nome: nome || nome_produto,
                sku: sku,
                descricao: descricao || descricao_produto,
                valor: valor || preco || preco_produto,
                precoOriginal: precoOriginal ?? preco_original ?? null,
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
            const { id } = req.params;
            const {
                nome,
                sku,
                descricao,
                preco,
                precoOriginal,
                estoque,
                cor,
                limitado,
                modelo,
                id_categoria
            } = req.body;

            const caminhoImagem = req.file
                ? `uploads/image/${req.file.filename}`
                : undefined; 

            const produtoAtual = await produtoRepository.selecionarPorId(id);

            if (!produtoAtual) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            const produto = Produto.editar(
                {
                    nome,
                    sku,
                    descricao,
                    valor: preco,
                    precoOriginal,
                    estoque,
                    cor,
                    limitado,
                    modelo,
                    idCategoria: id_categoria,
                    caminhoImagem
                },
                produtoAtual
            );

            const result = await produtoRepository.atualizar(produto);
            return res.status(200).json({ message: 'Sucesso ao editar produto', result });

        } catch (error) {
            console.error(error);

            if (error.message?.includes("deve ter") || error.message?.includes("obrigatório") || error.message?.includes("inválido")) {
                return res.status(400).json({ message: error.message });
            }

            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    },

    desativar: async (req, res) => {
        try {
            const { idProduto } = req.params;
            const { ativo } = req.body;

            if (!idProduto || typeof ativo !== 'boolean') {
                return res.status(400).json({ message: "Envie o campo 'ativo' (true/false)" });
            }

            const result = await produtoRepository.desativar(ativo, idProduto);

            return res.status(200).json({
                message: ativo ? 'Produto ativado com sucesso' : 'Produto desativado com sucesso',
                result
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor', errorMessage: error.message });
        }
    }
};

export default produtoController;