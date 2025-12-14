import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Inscripcion = sequelize.define('Inscripcion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  alumno_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  materia_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Inscripciones',
  timestamps: false
});

export default Inscripcion;