import { Router } from 'express';
import {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag
} from '../controllers/tag.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();

// POST /api/tags -> Crear una nueva etiqueta (Admin)
router.post('/', [authMiddleware, adminMiddleware], createTag);

// GET /api/tags -> Listar todas las etiquetas (Usuario autenticado)
router.get('/', authMiddleware, getAllTags);

// GET /api/tags/:id -> Obtener una etiqueta por su ID (Admin)
router.get('/:id', [authMiddleware, adminMiddleware], getTagById);

// PUT /api/tags/:id -> Actualizar una etiqueta por su ID (Admin)
router.put('/:id', [authMiddleware, adminMiddleware], updateTag);

// DELETE /api/tags/:id -> Eliminar una etiqueta por su ID (Admin)
router.delete('/:id', [authMiddleware, adminMiddleware], deleteTag);

export default router;