import { Router } from 'express';
import { obtenerAlumnos, crearAlumno } from '../controllers/alumnoController.js';
import { verifyToken, authorizeRol } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(verifyToken);

// GET /api/alumnos > Lo pueden ver Maestros y Control Escolar
router.get('/', authorizeRol(['MAESTRO', 'CONTROL_ESCOLAR']), obtenerAlumnos);

// POST /api/alumnos > solo Control Escolar puede crear
router.post('/', authorizeRol(['CONTROL_ESCOLAR']), crearAlumno);

export default router;