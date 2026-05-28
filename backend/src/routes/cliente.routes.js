import { Router } from "express";
import clienteController from "../controllers/cliente.controller.js";

const clienteRoutes = Router();

clienteRoutes.get('/', clienteController.buscarTodosClientes);
clienteRoutes.get('/:id', clienteController.buscarClientePorID);
clienteRoutes.post('/', clienteController.incluirCliente);
clienteRoutes.put('/:id', clienteController.atualizarCliente);
clienteRoutes.delete('/:id', clienteController.excluirCliente);

export default clienteRoutes;