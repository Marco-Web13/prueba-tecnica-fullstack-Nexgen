import { Alumno, Calificaciones, Materia, Asignacion } from '../models/index.js';

export const obtenerMaterias = async (req, res) => {
  try {
    const maestroId = req.user.id;
    const asignaciones = await Asignacion.findAll({
      where: { maestro_id: maestroId },
      include: [
        {
          model: Materia,
          as: 'materia',
          attributes: ['id', 'nombre', 'codigo', 'descripcion']
        }
      ]
    });

    const materias = asignaciones.map(a => a.materia);
    res.json(materias);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener materias' });
  }
};

export const obtenerAlumnos = async (req, res) => {
  try {
    const { materiaId } = req.params;
    const maestroId = req.user.id;
    const asignacion = await Asignacion.findOne({
      where: { maestro_id: maestroId, materia_id: materiaId }
    });

    if (!asignacion) {
      return res.status(403).json({ message: 'No tienes asignada esta materia.' });
    }

    const materiaConAlumnos = await Materia.findByPk(materiaId, {
      include: [
        {
          model: Alumno,
          as: 'estudiantes', 
          through: { attributes: [] } 
        }
      ]
    });

    if (!materiaConAlumnos) {
      return res.status(404).json({ message: 'Materia no encontrada' });
    }

    const alumnosInscritos = materiaConAlumnos.estudiantes || [];
    const listaConNotas = await Promise.all(alumnosInscritos.map(async (alumno) => {
      const calificacionesEncontradas = await Calificaciones.findOne({
        where: { 
          alumno_id: alumno.id, 
          materia_id: materiaId 
        }
      });
      
      return {
        id: alumno.id,
        nombre: alumno.nombre,
        matricula: alumno.matricula,
        grupo: alumno.grupo,
        nota: calificacionesEncontradas ? calificacionesEncontradas.nota : null,
        observaciones: calificacionesEncontradas ? calificacionesEncontradas.observaciones : ''
      };
    }));

    listaConNotas.sort((a, b) => a.nombre.localeCompare(b.nombre));

    res.json(listaConNotas);

  } catch (error) {
    console.error("Error en obtenerAlumnos:", error);
    res.status(500).json({ message: 'Error al obtener alumnos' });
  }
};

export const registrarCalificacion = async (req, res) => {
  try {
    const maestroId = req.user.id;
    const { alumno_id, materia_id, nota, observaciones } = req.body; 

    // Validar Asignación
    const esMiMateria = await Asignacion.findOne({ where: { maestro_id: maestroId, materia_id } });
    if (!esMiMateria) return res.status(403).json({ message: 'No impartes esta materia' });

    // Buscar si ya existe calificación previa
    let registroCalificacion = await Calificaciones.findOne({
      where: { alumno_id, materia_id }
    });

    if (registroCalificacion) {
      //UPDATE
      registroCalificacion.nota = nota;
      registroCalificacion.observaciones = observaciones;
      await registroCalificacion.save();
    } else {
      //INSERT
      registroCalificacion = await Calificaciones.create({
        alumno_id,
        materia_id,
        maestro_id: maestroId,
        nota,
        observaciones
      });
    }

    res.json({ message: 'Calificación guardada exitosamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al calificar' });
  }
};