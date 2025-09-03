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

const router = Router();

// --- Rutas para Artículos ---

// POST /api/articles -> Crear un nuevo artículo (Usuario autenticado)
router.post('/', authMiddleware, createArticle);

// GET /api/articles -> Listar todos los artículos publicados (Usuario autenticado)
router.get('/', authMiddleware, getAllPublishedArticles);

// GET /api/articles/user -> Listar artículos del usuario logueado (Usuario autenticado)
router.get('/user', authMiddleware, getMyArticles);

// GET /api/articles/user/:id -> Obtener un artículo específico del usuario logueado (Usuario autenticado)
router.get('/user/:id', authMiddleware, getMyArticleById);

// GET /api/articles/:id -> Obtener un artículo publicado por su ID (Usuario autenticado)
router.get('/:id', authMiddleware, getArticleById);

// PUT /api/articles/:id -> Actualizar un artículo (Solo Propietario o Admin)
router.put('/:id', [authMiddleware, ownerMiddleware(Article)], updateArticle);

// DELETE /api/articles/:id -> Eliminar un artículo (Solo Propietario o Admin)
router.delete('/:id', [authMiddleware, ownerMiddleware(Article)], deleteArticle);

export default router;