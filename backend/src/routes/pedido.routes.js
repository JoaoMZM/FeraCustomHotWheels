import { Router } from "express";
import pedidoControllers from "../controllers/pedido.controller.js";

const pedidoRoutes = Router();

pedidoRoutes.post('/', pedidoControllers.adicionarPedido);
pedidoRoutes.get('/', pedidoControllers.selecionarPedido);
pedidoRoutes.get("/admin/pedidos", pedidoControllers.listarPedidosAdmin);
pedidoRoutes.post('/:id/item', pedidoControllers.adicionarItem);
pedidoRoutes.put('/item/:id', pedidoControllers.atualizarItemPedido);
pedidoRoutes.delete('/item/:id', pedidoControllers.deletarItemPedido);
pedidoRoutes.patch("/admin/pedidos/:id/status", pedidoControllers.atualizarStatusPedido);

export default pedidoRoutes;