import { Router } from 'express';
import { login, perfil } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = Router();

router.post('/login', login);
router.get('/me', verifyToken, perfil);
export default router;