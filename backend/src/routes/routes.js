import { Router } from "express";
import clienteRoutes from "./cliente.routes.js";
import senhaRoutes from "./senha.routes.js"; 

const routes = Router();

routes.use('/clientes', clienteRoutes);
routes.use('/senha', senhaRoutes);

export default routes;