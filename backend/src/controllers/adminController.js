import { Usuario, Materia, Asignacion, Alumno, Calificaciones, Inscripcion } from '../models/index.js';

export const obtenerMaestros = async (req, res) => {
  const maestros = await Usuario.findAll({ where: { rol: 'MAESTRO' } });
  res.json(maestros);
};

export const crearMaestro = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    await Usuario.create({ nombre, email, password_hash: password, rol: 'MAESTRO' });
    res.json({ message: 'Maestro creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear maestro', error: error.message });
  }
};

export const actualizarMaestro = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    usuario.nombre = nombre;
    usuario.email = email;
    if (password) usuario.password_hash = password;
    
    await usuario.save();
    res.json({ message: 'Maestro actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};

export const eliminarMaestro = async (req, res) => {
  try {
    const { id } = req.params;
    await Usuario.destroy({ where: { id } });
    res.json({ message: 'Maestro eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'No se puede eliminar (tiene datos asociados)', error: error.message });
  }
};
// **************************
export const obtenerMaterias = async (req, res) => {
  const materias = await Materia.findAll();
  res.json(materias);
};

export const crearMateria = async (req, res) => {
  try {
    await Materia.create({ ...req.body, estatus: 1 });
    res.json({ message: 'Materia creada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear materia', error: error.message });
  }
};

export const actualizarMateria = async (req, res) => {
  try {
    const { id } = req.params;
    await Materia.update(req.body, { where: { id } });
    res.json({ message: 'Materia actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};

export const eliminarMateria = async (req, res) => {
  try {
    await Materia.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Materia eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'No se puede eliminar (tiene alumnos o maestros)', error: error.message });
  }
};

// **************************
export const obtenerAlumnos = async (req, res) => {
  const alumnos = await Alumno.findAll({ order: [['nombre', 'ASC']] });
  res.json(alumnos);
};

export const inscribirAlumno = async (req, res) => {
  try {
    await Alumno.create(req.body);
    res.json({ message: 'Alumno inscrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al inscribir', error: error.message });
  }
};

export const actualizarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    await Alumno.update(req.body, { where: { id } });
    res.json({ message: 'Alumno actualizado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};

export const eliminarAlumno = async (req, res) => {
  try {
    await Alumno.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Alumno eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};

// **************************
export const asignarMateria = async (req, res) => {
  try {
    const { maestroId } = req.params;
    const { materia_id } = req.body;
    const existeAsignacion = await Asignacion.findOne({
      where: { 
        maestro_id: maestroId, 
        materia_id: materia_id 
      }
    });

    if (existeAsignacion) {
      return res.status(400).json({ message: 'El maestro ya imparte esta materia' });
    }

    await Asignacion.create({ maestro_id: maestroId, materia_id });
    res.json({ message: 'Asignación creada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al asignar', error: error.message });
  }
};
// **************************

export const inscribirAlumnoEnMateria = async (req, res) => {
  try {
    const { alumno_id, materia_id } = req.body;
    const existe = await Inscripcion.findOne({ where: { alumno_id, materia_id } });
    if (existe) {
      return res.status(400).json({ message: 'El alumno ya está inscrito en esta materia' });
    }

    await Inscripcion.create({ alumno_id, materia_id });
    res.json({ message: 'Alumno inscrito correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al inscribir alumno', error: error.message });
  }
};

// **************************
export const obtenerReporteCompleto = async (req, res) => {
  try {
    const calificaciones = await Calificaciones.findAll({
      include: [
        { model: Alumno, as: 'alumno', attributes: ['nombre', 'matricula', 'grupo'] },
        { model: Materia, as: 'materia', attributes: ['nombre', 'codigo'] },
        { model: Usuario, as: 'docente', attributes: ['nombre'] }
      ],
      order: [['alumno_id', 'ASC']]
    });
    res.json(calificaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error en reporte', error: error.message });
  }
};

export const actualizarCalificacionAdmin = async (req, res) => {
  try {
    const { id } = req.params; // ID de la calificación
    const { nota, observaciones } = req.body;

    const calificacion = await Calificaciones.findByPk(id);
    if (!calificacion) {
      return res.status(404).json({ message: 'Calificación no encontrada' });
    }

    calificacion.nota = nota;
    if (observaciones !== undefined) calificacion.observaciones = observaciones;
    
    await calificacion.save();

    res.json({ message: 'Calificación actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar calificación' });
  }
};

// Soft Delete de calificación
export const deleteCalificacion = async (req, res) => {
  try {
    const { id } = req.params;
    await Calificaciones.destroy({ where: { id } });
    res.json({ message: 'Calificación inactivada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al inactivar' });
  }
};