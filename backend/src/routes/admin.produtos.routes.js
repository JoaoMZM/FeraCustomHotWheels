import { Router } from "express";
import produtoController from "../controllers/produto.controller.js";
import { validarTokenAdmin } from "../middlewares/authMiddleware.js";
import uploadImage from "../middlewares/uploadImage.middleware.js";

const adminProdutoRoutes = Router();

adminProdutoRoutes.get('/', validarTokenAdmin, produtoController.buscarTodosProdutos);
adminProdutoRoutes.post('/', validarTokenAdmin, uploadImage, produtoController.incluirProduto);
adminProdutoRoutes.put('/:id', validarTokenAdmin, uploadImage, produtoController.editar);
adminProdutoRoutes.patch('/:idProduto/status', validarTokenAdmin, produtoController.desativar);

export default adminProdutoRoutes;