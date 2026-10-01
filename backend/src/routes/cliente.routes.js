import { Router } from "express";
import clienteController from "../controllers/cliente.controller.js";
import validarToken from "../middlewares/authMiddleware.js";

const clienteRoutes = Router();

// Rotas com caminho FIXO sempre antes das rotas com parâmetro (/:id)
clienteRoutes.get('/confirmar', clienteController.confirmarConta);
clienteRoutes.get('/validate', validarToken, (req, res) => {
    return res.status(200).json({
        logado: true,
        message: "true",
    });
});

clienteRoutes.get('/', clienteController.buscarTodosClientes);
clienteRoutes.get('/:id', clienteController.buscarClientePorID);

clienteRoutes.post('/', clienteController.incluirCliente);
clienteRoutes.post('/login', clienteController.loginCliente);
clienteRoutes.post('/refresh', clienteController.refreshToken);
clienteRoutes.post('/logout', clienteController.logoutCliente);

clienteRoutes.put('/:id', clienteController.atualizarCliente);
clienteRoutes.delete('/:id', clienteController.excluirCliente);

export default clienteRoutes;
