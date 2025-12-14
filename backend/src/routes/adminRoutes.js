import { Router } from 'express';
import { 
  obtenerMaestros, crearMaestro, actualizarMaestro, eliminarMaestro,
  obtenerMaterias, crearMateria, actualizarMateria, eliminarMateria,
  obtenerAlumnos, inscribirAlumno, actualizarAlumno, eliminarAlumno,
  asignarMateria,
  obtenerReporteCompleto, deleteCalificacion, inscribirAlumnoEnMateria
} from '../controllers/adminController.js';
import { verifyToken, authorizeRol } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(verifyToken);
router.use(authorizeRol(['CONTROL_ESCOLAR']));

// Maestros
router.get('/maestros', obtenerMaestros);
router.post('/maestros', crearMaestro);
router.put('/maestros/:id', actualizarMaestro);
router.delete('/maestros/:id', eliminarMaestro);

// Materias
router.get('/materias', obtenerMaterias);
router.post('/materias', crearMateria);
router.put('/materias/:id', actualizarMateria);
router.delete('/materias/:id', eliminarMateria);

// Alumnos
router.get('/alumnos', obtenerAlumnos);
router.post('/alumnos', inscribirAlumno);
router.put('/alumnos/:id', actualizarAlumno);
router.delete('/alumnos/:id', eliminarAlumno);

// Asignaciones
router.post('/maestros/:maestroId/materias', asignarMateria);
router.post('/inscripciones', inscribirAlumnoEnMateria)

// Reportes
router.get('/reportes', obtenerReporteCompleto);
router.delete('/calificaciones/:id', deleteCalificacion)


export default router;