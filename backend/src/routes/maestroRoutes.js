import { Router } from 'express';
import { obtenerAlumnos, registrarCalificacion } from '../controllers/maestroController.js';
import { verifyToken, authorizeRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Aplicamos verifyToken a TODAS las rutas
router.use(verifyToken);

router.get('/alumnos', authorizeRol(['MAESTRO']), obtenerAlumnos);
router.post('/calificaciones', authorizeRol(['MAESTRO']), registrarCalificacion);

export default router;