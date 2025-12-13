import { DataTypes } from 'sequelize' 
import sequelize from '../config/db.js' 

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(120),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true //Validación extra de Sequelize
    }
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('MAESTRO', 'CONTROL_ESCOLAR'),
    allowNull: false,
    validate: {
      isIn: [['MAESTRO', 'CONTROL_ESCOLAR']]
    }
  }
}, {
  tableName: 'usuarios', 
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}) 

export default Usuario 