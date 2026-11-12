import { Router } from "express";
import enderecoController from "../controllers/endereco.controller.js";

const enderecoRoutes = Router();

enderecoRoutes.get('/', enderecoController.obterMeuEndereco);
enderecoRoutes.put('/', enderecoController.salvarMeuEndereco);

export default enderecoRoutes;
