import { Router } from 'express';
import { obtenerAlumnos, registrarCalificacion, obtenerMaterias } from '../controllers/maestroController.js';
import { verifyToken, authorizeRol } from '../middlewares/authMiddleware.js';

const router = Router();

// Aplicamos verifyToken a TODAS las rutas
router.use(verifyToken);
router.use(authorizeRol(['MAESTRO']))

router.get('/materias', obtenerMaterias);
router.get('/materias/:materiaId/alumnos', obtenerAlumnos);
router.post('/calificaciones', registrarCalificacion);

export default router;