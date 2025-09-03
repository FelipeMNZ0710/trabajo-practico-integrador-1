import { body, param, validationResult } from 'express-validator';
import Article from '../models/Article.js';
import Tag from '../models/Tag.js';
import ArticleTag from '../models/ArticleTag.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Reglas de validación para agregar una etiqueta a un artículo
export const addTagToArticleValidator = [
  body('article_id')
    .notEmpty().withMessage('El ID del artículo es obligatorio.')
    .isInt().withMessage('El ID del artículo debe ser un número entero.')
    .custom(async (value) => {
      // Verificamos que el artículo realmente exista
      const article = await Article.findByPk(value);
      if (!article) {
        return Promise.reject('El artículo no existe.');
      }
    }),
  
  body('tag_id')
    .notEmpty().withMessage('El ID de la etiqueta es obligatorio.')
    .isInt().withMessage('El ID de la etiqueta debe ser un número entero.')
    .custom(async (value) => {
      // Verificación de que la etiqueta realmente exista
      const tag = await Tag.findByPk(value);
      if (!tag) {
        return Promise.reject('La etiqueta no existe.');
      }
    }),

  handleValidationErrors
];

// Reglas de validación para remover una etiqueta de un artículo
export const removeTagFromArticleValidator = [
  param('articleTagId')
    .isInt().withMessage('El ID de la asociación debe ser un número entero.')
    .custom(async (value) => {
      // Verificación de que la asociación específica exista en la tabla intermedia
      const association = await ArticleTag.findByPk(value);
      if (!association) {
        return Promise.reject('La asociación entre el artículo y la etiqueta no existe.');
      }
    }),

  handleValidationErrors
];