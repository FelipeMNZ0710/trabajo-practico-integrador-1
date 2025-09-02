import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;

/**
 * Genera un token JWT para un usuario.
 * @param {object} payload - Los datos que se quieren guardar en el token (ej: id, role del usuario).
 * @returns {string} El token JWT generado.
 */
export const generateToken = (payload) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: '1h' 
  });
  return token;
};

/**
 * Verifica la validez de un token JWT.
 * @param {string} token - El token JWT a verificar.
 * @returns {object|null} El payload del token si es válido, o null si no lo es.
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null; 
  }
};