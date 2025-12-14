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

//OBTENER ALUMNOS DE UNA MATERIA
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

    const alumnos = await Alumno.findAll({
        order: [['nombre', 'ASC']]
    });

    const listaConNotas = await Promise.all(alumnos.map(async (alumno) => {
      const Calificaciones = await Calificaciones.findOne({
        where: { 
          alumno_id: alumno.id, 
          materia_id: materiaId //filtramos por materia
        }
      });
      
      return {
        id: alumno.id,
        nombre: alumno.nombre,
        matricula: alumno.matricula,
        grupo: alumno.grupo,
        nota: Calificaciones ? Calificaciones.nota : null,
        observaciones: Calificaciones ? Calificaciones.observaciones : ''
      };
    }));

    res.json(listaConNotas);

  } catch (error) {
    console.error(error);
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

    // Buscar si ya existe
    let Calificaciones = await Calificaciones.findOne({
      where: { alumno_id, materia_id }
    });

    if (Calificaciones) {
      // EDITAR (UPDATE)
      Calificaciones.nota = nota;
      Calificaciones.observaciones = observaciones;
      await Calificaciones.save();
    } else {
      // CREAR (INSERT)
      Calificaciones = await Calificaciones.create({
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