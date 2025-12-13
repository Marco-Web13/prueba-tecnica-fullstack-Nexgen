import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({ message: "Acceso denegado" });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: "Formato de token inválido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; 

    next();
  } catch (error) {
    // Si el token es falso, cae aquí
    return res.status(403).json({ message: "Token invalido" });
  }
}

export const authorizeRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // req.usuario viene del middleware anterior (verifyToken)
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        message: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}` 
      });
    }
    next();
  };
};