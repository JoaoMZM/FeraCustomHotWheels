import produtoController from "../controllers/produto.controller.js";
import { Router } from "express";

const produtoRoutes = Router();

produtoRoutes.put('/atualizar', produtoController.editar);
produtoRoutes.put('/desativar', produtoController.desativar);

export default produtoRoutes;
