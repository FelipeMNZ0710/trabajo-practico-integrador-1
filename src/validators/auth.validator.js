import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

// Middleware para manejar los resultados de la validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Reglas de validación para el registro de un usuario
export const registerValidator = [
  body('username')
    .trim()
    .notEmpty().withMessage('El nombre de usuario es obligatorio.')
    .isLength({ min: 3, max: 20 }).withMessage('El nombre de usuario debe tener entre 3 y 20 caracteres.')
    .isAlphanumeric().withMessage('El nombre de usuario solo puede contener letras y números.')
    .custom(async (value) => {
      const user = await User.findOne({ where: { username: value } });
      if (user) {
        return Promise.reject('El nombre de usuario ya está en uso.');
      }
    }),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('Debe proporcionar un email válido.')
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject('El email ya está en uso.');
      }
    }),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número.'),
  body('first_name')
    .optional().trim().isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres.'),
  body('last_name')
    .optional().trim().isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres.'),
  handleValidationErrors
];

// Reglas de validación para el inicio de sesión
export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('Debe proporcionar un email válido.'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.'),
  handleValidationErrors
];

// Reglas de validación para actualizar el perfil
export const updateProfileValidator = [
  body('first_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres.')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El nombre solo puede contener letras y espacios.'),
  body('last_name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres.')
    .isAlpha('es-ES', { ignore: ' ' }).withMessage('El apellido solo puede contener letras y espacios.'),
  body('biography')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('La biografía no puede exceder los 500 caracteres.'),
  body('avatar_url')
    .optional()
    .trim()
    .isURL().withMessage('Debe proporcionar una URL válida para el avatar.'),
  body('birth_date')
    .optional()
    .isISO8601().toDate().withMessage('Debe proporcionar una fecha de nacimiento válida (YYYY-MM-DD).'),
  handleValidationErrors
];