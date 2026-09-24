import pedidoRepository from "../repositories/pedido.repository.js";
import { ItensPedidos } from "../models/Itens_pedido.js";
import { Pedido } from "../models/Pedidos.js";
import { produtoRepository } from "../repositories/produto.repository.js";

const pedidoControllers = {

    adicionarPedido: async (req, res) => {
        try {
            const { statusPedido, itens, idCliente } = req.body;

            if (!itens || !Array.isArray(itens) || itens.length === 0) {
                return res.status(400).json({ message: "O pedido deve conter pelo menos um item." });
            }

            const itensPedidos = [];

            for (const item of itens) {
                const idProduto = item.idProduto;
                const quantidade = item.quantidade;

                const produtoResultado = await produtoRepository.selecionarPorId(idProduto);

                if (!produtoResultado || produtoResultado.length === 0) {
                    return res.status(404).json({ message: `Produto ID ${idProduto} não encontrado.` });
                }

                const produto = produtoResultado[0];
                const estoqueDisponivel = produto.estoque ?? produto.estoque_produto;
                const precoUnitario = Number(produto.preco ?? produto.preco_produto);
                const nomeProduto = produto.nome ?? produto.nome_produto ?? idProduto;

                if (estoqueDisponivel < quantidade) {
                    return res.status(400).json({
                        message: `Estoque insuficiente para o produto '${nomeProduto}'. Disponível: ${estoqueDisponivel}`
                    });
                }

                const subTotal = ItensPedidos.calcularSubTotal(quantidade, precoUnitario);

                itensPedidos.push(ItensPedidos.criar({ precoUnitario, subTotal, quantidade, idProduto }));
            }

            const valorTotal = ItensPedidos.calcularValorTotal(itensPedidos);

            const pedido = Pedido.criar({ statusPedido, valorTotal, idCliente });

            const result = await pedidoRepository.criarPedido(pedido, itensPedidos);

            return res.status(201).json({ message: "Pedido criado com sucesso!", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },

    selecionarPedido: async (req, res) => {
        try {
            const id_pedido = req.query.id_pedido;

            if (id_pedido) {
                const id_pedido_num = Number(id_pedido);

                if (!Number.isInteger(id_pedido_num) || id_pedido_num <= 0) {
                    return res.status(400).json({ message: "Envie um id_pedido válido." });
                }

                const result = await pedidoRepository.selectPedidosId(id_pedido_num);

                if (!result || result.length === 0) {
                    return res.status(404).json({ message: "Pedido não encontrado." });
                }

                return res.status(200).json({ message: "Pedido selecionado:", result: result[0] });
            }

            const result = await pedidoRepository.selectPedidos();
            return res.status(200).json({ message: "Pedidos selecionados:", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },

    adicionarItem: async (req, res) => {
        try {
            const id = Number(req.params.id);
            const { idProduto, quantidade } = req.body;

            const pedidoSelecionado = await pedidoRepository.selectPedidosId(id);
            if (!pedidoSelecionado || pedidoSelecionado.length === 0) {
                return res.status(404).json({ message: "Pedido não encontrado." });
            }

            const produtoSelecionado = await produtoRepository.selecionarPorId(idProduto);
            if (!produtoSelecionado || produtoSelecionado.length === 0) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            const produto = produtoSelecionado[0];
            const estoqueDisponivel = produto.estoque ?? produto.estoque_produto;

            if (estoqueDisponivel < quantidade) {
                return res.status(400).json({ message: "Estoque insuficiente para este produto." });
            }

            const precoUnitario = Number(produto.preco ?? produto.preco_produto);
            const statusPedido = pedidoSelecionado[0].status_pedido;
            const valorAnterior = Number(pedidoSelecionado[0].valor_total);
            const subTotal = ItensPedidos.calcularSubTotal(quantidade, precoUnitario);
            const valorTotal = Number((valorAnterior + subTotal).toFixed(2));

            const pedido = Pedido.editar({ statusPedido, valorTotal, id });
            const itemPedido = ItensPedidos.criar({ precoUnitario, subTotal, quantidade, idProduto });

            const result = await pedidoRepository.adicionarItemPedido(pedido, itemPedido);

            return res.status(200).json({ message: "Item adicionado ao pedido com sucesso", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },

    atualizarItemPedido: async (req, res) => {
        try {
            const id = Number(req.params.id);
            let { idProduto, quantidade, idPedido } = req.body;

            const itemSelecionado = await pedidoRepository.buscarItemPorId(id);
            if (!itemSelecionado || itemSelecionado.length === 0) {
                return res.status(404).json({ message: "Item não encontrado." });
            }

            const itemAtual = itemSelecionado[0];
            const quantidadeAntiga = itemAtual.quantidade;

            idProduto = idProduto ?? itemAtual.id_produto;
            quantidade = quantidade ?? itemAtual.quantidade;
            idPedido = idPedido ?? itemAtual.id_pedido;

            const produtoSelecionado = await produtoRepository.selecionarPorId(idProduto);
            if (!produtoSelecionado || produtoSelecionado.length === 0) {
                return res.status(404).json({ message: "Produto não encontrado." });
            }

            const produto = produtoSelecionado[0];
            const estoqueDisponivel = produto.estoque ?? produto.estoque_produto;
            const diferencaQuantidade = quantidade - quantidadeAntiga;

            if (diferencaQuantidade > 0 && estoqueDisponivel < diferencaQuantidade) {
                return res.status(400).json({ message: "Estoque insuficiente para aumentar a quantidade deste item." });
            }

            const precoUnitario = Number(produto.preco ?? produto.preco_produto);
            const subTotal = ItensPedidos.calcularSubTotal(quantidade, precoUnitario);

            const itemPedido = ItensPedidos.editar({ precoUnitario, subTotal, quantidade, idProduto, id });

            const result = await pedidoRepository.atualizarItemPedido(itemPedido, idPedido, quantidadeAntiga);

            return res.status(200).json({ message: "Item do pedido atualizado com sucesso", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },

    deletarItemPedido: async (req, res) => {
        try {
            const id = Number(req.params.id);

            const itemSelecionado = await pedidoRepository.buscarItemPorId(id);
            if (!itemSelecionado || itemSelecionado.length === 0) {
                return res.status(404).json({ message: "Item não encontrado." });
            }

            const itemAtual = itemSelecionado[0];
            const dadosItem = {
                precoUnitario: Number(itemAtual.preco_unitario),
                subTotal: Number(itemAtual.subtotal),
                quantidade: itemAtual.quantidade,
                idProduto: itemAtual.id_produto
            };

            const itemDeletado = ItensPedidos.criar(dadosItem);
            const idPedido = itemAtual.id_pedido;

            const result = await pedidoRepository.deletarItemPedido(id, itemDeletado, idPedido);

            return res.status(200).json({ message: "Item removido com sucesso", result });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },

    listarPedidosAdmin: async (req, res) => {
        try {
            const pedidos = await pedidoRepository.listarPedidosAdmin();
            return res.status(200).json({
                message: "Lista de pedidos para administração:",
                total: pedidos.length,
                result: pedidos
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    },

    atualizarStatusPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.id);
            const { statusPedido } = req.body;

            const statusValidos = ["Pendente", "Em Processamento", "Enviado", "Entregue", "Cancelado"];

            if (!statusPedido || !statusValidos.includes(statusPedido)) {
                return res.status(400).json({
                    message: `Status inválido. Envie um dos seguintes valores: ${statusValidos.join(", ")}`
                });
            }

            const pedidoExiste = await pedidoRepository.selectPedidosId(idPedido);
            if (!pedidoExiste || pedidoExiste.length === 0) {
                return res.status(404).json({ message: "Pedido não encontrado." });
            }

            await pedidoRepository.atualizarStatusPedido(idPedido, statusPedido);

            return res.status(200).json({
                message: `Status do pedido #${idPedido} atualizado com sucesso para '${statusPedido}'.`
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro interno do servidor", errorMessage: error.message });
        }
    }
};

export default pedidoControllers;