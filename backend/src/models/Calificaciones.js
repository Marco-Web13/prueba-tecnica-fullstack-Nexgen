import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Calificacion = sequelize.define("Calificacion", {
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
  },
  maestro_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nota: {
    type: DataTypes.DECIMAL(5, 2), // Ejemplo: 95.50
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: "calificaciones",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  paranoid: true, 
  deletedAt: "deleted_at"
});

export default Calificacion;