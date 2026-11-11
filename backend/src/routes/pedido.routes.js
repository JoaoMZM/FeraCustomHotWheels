import { Router } from "express";
import pedidoControllers from "../controllers/pedido.controller.js";

const pedidoRoutes = Router();

// Rotas do cliente (protegidas por validarToken em routes.js).
// As rotas de administração de pedidos ficam em admin.pedidos.routes.js.
pedidoRoutes.post('/', pedidoControllers.adicionarPedido);
pedidoRoutes.get('/', pedidoControllers.selecionarPedido);
pedidoRoutes.post('/:id/item', pedidoControllers.adicionarItem);
pedidoRoutes.put('/item/:id', pedidoControllers.atualizarItemPedido);
pedidoRoutes.delete('/item/:id', pedidoControllers.deletarItemPedido);

export default pedidoRoutes;
