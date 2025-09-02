import { verifyToken } from '../helpers/jwt.helper.js';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
  }

  try {
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Token inválido o expirado.' });
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado o ha sido eliminado.' });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor al validar el token.' });
  }
};