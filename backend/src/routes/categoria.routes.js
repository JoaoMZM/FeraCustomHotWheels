import { Router } from "express";
import categoriaController from "../controllers/categoria.controller.js";
import { validarTokenAdmin } from "../middlewares/authMiddleware.js";

const categoriaRoutes = Router();

categoriaRoutes.post('/', validarTokenAdmin, categoriaController.criar);
categoriaRoutes.get('/', categoriaController.selecionar);
categoriaRoutes.get('/:id', categoriaController.selecionarPorId);

export default categoriaRoutes;
