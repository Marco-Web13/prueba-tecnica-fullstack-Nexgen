import { Router } from 'express';
import { obtenerMaterias, obtenerAlumnos, registrarCalificacion } from '../controllers/maestroController.js';
import { verifyToken, authorizeRol } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(verifyToken);
router.use(authorizeRol(['MAESTRO']));

router.get('/materias', obtenerMaterias);

router.get('/materias/:materiaId/alumnos', obtenerAlumnos);
router.post('/calificaciones', registrarCalificacion);

export default router;