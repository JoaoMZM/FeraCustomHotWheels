import { Router } from "express";
import clienteController from "../controllers/cliente.controller.js";
import validarToken from "../middlewares/authMiddleware.js";
const clienteRoutes = Router();

clienteRoutes.get('/', clienteController.buscarTodosClientes);
clienteRoutes.get('/:id', clienteController.buscarClientePorID);
clienteRoutes.get('/login/teste', validarToken, clienteController.testeLogin);

// ── NOVA ROTA ADICIONADA ──────────────────────────────────────────────────
// Ela vai responder em: GET /clientes/confirmar
clienteRoutes.get('/confirmar', clienteController.confirmarConta);
// ──────────────────────────────────────────────────────────────────────────

clienteRoutes.post('/', clienteController.incluirCliente);
clienteRoutes.post('/login', clienteController.loginCliente);
clienteRoutes.post('/logout', clienteController.logoutCliente);
clienteRoutes.put('/:id', clienteController.atualizarCliente);
clienteRoutes.delete('/:id', clienteController.excluirCliente);

export default clienteRoutes;