import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Usuario from '../models/Usuario.js'

dotenv.config()

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Se requiere email y contraseña" });
    }

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const esValida = await usuario.validarPassword(password);

    if (!esValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    //Guardamos el ID y el ROL en el token
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET
    )

    res.json({
      message: 'Autenticación exitosa',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor al intentar iniciar sesion" });
  }
}

export const perfil = (req, res) => {
  //acceso a req.usuario con el token verificado
  res.json({
    message: "Token válido. Acceso autorizado",
    datos_usuario: req.usuario
  })
}