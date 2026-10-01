import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import { validarTokenAdmin } from "../middlewares/authMiddleware.js";

const adminRoutes = Router();

adminRoutes.post('/logout', adminController.logoutAdmin);
adminRoutes.get('/login/teste', validarTokenAdmin, adminController.testeLoginAdmin);

export default adminRoutes;