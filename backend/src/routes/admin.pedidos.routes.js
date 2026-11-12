import { Router } from "express";
import pedidoControllers from "../controllers/pedido.controller.js";
import { validarTokenAdmin } from "../middlewares/authMiddleware.js";

const adminPedidoRoutes = Router();

adminPedidoRoutes.get('/', validarTokenAdmin, pedidoControllers.listarPedidosAdmin);
adminPedidoRoutes.patch('/:id/status', validarTokenAdmin, pedidoControllers.atualizarStatusPedido);

export default adminPedidoRoutes;
