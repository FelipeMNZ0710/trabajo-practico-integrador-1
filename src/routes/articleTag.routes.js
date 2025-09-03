// src/routes/articleTag.routes.js
import { Router } from 'express';
import { addTagToArticle, removeTagFromArticle } from '../controllers/articleTag.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

// --- Importamos los validadores ---
import { addTagToArticleValidator, removeTagFromArticleValidator } from '../validators/articleTag.validator.js';

const router = Router();

// POST /api/articles-tags -> Agregar una etiqueta a un artículo
router.post('/', [authMiddleware, addTagToArticleValidator], addTagToArticle);

// DELETE /api/articles-tags/:articleTagId -> Remover una etiqueta de un artículo
router.delete('/:articleTagId', [authMiddleware, removeTagFromArticleValidator], removeTagFromArticle);

export default router;