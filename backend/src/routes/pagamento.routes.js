import { Router } from "express";
import pagamentoController from "../controllers/pagamento.controller.js";

export const pagamentoRoutes = Router();

pagamentoRoutes.post('/pedidos/:id/checkout', pagamentoController.criarCheckout);
pagamentoRoutes.post('/pedidos/:id/sincronizar', pagamentoController.sincronizar);
pagamentoRoutes.get('/pedidos/:id', pagamentoController.listarDoPedido);

export const pagamentoWebhookRoutes = Router();

pagamentoWebhookRoutes.post('/webhook', pagamentoController.webhook);
