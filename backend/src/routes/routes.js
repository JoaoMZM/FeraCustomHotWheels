import { Router } from "express";
import clienteRoutes from "./cliente.routes.js";

const routes = Router();


routes.use('/clientes', clienteRoutes);

export default routes;