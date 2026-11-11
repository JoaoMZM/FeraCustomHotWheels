import { Router } from "express";
import pedidoControllers from "../controllers/pedido.controller.js";
import { validarTokenAdmin } from "../middlewares/authMiddleware.js";

const adminPedidoRoutes = Router();

// GET   /admin/pedidos              -> lista todos os pedidos (com cliente, endereço e itens)
// PATCH /admin/pedidos/:id/status   -> atualiza o status de um pedido
adminPedidoRoutes.get('/', validarTokenAdmin, pedidoControllers.listarPedidosAdmin);
adminPedidoRoutes.patch('/:id/status', validarTokenAdmin, pedidoControllers.atualizarStatusPedido);

export default adminPedidoRoutes;
