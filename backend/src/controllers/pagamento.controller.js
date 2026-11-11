import pagamentoRepository from "../repositories/pagamento.repository.js";
import clienteRepository from "../repositories/cliente.repository.js";
import { mercadoPago, mpConfig, mpConfigurado, assinaturaWebhookValida } from "../configs/mercadopago.js";
import { FRONTEND_URL } from "../configs/urls.js";

const ehUrlPublica = (url) => url.startsWith('https://') && !/localhost|127\.0\.0\.1/.test(url);

async function pedidoDoCliente(req, res) {
    const idPedido = Number(req.params.id);

    if (!Number.isInteger(idPedido) || idPedido <= 0) {
        res.status(400).json({ message: "Pedido inválido." });
        return null;
    }

    const pedido = await pagamentoRepository.buscarPedido(idPedido);

    if (!pedido || pedido.id_cliente !== req.id_cliente) {
        res.status(404).json({ message: "Pedido não encontrado." });
        return null;
    }

    return pedido;
}

const responderErro = (res, error) => {
    console.error('[pagamento]', error.detalhes ?? error);
    const status = error.status === 503 ? 503 : error.status === 502 ? 502 : 500;
    return res.status(status).json({
        message: status === 500 ? "Erro interno do servidor" : error.message,
    });
};

const pagamentoController = {

    criarCheckout: async (req, res) => {
        try {
            if (!mpConfigurado()) {
                return res.status(503).json({ message: "Pagamento indisponível no momento." });
            }

            const pedido = await pedidoDoCliente(req, res);
            if (!pedido) return;

            if (pedido.status_pedido !== 'Pendente') {
                return res.status(400).json({ message: `Este pedido está '${pedido.status_pedido}' e não aceita novo pagamento.` });
            }

            if (await pagamentoRepository.temPagamentoAprovado(pedido.id_pedido)) {
                return res.status(400).json({ message: "Este pedido já foi pago." });
            }

            const itens = await pagamentoRepository.itensDoPedido(pedido.id_pedido);
            if (itens.length === 0) {
                return res.status(400).json({ message: "Pedido sem itens." });
            }

            const cliente = await clienteRepository.selecionarPorId(req.id_cliente);

            const idPedido = String(pedido.id_pedido);
            const publica = ehUrlPublica(FRONTEND_URL);

            const preferencia = {
                items: itens.map((i) => ({
                    id: i.id_produto,
                    title: String(i.nome).slice(0, 250),
                    quantity: Number(i.quantidade),
                    unit_price: Number(i.preco_unitario),
                    currency_id: 'BRL',
                })),

                external_reference: idPedido,
                metadata: { id_pedido: pedido.id_pedido },
                notification_url: mpConfig.notificationUrl,
                back_urls: {
                    success: mpConfig.backUrl,
                    failure: mpConfig.backUrl,
                    pending: mpConfig.backUrl,
                },
                ...(publica ? { auto_return: 'approved' } : {}),
                statement_descriptor: 'FERACUSTOM',
            };

            const criada = await mercadoPago.criarPreferencia(
                preferencia,
                `pedido-${idPedido}-${Date.now()}`
            );

            await pagamentoRepository.criarTentativa({
                idPedido: pedido.id_pedido,
                valor: Number(pedido.valor_total),
                idPreferencia: criada.id,
                emailPagador: cliente?.email ?? null,
            });

            return res.status(201).json({
                message: "Checkout criado.",
                idPreferencia: criada.id,
                urlPagamento: criada.init_point,
            });
        } catch (error) {
            return responderErro(res, error);
        }
    },

    listarDoPedido: async (req, res) => {
        try {
            const pedido = await pedidoDoCliente(req, res);
            if (!pedido) return;

            const pagamentos = await pagamentoRepository.listarPorPedido(pedido.id_pedido);
            return res.status(200).json({ statusPedido: pedido.status_pedido, pagamentos });
        } catch (error) {
            return responderErro(res, error);
        }
    },

    sincronizar: async (req, res) => {
        try {
            const pedido = await pedidoDoCliente(req, res);
            if (!pedido) return;

            let resultado = { statusPedido: pedido.status_pedido, statusPagamento: null };

            if (mpConfigurado()) {
                const pagamentos = await mercadoPago.buscarPagamentosPorReferencia(String(pedido.id_pedido));

                const escolhido = pagamentos.find((p) => p.status === 'approved') ?? pagamentos[0];

                if (escolhido) {
                    const aplicado = await pagamentoRepository.aplicarPagamentoGateway(escolhido);
                    if (!aplicado.ignorado) resultado = aplicado;
                }
            }

            return res.status(200).json({
                statusPedido: resultado.statusPedido,
                statusPagamento: resultado.statusPagamento,
            });
        } catch (error) {
            return responderErro(res, error);
        }
    },

    webhook: async (req, res) => {
        try {
            const tipo = req.body?.type ?? req.query.type ?? req.query.topic;
            const idPagamento = req.body?.data?.id ?? req.query['data.id'] ?? (req.query.topic === 'payment' ? req.query.id : undefined);

            if (tipo !== 'payment' || !idPagamento) {
                return res.sendStatus(200);
            }

            if (!assinaturaWebhookValida(req, req.query['data.id'] ?? idPagamento)) {
                console.warn('[pagamento] Webhook com assinatura inválida descartado.');
                return res.sendStatus(401);
            }

            const pagamento = await mercadoPago.buscarPagamento(idPagamento);
            const aplicado = await pagamentoRepository.aplicarPagamentoGateway(pagamento);

            if (aplicado.ignorado) {
                console.warn(`[pagamento] Webhook ${idPagamento} ignorado: ${aplicado.motivo}`);
            }

            return res.sendStatus(200);
        } catch (error) {
            console.error('[pagamento] Falha no webhook:', error.detalhes ?? error);
            return res.sendStatus(500);
        }
    },
};

export default pagamentoController;
