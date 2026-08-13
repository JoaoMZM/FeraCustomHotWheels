import { Router } from "express";
import categoriaRoutes from "./categoria.routes.js";
import produtoRoutes from "./produto.routes.js";

const routes = Router();

routes.use('/produtos', produtoRoutes);
routes.use('/categorias', categoriaRoutes);

export default routes;