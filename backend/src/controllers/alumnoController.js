import { Alumno } from '../models/index.js';

export const obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await Alumno.findAll();
    res.json(alumnos);
  } catch (error) {
    res.status(500).json({message: "Error al obtener alumnos"});
  }
};

//Crear un nuevo alumno
export const crearAlumno = async (req, res) => {
  try {
    const { nombre, matricula, fecha_nacimiento, grupo } = req.body;
    //Validación
    if (!nombre || !matricula) {
      return res.status(400).json({ message:"Nombre y matrícula son obligatorios"});
    }

    //verificar si la matricula ya existe
    const existe = await Alumno.findOne({ where: { matricula } });
    if (existe) {
      return res.status(400).json({ message: 'La matricula ya está registrada' });
    }

    const nuevoAlumno = await Alumno.create({
      nombre,
      matricula,
      fecha_nacimiento,
      grupo
    });

    res.status(201).json({ message: "Alumno inscrito correctamente", alumno: nuevoAlumno });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al inscribir alumno' });
  }
};