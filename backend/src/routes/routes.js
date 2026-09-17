import produtoRoutes from "./produto.routes.js";
import { Router } from "express";
import clienteRoutes from "./cliente.routes.js";
import senhaRoutes from "./senha.routes.js";
import categoriaRoutes from "./categoria.routes.js";

const routes = Router();

routes.use('/produtos', produtoRoutes);
routes.use('/clientes', clienteRoutes);
routes.use('/senha', senhaRoutes);
routes.use('/produtos', produtoRoutes);
routes.use('/categorias', categoriaRoutes);

export default routes;