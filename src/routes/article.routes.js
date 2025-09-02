import { Router } from 'express';
import {
  createArticle,
  getAllPublishedArticles,
  getArticleById,
  getMyArticles,
  getMyArticleById
} from '../controllers/article.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// --- Rutas para Artículos ---

// POST /api/articles -> Crear un nuevo artículo
router.post('/', authMiddleware, createArticle);

// GET /api/articles -> Listar todos los artículos publicados
router.get('/', authMiddleware, getAllPublishedArticles);

// GET /api/articles/user -> Listar artículos del usuario logueado
// Importante: esta ruta debe ir ANTES de /:id para evitar conflictos.
router.get('/user', authMiddleware, getMyArticles);

// GET /api/articles/user/:id -> Obtener un artículo específico del usuario logueado
router.get('/user/:id', authMiddleware, getMyArticleById);

// GET /api/articles/:id -> Obtener un artículo publicado por su ID
router.get('/:id', authMiddleware, getArticleById);

export default router;