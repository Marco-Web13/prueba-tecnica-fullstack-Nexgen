import { Alumno, Materia, Calificaciones } from '../models/index.js';

//Obtener lista de alumnos para calificar
export const obtenerAlumnos = async (req, res) => {
  try {

    const alumnos = await Alumno.findAll();
    res.json(alumnos);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener alumnos" });
  }
};

//Registrar y Actualizar Calificaciones
export const registrarCalificacion = async (req, res) => {
  try {
    const { alumno_id, materia_id, nota, observaciones } = req.body;
    const maestro_id = req.usuario.id;

    const materia = await Materia.findByPk(materia_id);
    if (!materia) return res.status(404).json({ message: "Materia no encontrada" });
    if (nota < 0 || nota > 100) {
      return res.status(400).json({ message: "La calificacion debe estar entre 0 y 100" });
    }

    let calificacion = await Calificaciones.findOne({
      where: { alumno_id, materia_id, maestro_id }
    });

    if (calificacion) {
      calificacion.nota = nota;
      calificacion.observaciones = observaciones;
      await calificacion.save();
      return res.json({ message: "Calificación actualizada", calificacion });
    } else {
      calificacion = await Calificaciones.create({
        alumno_id,
        materia_id,
        maestro_id,
        nota,
        observaciones
      })
      return res.status(201).json({ message: "Calificación registrada correctamente", calificacion });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar calificación" });
  }
};