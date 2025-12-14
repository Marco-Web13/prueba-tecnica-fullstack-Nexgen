import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 


const SECRET = process.env.JWT_SECRET

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    req.user = user; 
    next();
  });
};

export const authorizeRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
    }
    next();
  };
};