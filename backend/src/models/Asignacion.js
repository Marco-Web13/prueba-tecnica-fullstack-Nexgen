import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Asignacion = sequelize.define('Asignacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cupo_maximo: {
    type: DataTypes.INTEGER,
    defaultValue: 40,
    validate: {
      min: 1
    }
  }
  // Los IDs de maestro y materia se crean en las relaciones (Paso 4)
}, {
  tableName: 'asignaciones',
  timestamps: true
});

export default Asignacion;