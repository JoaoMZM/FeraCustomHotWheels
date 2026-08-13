import { Router } from "express";
import categoriaController from "../controllers/categoria.controller.js";

const categoriaRoutes = Router();

categoriaRoutes.post('/', categoriaController.criar);
categoriaRoutes.get('/', categoriaController.selecionar);
categoriaRoutes.get('/:id', categoriaController.selecionarPorId);

export default categoriaRoutes;