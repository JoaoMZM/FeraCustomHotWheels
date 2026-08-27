import produtoRepository from "../respositories/produto.repository.js";
import { Produto } from "../models/Produto.js";

const produtoController = {
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
}

export default produtoController;