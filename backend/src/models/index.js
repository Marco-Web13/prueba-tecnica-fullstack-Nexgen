import Usuario from './Usuario.js';
import Alumno from './Alumno.js';
import Materia from './Materia.js';
import Calificaciones from './Calificaciones.js';

// Un Alumno > Muchas Calificaciones
Alumno.hasMany(Calificaciones, { foreignKey: 'alumno_id' });
Calificaciones.belongsTo(Alumno, { foreignKey: 'alumno_id' });

// Una Materia > Muchas Calificaciones
Materia.hasMany(Calificaciones, { foreignKey: 'materia_id' });
Calificaciones.belongsTo(Materia, { foreignKey: 'materia_id' });

// Un Maestro(Usuario) > Muchas Calificaciones
Usuario.hasMany(Calificaciones, { foreignKey: 'maestro_id' });
Calificaciones.belongsTo(Usuario, { foreignKey: 'maestro_id' });

export { Usuario, Alumno, Materia, Calificaciones };