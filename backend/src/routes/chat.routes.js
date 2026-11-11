import { Router } from "express";
import chatController from "../controllers/chat.controller.js";

// Cliente logado (montado depois do validarToken): /chat/...
export const chatRoutes = Router();

chatRoutes.get('/produtos/:idProduto', chatController.buscarConversaDoProduto);
chatRoutes.post('/produtos/:idProduto/mensagens', chatController.enviarDoCliente);

// Vendedor (montado com validarTokenAdmin): /chat/admin/...
export const chatAdminRoutes = Router();

chatAdminRoutes.get('/conversas', chatController.listarConversas);
chatAdminRoutes.get('/conversas/:id/mensagens', chatController.listarMensagensAdmin);
chatAdminRoutes.post('/conversas/:id/mensagens', chatController.enviarDoVendedor);
