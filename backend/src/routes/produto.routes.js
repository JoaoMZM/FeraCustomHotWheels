import { Router } from "express";
import produtoController from "../controllers/produto.controller.js";

const produtoRoutes = Router();

produtoRoutes.get('/', produtoController.buscarProdutosPublico);
produtoRoutes.get('/categoria/:idCategoria', produtoController.buscarProdutosPorCategoria);
produtoRoutes.get('/:id', produtoController.buscarProdutoPorID);

export default produtoRoutes;