import { Router } from 'express';
import { senhaController } from '../controllers/senha.controller.js';

const router = Router();

router.post('/recuperar-senha', authController.solicitarRecuperacao);
router.get('/validar-token-recuperacao', authController.validarLinkRecuperacao);
router.post('/redefinir-senha', authController.redefinirSenha);

export default router;