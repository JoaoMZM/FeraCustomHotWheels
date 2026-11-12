import { Router } from "express";
import chatController from "../controllers/chat.controller.js";

export const chatRoutes = Router();

chatRoutes.get('/produtos/:idProduto', chatController.buscarConversaDoProduto);
chatRoutes.post('/produtos/:idProduto/mensagens', chatController.enviarDoCliente);

export const chatAdminRoutes = Router();

chatAdminRoutes.get('/conversas', chatController.listarConversas);
chatAdminRoutes.get('/conversas/:id/mensagens', chatController.listarMensagensAdmin);
chatAdminRoutes.post('/conversas/:id/mensagens', chatController.enviarDoVendedor);
