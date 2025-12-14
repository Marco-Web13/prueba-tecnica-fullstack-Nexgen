import Usuario from './Usuario.js';
import Alumno from './Alumno.js';
import Materia from './Materia.js';
import Calificaciones from './Calificaciones.js';
import Asignacion from './Asignacion.js'
import Inscripcion from './Inscripcion.js'

Usuario.hasMany(Asignacion, { foreignKey: 'maestro_id' });
Asignacion.belongsTo(Usuario, { foreignKey: 'maestro_id', as: 'maestro' });

// Una Materia tiene muchas asignaciones
Materia.hasMany(Asignacion, { foreignKey: 'materia_id' });
Asignacion.belongsTo(Materia, { foreignKey: 'materia_id', as: 'materia' });

// Un Alumno > Muchas Calificaciones
Alumno.hasMany(Calificaciones, { foreignKey: 'alumno_id' });
Calificaciones.belongsTo(Alumno, { foreignKey: 'alumno_id', as: 'alumno' });

// Una Materia > Muchas Calificaciones
Materia.hasMany(Calificaciones, { foreignKey: 'materia_id' });
Calificaciones.belongsTo(Materia, { foreignKey: 'materia_id', as: 'materia' });

// Un Maestro(Usuario) > Muchas Calificaciones
Usuario.hasMany(Calificaciones, { foreignKey: 'maestro_id' });
Calificaciones.belongsTo(Usuario, { foreignKey: 'maestro_id', as: 'docente' });

Alumno.belongsToMany(Materia, { through: Inscripcion, foreignKey: 'alumno_id', as: 'clases' });
Materia.belongsToMany(Alumno, { through: Inscripcion, foreignKey: 'materia_id', as: 'estudiantes' });

Inscripcion.belongsTo(Alumno, { foreignKey: 'alumno_id' });
Inscripcion.belongsTo(Materia, { foreignKey: 'materia_id' });

export { Usuario, Alumno, Materia, Calificaciones, Asignacion, Inscripcion };