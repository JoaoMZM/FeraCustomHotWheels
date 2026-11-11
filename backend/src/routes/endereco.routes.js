import { Router } from "express";
import enderecoController from "../controllers/endereco.controller.js";

const enderecoRoutes = Router();

// Rotas do cliente logado (protegidas por validarToken em routes.js)
enderecoRoutes.get('/', enderecoController.obterMeuEndereco);
enderecoRoutes.put('/', enderecoController.salvarMeuEndereco);

export default enderecoRoutes;
