// src/routes/article.routes.js
import { Router } from 'express';
import {
  createArticle,
  getAllPublishedArticles,
  getArticleById,
  getMyArticles,
  getMyArticleById,
  updateArticle,
  deleteArticle
} from '../controllers/article.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ownerMiddleware } from '../middlewares/owner.middleware.js';
import Article from '../models/Article.js';

// --- Importamos los validadores ---
import { createArticleValidator, updateArticleValidator } from '../validators/article.validator.js';

const router = Router();

// ... (rutas GET sin cambios) ...
router.get('/', authMiddleware, getAllPublishedArticles);
router.get('/user', authMiddleware, getMyArticles);
router.get('/user/:id', authMiddleware, getMyArticleById);
router.get('/:id', authMiddleware, getArticleById);

// --- Actualizamos las rutas POST y PUT ---

// POST /api/articles -> Crear un nuevo artículo
router.post('/', [authMiddleware, createArticleValidator], createArticle);

// PUT /api/articles/:id -> Actualizar un artículo
router.put('/:id', [authMiddleware, ownerMiddleware(Article), updateArticleValidator], updateArticle);

// ... (ruta DELETE sin cambios) ...
router.delete('/:id', [authMiddleware, ownerMiddleware(Article)], deleteArticle);

export default router;