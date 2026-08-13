import { Router } from "express";
import uploadImage from "../middlewares/uploadImage.middleware.js";
import produtoController from "../controllers/produto.controller.js";

const produtoRoutes = Router();

produtoRoutes.get('/', produtoController.buscarTodosProdutos);
produtoRoutes.get('/:id', produtoController.buscarProdutoPorID);
produtoRoutes.post('/', uploadImage, produtoController.incluirProduto);

export default produtoRoutes;