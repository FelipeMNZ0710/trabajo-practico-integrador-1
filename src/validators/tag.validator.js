import { body, param, validationResult } from 'express-validator';
import Tag from '../models/Tag.js';

// Middleware reutilizable para manejar los resultados de la validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Reglas de validación para el nombre de la etiqueta
const tagNameValidator = body('name')
  .trim()
  .notEmpty().withMessage('El nombre de la etiqueta es obligatorio.')
  .isLength({ min: 2, max: 30 }).withMessage('El nombre debe tener entre 2 y 30 caracteres.')
  .matches(/^[a-zA-Z0-9\s\-]+$/).withMessage('El nombre solo puede contener letras, números, espacios y guiones.')
  .custom(async (value, { req }) => {
    // Verificamos que el nuevo nombre no esté en uso por OTRA etiqueta
    const tag = await Tag.findOne({ where: { name: value } });
    // Si estamos actualizando (PUT), permitimos que el nombre sea el mismo que el actual
    if (tag && req.params.id && tag.id === Number(req.params.id)) {
      return true;
    }
    // Si la etiqueta existe y no estamos actualizando esa misma, es un error
    if (tag) {
      return Promise.reject('El nombre de la etiqueta ya está en uso.');
    }
  });

// Validación para el ID del parámetro en la URL
const tagIdValidator = param('id')
  .isInt().withMessage('El ID debe ser un número entero.')
  .custom(async (value) => {
    const tag = await Tag.findByPk(value);
    if (!tag) {
      return Promise.reject('La etiqueta no existe.');
    }
  });


// Conjunto de validadores para la ruta de creación
export const createTagValidator = [
  tagNameValidator,
  handleValidationErrors
];

// Conjunto de validadores para la ruta de actualización
export const updateTagValidator = [
  tagIdValidator,
  tagNameValidator,
  handleValidationErrors
];