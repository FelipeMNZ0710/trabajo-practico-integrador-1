import bcrypt from 'bcrypt';

/**
 * Hashea una contraseña en texto plano.
 * @param {string} passwordPlana La contraseña sin encriptar.
 * @returns {Promise<string>} La contraseña hasheada.
 */
export const hashPassword = async (passwordPlana) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(passwordPlana, saltRounds);
  return hashedPassword;
};

/**
 * Compara una contraseña en texto plano con una hasheada.
 * @param {string} passwordPlana La contraseña que envía el usuario.
 * @param {string} passwordHasheada La contraseña hasheada de la BD.
 * @returns {Promise<boolean>} True si las contraseñas coinciden, false si no.
 */
export const comparePassword = async (passwordPlana, passwordHasheada) => {
  const match = await bcrypt.compare(passwordPlana, passwordHasheada);
  return match;
};