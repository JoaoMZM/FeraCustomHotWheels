import produtoRoutes from "./produto.routes.js";
import { Router } from "express";
import clienteRoutes from "./cliente.routes.js";
import senhaRoutes from "./senha.routes.js";
import categoriaRoutes from "./categoria.routes.js";
import validarToken from "../middlewares/authMiddleware.js";
import pedidoRoutes from "./pedido.routes.js";
import adminRoutes from "./adimin.routes.js";
import adminProdutoRoutes from "./admin.produtos.routes.js";

const routes = Router();

routes.use('/clientes', clienteRoutes);
routes.use('/senha', senhaRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/categorias', categoriaRoutes);

routes.use('/admin', adminRoutes);
routes.use('/admin/produtos', adminProdutoRoutes);

routes.use(validarToken);

routes.use('/pedidos', pedidoRoutes);

export default routes;