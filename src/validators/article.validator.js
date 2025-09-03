// src/validators/article.validator.js
import { body, param, validationResult } from 'express-validator';
import Article from '../models/Article.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Reglas de validación comunes para el cuerpo de un artículo
const articleBodyValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('El título es obligatorio.')
    .isLength({ min: 3, max: 200 }).withMessage('El título debe tener entre 3 y 200 caracteres.'),
  
  body('content')
    .trim()
    .notEmpty().withMessage('El contenido es obligatorio.')
    .isLength({ min: 50 }).withMessage('El contenido debe tener al menos 50 caracteres.'),

  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('El resumen no puede exceder los 500 caracteres.'),

  body('status')
    .optional()
    .isIn(['published', 'archived']).withMessage("El estado debe ser 'published' o 'archived'.")
];

// Validación del ID del artículo en la URL
const articleIdValidator = param('id')
  .isInt().withMessage('El ID debe ser un número entero.')
  .custom(async (value) => {
    const article = await Article.findByPk(value);
    if (!article) {
      return Promise.reject('El artículo no existe.');
    }
  });


// Conjunto de validadores para la ruta de creación
export const createArticleValidator = [
  ...articleBodyValidator, // Usamos el spread operator para incluir las reglas comunes
  handleValidationErrors
];

// Conjunto de validadores para la ruta de actualización
export const updateArticleValidator = [
  articleIdValidator,
  ...articleBodyValidator,
  handleValidationErrors
];