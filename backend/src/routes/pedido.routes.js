import { Router } from "express";
import pedidoControllers from "../controllers/pedido.controller.js";
import { validarTokenAdmin } from "../middlewares/authMiddleware.js";

const pedidoRoutes = Router();

// Rotas do cliente (protegidas por validarToken em routes.js).
// As rotas de administração de pedidos ficam em admin.pedidos.routes.js.
pedidoRoutes.post('/', pedidoControllers.adicionarPedido);
pedidoRoutes.get('/', pedidoControllers.selecionarPedido);
pedidoRoutes.post('/:id/item', pedidoControllers.adicionarItem);
pedidoRoutes.put('/item/:id', pedidoControllers.atualizarItemPedido);
pedidoRoutes.delete('/item/:id', pedidoControllers.deletarItemPedido);
pedidoRoutes.get("/admin/pedidos", validarTokenAdmin, pedidoControllers.listarPedidosAdmin);
pedidoRoutes.post('/:id/item', pedidoControllers.adicionarItem);
pedidoRoutes.put('/item/:id', pedidoControllers.atualizarItemPedido);
pedidoRoutes.delete('/item/:id', pedidoControllers.deletarItemPedido);
pedidoRoutes.patch("/admin/pedidos/:id/status", validarTokenAdmin, pedidoControllers.atualizarStatusPedido);

export default pedidoRoutes;
