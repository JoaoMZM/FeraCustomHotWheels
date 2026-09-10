import { Router } from 'express';
import { senhaController } from '../controllers/senha.controller.js';

const router = Router();

router.post('/recuperar-senha', senhaController.solicitarRecuperacao);
router.get('/validar-token-recuperacao', senhaController.validarLink);
router.post('/redefinir-senha', senhaController.redefinirSenha);

export default router;