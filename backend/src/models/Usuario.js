import { DataTypes } from "sequelize" 
import sequelize from "../config/db.js"
import bcrypt from "bcryptjs";

const Usuario = sequelize.define("Usuario", {
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
    type: DataTypes.ENUM("MAESTRO", "CONTROL_ESCOLAR"),
    allowNull: false,
    validate: {
      isIn: [["MAESTRO", "CONTROL_ESCOLAR"]]
    }
  }
}, {
  tableName: 'usuarios', 
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at'
}) 

//hashear la contraseña antes de crear el usuario
Usuario.beforeCreate(async (usuario) => {
  if (usuario.password_hash) {
    const salt = bcrypt.genSaltSync(10);
    usuario.password_hash = bcrypt.hashSync(usuario.password_hash, salt);
  }
});

Usuario.beforeUpdate(async (usuario) => {
  if (usuario.changed('password_hash')) {
    const salt = bcrypt.genSaltSync(10);
    usuario.password_hash = bcrypt.hashSync(usuario.password_hash, salt);
  }
});

Usuario.prototype.validarPassword = async function (passwordIngresado) {
  return bcrypt.compareSync(passwordIngresado, this.password_hash);
};

export default Usuario;