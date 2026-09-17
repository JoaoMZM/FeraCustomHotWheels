import { Router } from "express";
<<<<<<< HEAD
import clienteRoutes from "./cliente.routes.js";
import senhaRoutes from "./senha.routes.js"; 

const routes = Router();

routes.use('/clientes', clienteRoutes);
routes.use('/senha', senhaRoutes);
=======
import categoriaRoutes from "./categoria.routes.js";
import produtoRoutes from "./produto.routes.js";

const routes = Router();

routes.use('/produtos', produtoRoutes);
routes.use('/categorias', categoriaRoutes);
>>>>>>> feat/cadastroProdutos

export default routes;