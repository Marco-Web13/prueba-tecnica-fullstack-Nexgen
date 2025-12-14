import sequelize from '../config/db.js';
import { Usuario, Alumno, Materia, Asignacion, Inscripcion } from '../models/index.js';

const seedDatabase = async () => {
  try {

    const usuariosExistentes = await Usuario.count();
    if (usuariosExistentes > 0) return

    await sequelize.authenticate();
    await sequelize.sync({ force: true }); 

    console.log("Semilla creada correctamente");

    // Crear Usuarios
    const admin = await Usuario.create({
      nombre: 'Admin',
      email: 'admin@gmail.com',
      password_hash: '1234', 
      rol: 'CONTROL_ESCOLAR'
    });

    const maestro1 = await Usuario.create({
      nombre: 'Profesor Jirafales',
      email: 'jirafales@gmail.com',
      password_hash: '1234',
      rol: 'MAESTRO'
    });

    const maestro2 = await Usuario.create({
      nombre: 'Maestra Miel',
      email: 'miel@gmail.com',
      password_hash: '1234',
      rol: 'MAESTRO'
    });

    //Crear Materias
    const matematicas = await Materia.create({
      codigo: 'MATE',
      nombre: 'Matemáticas',
      descripcion: 'Álgebra básica y trigonometría',
      estatus: 1
    });

    const programacion = await Materia.create({
      codigo: 'PROGRA',
      nombre: 'PROGRAMACION',
      descripcion: 'Fundamentos de la programacion',
      estatus: 1
    });

    //Crear Alumnos
    const alumno1 = await Alumno.create({
      nombre: 'Marco Josue',
      matricula: '21170400',
      fecha_nacimiento: '2003-04-02',
      grupo: 'A'
    });

    const alumno2 = await Alumno.create({
      nombre: 'Poppy Meza',
      matricula: 'GOD',
      fecha_nacimiento: '2003-04-02',
      grupo: 'A'
    });

    await Asignacion.create({
      maestro_id: maestro1.id,
      materia_id: matematicas.id,
      cupo_maximo: 10
    });

    await Asignacion.create({
      maestro_id: maestro2.id,
      materia_id: programacion.id,
      cupo_maximo: 10
    });
    
    await Asignacion.create({
      maestro_id: maestro1.id,
      materia_id: programacion.id,
      cupo_maximo: 10
    });

    await Inscripcion.create({
      alumno_id: alumno2.id,
      materia_id: matematicas.id
    });

    await Inscripcion.create({
      alumno_id: alumno1.id,
      materia_id: programacion.id
    });
    console.log("Base de datos poblada con éxito");
    process.exit(0)
  } catch (error) {
    console.error("Error en el seeding:", error);
    process.exit(1);
  }
}

seedDatabase();