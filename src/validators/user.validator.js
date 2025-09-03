// src/validators/user.validator.js
import { body, param, validationResult } from 'express-validator';
import User from '../models/User.js';

// Middleware reutilizable para manejar los resultados de la validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Reglas de validación para actualizar un usuario
export const updateUserValidator = [
  // Validación para el 'id' que viene en la URL (parámetro)
  param('id')
    .isInt().withMessage('El ID debe ser un número entero.')
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) {
        return Promise.reject('El usuario no existe.');
      }
    }),

  // Validación para 'username' (opcional, solo se valida si se envía)
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 }).withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres.')
    .isAlphanumeric().withMessage('El nombre de usuario solo puede contener letras y números.')
    .custom(async (value, { req }) => {
      // Verificamos que el nuevo username no esté en uso por OTRO usuario
      const user = await User.findOne({ where: { username: value } });
      if (user && user.id !== Number(req.params.id)) {
        return Promise.reject('El nombre de usuario ya está en uso por otro usuario.');
      }
    }),

  // Validación para 'email' (opcional)
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Debe proporcionar un email válido.')
    .custom(async (value, { req }) => {
      // Verificamos que el nuevo email no esté en uso por OTRO usuario
      const user = await User.findOne({ where: { email: value } });
      if (user && user.id !== Number(req.params.id)) {
        return Promise.reject('El email ya está en uso por otro usuario.');
      }
    }),

  // Validación para 'role' (opcional)
  body('role')
    .optional()
    .isIn(['user', 'admin']).withMessage("El rol debe ser 'user' o 'admin'."),

  // Middleware que ejecuta la validación y maneja los errores
  handleValidationErrors
];