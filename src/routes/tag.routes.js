// src/routes/tag.routes.js
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

// --- Importamos los validadores ---
import { createTagValidator, updateTagValidator } from '../validators/tag.validator.js';

const router = Router();

// ... (rutas GET sin cambios) ...
router.get('/', authMiddleware, getAllTags);
router.get('/:id', [authMiddleware, adminMiddleware], getTagById);

// --- Actualizamos las rutas POST y PUT ---

// POST /api/tags -> Crear una nueva etiqueta (Admin)
router.post('/', [authMiddleware, adminMiddleware, createTagValidator], createTag);

// PUT /api/tags/:id -> Actualizar una etiqueta por su ID (Admin)
router.put('/:id', [authMiddleware, adminMiddleware, updateTagValidator], updateTag);

// ... (ruta DELETE sin cambios) ...
router.delete('/:id', [authMiddleware, adminMiddleware], deleteTag);

export default router;