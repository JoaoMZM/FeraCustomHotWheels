import produtoRoutes from "./produto.routes.js";
import { Router } from "express";
import clienteRoutes from "./cliente.routes.js";
import senhaRoutes from "./senha.routes.js";
import categoriaRoutes from "./categoria.routes.js";
import validarToken, { validarTokenAdmin } from "../middlewares/authMiddleware.js";
import { pagamentoRoutes, pagamentoWebhookRoutes } from "./pagamento.routes.js";
import { chatRoutes, chatAdminRoutes } from "./chat.routes.js";
import pedidoRoutes from "./pedido.routes.js";
import adminRoutes from "./adimin.routes.js";
import adminProdutoRoutes from "./admin.produtos.routes.js";
import adminPedidoRoutes from "./admin.pedidos.routes.js";
import enderecoRoutes from "./endereco.routes.js";

const routes = Router();

routes.use('/clientes', clienteRoutes);
routes.use('/senha', senhaRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/categorias', categoriaRoutes);

routes.use('/admin', adminRoutes);
routes.use('/admin/produtos', adminProdutoRoutes);
routes.use('/admin/pedidos', adminPedidoRoutes);

routes.use('/pagamentos', pagamentoWebhookRoutes);
routes.use('/chat/admin', validarTokenAdmin, chatAdminRoutes);

routes.use(validarToken);

routes.use('/pedidos', pedidoRoutes);
routes.use('/enderecos', enderecoRoutes);
routes.use('/pagamentos', pagamentoRoutes);
routes.use('/chat', chatRoutes);

export default routes;
