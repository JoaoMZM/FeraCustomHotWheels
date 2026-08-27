import produtoRoutes from "./produto.routes.js";
import { Router } from "express";

const routes = Router();

routes.use('/produtos', produtoRoutes);
export default routes;