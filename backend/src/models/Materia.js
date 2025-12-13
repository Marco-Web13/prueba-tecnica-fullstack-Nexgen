import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Materia = sequelize.define("Materia", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estatus: {
    type: DataTypes.SMALLINT,
    defaultValue: 1,
    allowNull: true
  }
}, {
  tableName: 'materias',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Materia;