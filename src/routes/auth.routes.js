import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';

const router = Router();

// GET /api/users -> Listar todos los usuarios
router.get('/', [authMiddleware, adminMiddleware], getAllUsers);

// GET /api/users/:id -> Obtener un usuario por su ID
router.get('/:id', [authMiddleware, adminMiddleware], getUserById);

// PUT /api/users/:id -> Actualizar un usuario por su ID
router.put('/:id', [authMiddleware, adminMiddleware], updateUser);

// DELETE /api/users/:id -> Eliminar (lógicamente) un usuario por su ID
router.delete('/:id', [authMiddleware, adminMiddleware], deleteUser);

export default router;