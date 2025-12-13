import sequelize from '../config/db.js';
import { Usuario, Alumno, Materia, Calificaciones } from '../models/index.js';

const seedDatabase = async () => {
  try {
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
      email: 'miel@gamail.com',
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

    const historia = await Materia.create({
      codigo: 'HISTO',
      nombre: 'Historia',
      descripcion: 'Eventos del siglo XIX',
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
      nombre: 'Diego Alejandro',
      matricula: '21170401',
      fecha_nacimiento: '2003-06-20',
      grupo: 'A'
    });

    console.log("Base de datos poblada con éxito");
    process.exit(0)
  } catch (error) {
    console.error("Error en el seeding:", error);
    process.exit(1);
  }
}

seedDatabase();