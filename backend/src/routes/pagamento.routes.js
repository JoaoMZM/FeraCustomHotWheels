import { Router } from "express";
import pagamentoController from "../controllers/pagamento.controller.js";

// Rotas do cliente logado (montadas depois do validarToken)
export const pagamentoRoutes = Router();

pagamentoRoutes.post('/pedidos/:id/checkout', pagamentoController.criarCheckout);
pagamentoRoutes.post('/pedidos/:id/sincronizar', pagamentoController.sincronizar);
pagamentoRoutes.get('/pedidos/:id', pagamentoController.listarDoPedido);

// Webhook público (montado ANTES do validarToken: quem chama é o Mercado Pago)
export const pagamentoWebhookRoutes = Router();

pagamentoWebhookRoutes.post('/webhook', pagamentoController.webhook);
